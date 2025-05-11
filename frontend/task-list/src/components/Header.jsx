import { Navbar, Nav,  } from "react-bootstrap"
import { Link } from "react-router-dom"
import './Header.css'

export function Header(){


    return(
        <header>
            <Navbar expand="lg" className="navbar">
            <Nav style={{gap:'2rem'}}>
                <Nav.Link className="navlink" as={Link} to='/'>Lista de Tareas</Nav.Link>
                <Nav.Link className="navlink" as={Link} to='/tasksform' >Crear Tarea</Nav.Link>
            </Nav>
            </Navbar>
        </header>
    )
}