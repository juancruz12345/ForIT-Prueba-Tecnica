
import { useState } from "react"
import { Button, Form, Spinner, Card, Alert, Container } from "react-bootstrap"
import "./TaskForm.css"
import { useTasks } from "../context/TasksContext"

export function TaskForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [validated, setValidated] = useState(false)

  const { createTask, isCreating } = useTasks();


  const handleChangeTitle = (e) => {
    setTitle(e.currentTarget.value)
  }

  const handleChangeDescription = (e) => {
    setDescription(e.currentTarget.value)
  }
const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.currentTarget;

  if (!form.checkValidity()) {
    e.stopPropagation();
    setValidated(true);
    return;
  }

  try {
    await createTask({ title, description });
    setTitle("");
    setDescription("");
    setValidated(false);
    setShowSuccess(true);
    
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  } catch (error) {
    setErrorMsg(error.message || "Error al crear la tarea");
  }
};
/*
  const handleTaskAdded = () => {
    fetchTasks()
  }*/

  return (
    <Container className="task-form-container">
      <Card className="task-form-card">
        <Card.Header className="bg-secondary text-white">
          <h3 className="mb-0">Nueva Tarea</h3>
        </Card.Header>
        <Card.Body>
          {errorMsg && (
            <Alert variant="danger" dismissible onClose={() => setErrorMsg("")}>
              {errorMsg}
            </Alert>
          )}

          {showSuccess && <Alert variant="success">¡Tarea agregada exitosamente!</Alert>}

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={handleChangeTitle}
                required
                minLength={3}
                placeholder="Ingresa el título de la tarea"
              />
              <Form.Control.Feedback type="invalid">El título debe tener al menos 3 caracteres</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={handleChangeDescription}
                required
                minLength={3}
                placeholder="Describe la tarea a realizar"
              />
              <Form.Control.Feedback type="invalid">
                La descripción debe tener al menos 3 caracteres
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid">
             <Button variant="primary" type="submit" disabled={isCreating} className="submit-button">
  {isCreating ? (
    <>
      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
      Creando...
    </>
  ) : (
    "Crear Tarea"
  )}
</Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}
