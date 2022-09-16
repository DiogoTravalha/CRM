import { useEffect, useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";

import { Redirect, Route, Switch } from "react-router-dom";
import AdminLayout from "../../layouts/Admin.js";
import LoadingPage from "../../components/Loading/Loading.jsx";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [msgError, setMsgError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setMsgError(false);
    setLoading(true);
    const user_email = email;
    const user_password = password;

    const res = await axios
      .post(
        "https://api.devteam.vps-kinghost.net/login",
        {
          user_email,
          user_password,
        },
        { timeout: 5000 }
      )
      .then((doc) => {
        localStorage.setItem("token", doc.data.token);
        window.location.replace(
          <Redirect
            to="/admin"
            render={(props) => <AdminLayout {...props} />}
          />
        );
      })
      .catch((err) => {
        setMsgError(true);
        setLoading(false);
        return { erro: true, msg: "Email ou Senha Inválido" };
      });
  }

  return (
    <>
      <Col lg="5" md="7">
        <Card className="bg-secondary shadow border-0">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Faça Login </small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Senha"
                    type="password"
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                  />
                </InputGroup>
              </FormGroup>
              {msgError && (
                <div className="text-center text-warning mb-1">
                  <small>Email ou Senha Inválido</small>
                </div>
              )}

              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="button"
                  onClick={() => handleLogin()}
                >
                  {loading ? <LoadingPage /> : "Entrar"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};

export default Login;
