
import { useState } from "react"
import { Badge, Card, Row, Col, Button, Form, Spinner, Modal } from "react-bootstrap"
import { Link } from "react-router-dom"


import "./TaskItem.css"
import { useTasks } from "../context/TasksContext"

export function TaskItem({ task }) {
  const [isEditing, setIsEditing] = useState(false)
 
  const [editTitle, setEditTitle] = useState(task.title)
  
  const [editDescription, setEditDescription] = useState(task.description)
  const [error, setError] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const { updateTask, isUpdating, deleteTask, isDeleting } = useTasks()


  const handleUpdate = async () => {
    if (editTitle.trim().length < 3 || editDescription.trim().length < 3) {
      setError("El título y la descripción deben tener al menos 3 caracteres")
      return
    }
    try {
      await updateTask({
        id: task.id,
        updatedTask: {
          title: editTitle,
          description: editDescription,
          completed: task.completed,
        },
      })

      setIsEditing(false)
    } catch (e) {
      setError(e.message || "Error al actualizar la tarea")
    }
  }


  const handleDelete = async () => {
    try {
      await deleteTask(task.id)
      setShowDeleteModal(false)
    } catch (e) {


      setError(e.message || "Error al eliminar la tarea")
      setShowDeleteModal(false)
    }
  }

  const handleToggleComplete = async () => {
    try {
      await updateTask({
        id: task.id,
        updatedTask: {
          title: task.title,
          description: task.description,
          completed: !task.completed,
        },
      })
    } catch (e) {
      setError(e.message || "Error al actualizar el estado de la tarea")
    }
  }

  const cancelEdit = () => {


    setEditTitle(task.title)
    setEditDescription(task.description)
    setIsEditing(false)

    setError(null)
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

  return (
    <>
      <Card className="task-item mb-3">
        <Card.Body>
          {error && (
            <div className="mb-3">
              <Badge bg="danger" className="w-100 p-2">
                {error}
              </Badge>
            </div>
          )}

          {isEditing ? (
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

              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  disabled={isUpdating}
                />
              </Form.Group>

              <div className="d-flex gap-2">
                <Button variant="success" size="sm" onClick={handleUpdate} disabled={isUpdating}>
                  {isUpdating ? <Spinner size="sm" /> : <span>✔</span>} Guardar
                </Button>
                <Button variant="secondary" size="sm" onClick={cancelEdit} disabled={isUpdating}>
                  Cancelar
                </Button>
              </div>
            </Form>
          ) : (
            <Row>
              <Col>
                <div className="d-flex align-items-start">
                 
                  <Form.Check
                    type="checkbox"
                    className="task-checkbox me-2 mt-1"
                    id="checkbox"
                    checked={task.completed === 1}
                    onChange={handleToggleComplete}
                    disabled={isUpdating}
                   
                    aria-label={`Marcar tarea ${task.title} como ${task.completed === 1 ? "pendiente" : "completada"}`}
                  />

                  <div className="task-content flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <h4 className={`task-title ${task.completed === 1 ? "completed-task" : ""}`}>{task.title}</h4>
                      <Badge bg={task.completed === 1 ? "success" : "warning"} className="task-status ms-2">
                        {task.completed === 1 ? "Completada" : "Pendiente"}
                      </Badge>
                    </div>
                    <p className={`task-description ${task.completed === 1 ? "completed-task" : ""}`}>
                      {task.description}
                    </p>
                  </div>
                </div>

                <div className="task-footer">
                 

                  <div className="task-actions">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      disabled={isUpdating}
                    >
                      ✏
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => setShowDeleteModal(true)}
                      disabled={isDeleting}
                    >
                      🗑
                    </Button>
                  </div>

                   <small className="text-muted">  📅 Creada el{formatDate(task.created_at)}</small>
                </div>
              </Col>
            </Row>
          )}
        </Card.Body>
        <Card.Footer>   
          <Button as={Link} to={`/task/${task.id}`} >Ver detalles</Button>
        </Card.Footer>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que deseas eliminar la tarea <strong>"{task.title}"</strong>? Esta acción no se puede
          deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? <Spinner size="sm" /> : "Eliminar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}


