

import { createContext, useContext } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"


const TasksContext = createContext(null)


function useFetchTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3000/api/task`)
      if (!response.ok) {
        throw new Error("Error al cargar las tareas")
      }
      return response.json()
    },
    staleTime: 1000 * 60 * 20,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })
}

export function TasksProvider({ children }) {
  const queryClient = useQueryClient()


  const { data = [], isLoading, error } = useFetchTasks()


  const createTaskMutation = useMutation({
    mutationFn: async (newTask) => {
      const response = await fetch("http://localhost:3000/api/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al crear la tarea")
      }

      return response.json()
    },
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })


  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, updatedTask }) => {
      const response = await fetch(`http://localhost:3000/api/task/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al actualizar la tarea")
      }

      return response.json()
    },
    onSuccess: (data, variables) => {
 
      queryClient.setQueryData(["tasks"], (oldData) => {
        if (!oldData) return []
        return oldData.map((task) => (task.id === variables.id ? data : task))
      })

  
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })


  const deleteTaskMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`http://localhost:3000/api/task/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Error al eliminar la tarea")
      }

      return id
    },
    onSuccess: (deletedId) => {
     
      queryClient.setQueryData(["tasks"], (oldData) => {
        if (!oldData) return []
        return oldData.filter((task) => task.id !== deletedId)
      })

     
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
    },
  })

  
  const contextValue = {
   
    data,
    isLoading,
    error,

    
    createTask: (newTask) => createTaskMutation.mutate(newTask),
    createTaskAsync: (newTask) => createTaskMutation.mutateAsync(newTask),
    isCreating: createTaskMutation.isLoading,
    createError: createTaskMutation.error,

 
    updateTask: (params) => updateTaskMutation.mutate(params),
    updateTaskAsync: (params) => updateTaskMutation.mutateAsync(params),
    isUpdating: updateTaskMutation.isLoading,
    updateError: updateTaskMutation.error,

    deleteTask: (id) => deleteTaskMutation.mutate(id),
    deleteTaskAsync: (id) => deleteTaskMutation.mutateAsync(id),
    isDeleting: deleteTaskMutation.isLoading,
    deleteError: deleteTaskMutation.error,
  }

  return <TasksContext.Provider value={contextValue}>{children}</TasksContext.Provider>
}


export function useTasks() {
  const context = useContext(TasksContext)

  if (context === null) {
    throw new Error("useTasks debe ser usado dentro de un TasksProvider")
  }

  return context
}
