import {Nav, Navbar, NavLink, Image} from "react-bootstrap";
import {Link} from "react-router-dom";
import {userSession, authenticate} from '../auth';

const Navigation = () => {
  return (
    <Navbar collapseOnSelect expand="sm" bg="dark" variant="dark">
      <section className="container">
        <Navbar.Toggle aria-controls="navbarScroll" data-bs-toggle="collapse" data-bs-target="#navbarScroll"/>
        <Navbar.Collapse id="navbarScroll">
          <Nav>
            <NavLink eventKey="1" as={Link} to="/">Home</NavLink>
            <NavLink eventKey="2" as={Link} to="/books">Books</NavLink>
            <NavLink eventKey="3" as={Link} to="/users">Users</NavLink>
            <NavLink eventKey="4" as={Link} to="/bookstores">Bookstores</NavLink>
          </Nav>
        </Navbar.Collapse>
      </section>
    </Navbar>
  );
}

export default Navigation;