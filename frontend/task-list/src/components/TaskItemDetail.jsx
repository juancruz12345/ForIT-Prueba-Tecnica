import { useParams, Link } from "react-router-dom"


import { useState } from "react"

import { useTasks } from "../context/TasksContext"
import { Alert, Card, Spinner, Badge, Button, Form, Row, Col, Modal } from "react-bootstrap"

import "./TaskItemDetail.css"

export default function TaskItemDetail() {
  const { data: tasks, isLoading, error, updateTask, deleteTask, isUpdating, isDeleting } = useTasks()
  const { id } = useParams()
  
  const [isEditing, setIsEditing] = useState(false)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editTitle, setEditTitle] = useState("")


  const [editDescription, setEditDescription] = useState("")
  const [editError, setEditError] = useState(null)


  const task = tasks?.find((task) => task.id == id)
  

  useState(() => {
    if (task) {
      setEditTitle(task.title)

      setEditDescription(task.description)
    }

  }, [task])

    const handleToggleComplete = async () => {
        if (!task) return
    
        try {
      await updateTask({
        id: task.id,
        updatedTask: {
          title: task.title,
          description: task.description,
          completed: !task.completed
        }
      })
    } catch (e) {
      console.error("Error al actualizar el estado de la tarea:", e)
    }
     }

    const handleUpdate = async () => {
    if (!task) return
    

    if (editTitle.trim().length < 3 || editDescription.trim().length < 3) {
      setEditError("El título y la descripción deben tener al menos 3 caracteres")
      return
    }




    try {
      await updateTask({
        id: task.id,
        updatedTask: {
          title: editTitle,
          description: editDescription,
          completed: task.completed
        }
      })

      setIsEditing(false)
      setEditError(null)
    } catch (e) {

      setEditError(e.message || "Error al actualizar la tarea")

    }
  }

  const handleDelete = async () => {
    if (!task) return
    
    try {
      await deleteTask(task.id)


     
      window.history.back()
    } catch (e) {

      console.error("Error al eliminar la tarea:", e)
      setShowDeleteModal(false)
    }
  }

  const cancelEdit = () => {
    if (task) {
      setEditTitle(task.title)
      setEditDescription(task.description)
    }

    setIsEditing(false)
    setEditError(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  const formatTime = (dateString) => {
    if (!dateString) return ""
    
    const date = new Date(dateString)
    const offset = 3
    const localTime = new Date(date.getTime() - (offset * 60 * 60 * 1000))
    
    return localTime.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  if (isLoading) {
    return (
      <div className="task-detail-container">
        <div className="text-center py-5">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Cargando tarea...</span>
          </Spinner>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="task-detail-container">
        <Alert variant="danger">
          {typeof error === "string" ? error : "Error al cargar la tarea"}
        </Alert>
        <div className="mt-3">
          <Link to="/" className="btn btn-primary">
            ⬅ Volver a la lista
          </Link>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="task-detail-container">
        <Alert variant="warning">
          No se encontró la tarea con ID: {id}
        </Alert>
        <div className="mt-3">
          <Link to="/" className="btn btn-primary">
             ⬅ Volver a la lista
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="task-detail-container">
      <div className="mb-4">
        <Link to="/" className="btn btn-outline-primary">
           ⬅ Volver a la lista
        </Link>
      </div>

      <Card className="task-detail-card">
        {isEditing ? (
          <Card.Body>
            {editError && (
              <Alert variant="danger" dismissible onClose={() => setEditError(null)}>
                {editError}
              </Alert>
            )}
            
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  disabled={isUpdating}
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  disabled={isUpdating}
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="success" onClick={handleUpdate} disabled={isUpdating}>
                  {isUpdating ? <Spinner size="sm" /> : <span>✔</span>}
                  Guardar cambios
                </Button>
                <Button variant="secondary" onClick={cancelEdit} disabled={isUpdating}>
                 <span>❌</span> Cancelar
                </Button>
              </div>
            </Form>
          </Card.Body>
        ) : (
          <>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  className="task-detail-checkbox me-3"
                  checked={task.completed === 1}
                  onChange={handleToggleComplete}
                  disabled={isUpdating}
                  aria-label={`Marcar tarea como ${task.completed === 1 ? 'pendiente' : 'completada'}`}
                />
                <div>
                  <h2 className={`task-detail-title mb-0 ${task.completed === 1 ? "completed-task" : ""}`}>
                    {task.title}
                  </h2>
                </div>
              </div>
              <Badge 
                bg={task.completed === 1 ? "success" : "warning"} 
                className="task-detail-status"
              >
                {task.completed === 1 ? "Completada" : "Pendiente"}
              </Badge>
            </Card.Header>
            
            <Card.Body>
              <div className="task-detail-metadata mb-4">
                <div className="task-detail-metadata-item">
                  📅 
                  <span>Creada el {formatDate(task.created_at)}</span>
                </div>
                <div className="task-detail-metadata-item">
                  🕑
                  <span>Hora: {formatTime(task.created_at)}</span>
                </div>
              </div>
              
              <Card.Title>Descripción</Card.Title>
              <Card.Text className={`task-detail-description ${task.completed === 1 ? "completed-task" : ""}`}>
                {task.description || "Sin descripción"}
              </Card.Text>
              
              <Row className="mt-4">
                <Col>
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      onClick={() => setIsEditing(true)}
                      disabled={isUpdating}
                    >
                    ✏ Editar
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      onClick={() => setShowDeleteModal(true)}
                      disabled={isDeleting}
                    >
                     🗑 Eliminar
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </>
        )}
      </Card>

      {/* Modal de confirmación para eliminar */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la tarea <strong>{task.title}</strong>?
          <br />
          Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner size="sm" /> : "Eliminar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
