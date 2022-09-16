import moment from "moment";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Media,
  Navbar,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import { useAuth } from "../../components/context";
import HeaderPage from "../../components/Headers/HeaderPage";

const MotoristaPage = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [nome, setNome] = useState();
  const [valor, setValor] = useState();
  const [endereco, setEndereco] = useState();
  const [cidade, setCidade] = useState();
  const [bairro, setBairro] = useState();
  const [email, setEmail] = useState();
  const [page, setPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState([]);
  const [todosPerpage, setTodosPerpage] = useState(10);
  const [id, setId] = useState();

  const { motorista, ListaMotorista } = useAuth();

  const sucesso = () => toast.success("Cadastrado com Sucesso!");
  const sucessoEdit = () => toast.success("Editado com Sucesso!");
  const sucessoDel = () => toast.success("Deletado com Sucesso!");
  const erro = () => toast.error("Erro ao Cadastrar!");
  const erroAtt = () => toast.error("Erro ao Atualizar!");
  const erroDel = () => toast.error("Erro ao Deletar!");

  function togleOpenEdit(item) {
    if (editOpen === false) {
      setEditOpen(true);
      setOpen(false);
      setValor(moment(item.validade, "DD-MM-YYYY").format("DD-MM-YYYY"));
      setNome(item.nome);
      setId(item.id);
    } else {
      setEditOpen(false);
    }
  }

  function togleOpenAdd() {
    if (open === false) {
      setOpen(true);
      setEditOpen(false);
      setNome();
      setValor();
      setId();
    } else {
      setOpen(false);
    }
  }

  async function AddCliente() {
    const motorista_name = nome;
    const motorista_validate = valor;

    const bodyKm = {
      motorista_name,
      motorista_validate,
    };

    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/driver/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bodyKm),
        }
      );
      setOpen(!open);
      sucesso();
      ListaMotorista();
    } catch (err) {
      console.error(err.message);
    }
  }

  async function delCliente(item) {
    try {
      const deleteTodo = await fetch(
        `https://api.devteam.vps-kinghost.net/driver/delete/${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      sucessoDel();
      ListaMotorista();
    } catch (err) {
      erroDel();
      console.error(err.message);
    }
  }

  async function editCliente() {
    const motorista_name = nome;
    const motorista_validate = valor;

    const body = {
      motorista_name,
      motorista_validate,
    };
    try {
      const response = await fetch(
        `https://api.devteam.vps-kinghost.net/driver/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );
      sucessoEdit();
      setEditOpen(!editOpen);
      ListaMotorista();
    } catch (err) {
      erroAtt();
      console.error(err.message);
    }
  }

  function pageLimits() {
    const pagination = motorista.slice(
      (currentPage - 1) * todosPerpage,
      currentPage * todosPerpage
    );
    setPage(pagination);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(motorista.length / todosPerpage); i++) {
      pageNumbers.push(i);
      setTotalPage(pageNumbers);
    }
  }

  useEffect(() => {
    pageLimits();
  }, [
    open,
    editOpen,
    currentPage,
    nome,
    valor,
    endereco,
    cidade,
    bairro,
    motorista,
  ]);
  return (
    <>
      <Navbar
        className="navbar-top navbar-dark"
        expand="md"
        id="navbar-main"
      ></Navbar>
      <HeaderPage />
      <ToastContainer autoClose={3000} />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <h3 className="mb-0">Lista de Motoristas</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Validade CNH</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {page.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span
                              className="mb-0 text-sm"
                              style={{
                                color:
                                  moment(item.validade, "DD-MM-YYYY").format(
                                    "YYYYMMDD"
                                  ) >= moment(new Date()).format("YYYYMMDD")
                                    ? ""
                                    : "red",
                              }}
                            >
                              {item?.nome}
                            </span>
                          </Media>
                        </Media>
                      </th>

                      <td
                        style={{
                          color:
                            moment(item.validade, "DD-MM-YYYY").format(
                              "YYYYMMDD"
                            ) >= moment(new Date()).format("YYYYMMDD")
                              ? ""
                              : "red",
                        }}
                      >
                        {item?.validade}
                      </td>
                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem onClick={() => togleOpenEdit(item)}>
                              Editar
                            </DropdownItem>
                            <DropdownItem onClick={() => delCliente(item)}>
                              Deletar
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <Button color="success" onClick={togleOpenAdd}>
                  Novo Motorista
                </Button>
                <nav aria-label="...">
                  <Pagination
                    className="pagination justify-content-end mb-0"
                    listClassName="justify-content-end mb-0"
                  >
                    <PaginationItem className={currentPage === 1 && `disabled`}>
                      <PaginationLink
                        onClick={() => setCurrentPage(currentPage - 1)}
                        tabIndex="-1"
                      >
                        <i className="fas fa-angle-left" />
                        <span className="sr-only">Anterior</span>
                      </PaginationLink>
                    </PaginationItem>

                    {totalPage.map((index) => (
                      <PaginationItem className="active" key={index}>
                        <PaginationLink
                          style={{
                            background: currentPage === index ? "black" : "",
                          }}
                          onClick={() => setCurrentPage(index)}
                        >
                          {index}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem
                      className={
                        totalPage.length === currentPage ? `disabled` : ``
                      }
                    >
                      <PaginationLink
                        onClick={() => setCurrentPage(currentPage + 1)}
                      >
                        <i className="fas fa-angle-right" />
                        <span className="sr-only">Proximo</span>
                      </PaginationLink>
                    </PaginationItem>
                  </Pagination>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>
        {editOpen === true && (
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <large>Editar Motorista</large>
            </div>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-user" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Nome"
                    type="text"
                    autoComplete="novo-nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-calendar-alt" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Valor"
                    type="date"
                    value={moment(valor, "DD-MM-YYYY").format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setValor(moment(e.target.value).format("DD-MM-YYYY"))
                    }
                  />
                </InputGroup>
              </FormGroup>

              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="button"
                  onClick={editCliente}
                >
                  Atualizar
                </Button>
              </div>
            </Form>
          </CardBody>
        )}
        {open === true && (
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <large>Novo Motorista</large>
            </div>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-user" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Nome"
                    type="text"
                    autoComplete="novo-nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-calendar-alt" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Valor"
                    type="date"
                    value={moment(valor, "DD-MM-YYYY").format("YYYY-MM-DD")}
                    onChange={(e) =>
                      setValor(moment(e.target.value).format("DD-MM-YYYY"))
                    }
                  />
                </InputGroup>
              </FormGroup>

              <div className="text-center">
                <Button
                  className="my-4"
                  color="primary"
                  type="button"
                  onClick={AddCliente}
                >
                  Cadastrar
                </Button>
              </div>
            </Form>
          </CardBody>
        )}
      </Container>
    </>
  );
};

export default MotoristaPage;
