import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Navbar,
} from "reactstrap";
import { useAuth } from "../context";

const AdminNavbar = (props) => {
  const { digitado, setDigitado } = useAuth();

  useEffect(() => {}, [digitado]);
  return (
    <>
      {props.brandText != "Calendário" && (
        <Navbar className="navbar-top navbar-dark" expand="md" id="navbar-main">
          <Container fluid>
            <Link
              className="h4 mb-0 text-white text-uppercase d-none d-lg-inline-block"
              to="/"
            >
              {props.brandText}
            </Link>
            {/* <Form className="navbar-search navbar-search-dark form-inline mr-3 d-none d-md-flex ml-lg-auto">
              <FormGroup className="mb-0">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-search" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder={"Busca de " + props.brandText}
                    type="text"
                    name="nome"
                    id="nome"
                    value={digitado}
                    onBlur={() => setDigitado("")}
                    onChange={(e) => setDigitado(e.currentTarget.value)}
                  />
                </InputGroup>
              </FormGroup>
            </Form> */}
          </Container>
        </Navbar>
      )}
    </>
  );
};

export default AdminNavbar;
