
import { Link } from "react-router-dom"
import { Container, Row, Spinner, Alert, Button, Form } from "react-bootstrap"
import { TaskItem } from "./TaskItem"

import "./TaskList.css"
import { useTasks } from "../context/TasksContext"
import { useState, useEffect } from "react"


export function TaskList() {



 
  const { data: tasks, isLoading, error } = useTasks();

  const  [filteredeTasks, setFilteredTasks] = useState(tasks || [])
   const [selectedFilter, setSelectedFilter] = useState('Todas');

   useEffect(() => {
  if (tasks) {
    // Mantener el filtro actual activo al cargar tareas nuevas
    if (selectedFilter === 'Completas') {
      setFilteredTasks(tasks.filter((t) => t.completed === 1));
    } else if (selectedFilter === 'Incompletas') {
      setFilteredTasks(tasks.filter((t) => t.completed === 0));
    } else {
      setFilteredTasks(tasks);
    }
  }
}, [tasks, selectedFilter]);


  const handleChange = (e) => {

    let value = e.currentTarget.value.toLowerCase()
    
     const filtered = tasks.filter((e)=>e.title.toLowerCase().includes(value) )
    setFilteredTasks(filtered)
 
  }

  
  const handleComplete = (e) => {
    const filter = e.currentTarget.name
    setSelectedFilter(filter)

    if (filter === 'Completas') {
      const filtered = tasks.filter((t) => t.completed === 1)
      setFilteredTasks(filtered)
    } else if (filter === 'Incompletas') {
      const filtered = tasks.filter((t) => t.completed === 0)
      setFilteredTasks(filtered)
    } else {
      setFilteredTasks(tasks)
    }
  }
 
 
  return (
    <Container className="task-app-container">
      <Row>

        <div style={{width:'90vw', display:'flex'}}>
          <Form style={{ display:'flex',alignItems:'center'}}>
           <Form.Group>
            <Form.Label>Buscar</Form.Label>
            <Form.Control  onChange={handleChange} ></Form.Control>
           </Form.Group>
      
      
      <Form.Group style={{ display:'flex', alignItems:'center'}}>
      <Form.Check
      style={{display:'flex', flexDirection:'column', alignItems:'center'}}
        name="Completas"
        type="checkbox"
        label="Completas" onChange={handleComplete} checked={selectedFilter === 'Completas'}
      />
      <Form.Check
      style={{display:'flex', flexDirection:'column', alignItems:'center'}}
        name="Incompletas"
        type="checkbox" label="Incompletas" onChange={handleComplete}
        checked={selectedFilter === 'Incompletas'}
      />
      <Form.Check
      style={{display:'flex', flexDirection:'column', alignItems:'center'}}
        name="Todas" type="checkbox"  label="Todas" onChange={handleComplete}
        checked={selectedFilter === 'Todas'}
      />
    </Form.Group>
         
          </Form>
        </div>
      

          <div className="task-list-container">
            <h2 className="mb-4 text-center">Mis Tareas</h2>

            {isLoading && !tasks && (
              <div className="text-center py-5">
                <Spinner animation="border" role="status" variant="primary">
                  <span className="visually-hidden">Cargando...</span>
                </Spinner>
              </div>
            )}

            {error && <Alert variant="danger">{error}</Alert>}

            {!isLoading && tasks && tasks.length === 0 && (
             <div>
               <Alert variant="info">No hay tareas disponibles. ¡Añade una nueva tarea para comenzar!</Alert>
              <Button as={Link} to='tasksform' >➕ Agregar tarea</Button>
             </div>
            )}

            <div className="task-list">
              {!isLoading && filteredeTasks && filteredeTasks.length > 0 && (
                    filteredeTasks.map((task) => (
                   
                        <TaskItem 
                        key={task.id}
                      task={task} 
                     
                      />
                    
  ))
)}
            </div>
          </div>
    
      </Row>
    </Container>
  )
}
