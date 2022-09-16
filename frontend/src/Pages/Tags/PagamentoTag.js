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

const PagamentoPage = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [nome, setNome] = useState();
  const [valor, setValor] = useState("0");
  const [endereco, setEndereco] = useState();
  const [cidade, setCidade] = useState();
  const [bairro, setBairro] = useState();
  const [email, setEmail] = useState();
  const [page, setPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState([]);
  const [todosPerpage, setTodosPerpage] = useState(10);
  const [id, setId] = useState();
  const [checked, setChecked] = useState(false);

  const {
    SearchFinanceTag,
    digitado,
    setDigitado,
    ListaFornecedor,
    financeTag,
    auth,
  } = useAuth();

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
      setValor(item.valor);
      setNome(item.nome);
      setChecked(item.status);
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
      setValor("0");
      setChecked(false);
      setId();
    } else {
      setOpen(false);
    }
  }

  async function AddCliente() {
    const pagamento_name = nome;
    const pagamento_valor = valor;
    const pagamento_status = checked;

    const body = {
      pagamento_name,
      pagamento_valor,
      pagamento_status,
    };
    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/payment/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );
      sucesso();
      SearchFinanceTag();
      setOpen(false);
      setValor("");
      setNome("");
      setChecked(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  async function delCliente(item) {
    try {
      const deleteTodo = await fetch(
        `https://api.devteam.vps-kinghost.net/payment/delete/${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      sucessoDel();
      SearchFinanceTag();
    } catch (err) {
      erroDel();
      console.error(err.message);
    }
  }

  async function editCliente() {
    const pagamento_name = nome;
    const pagamento_valor = valor;
    const pagamento_status = checked;

    const body = {
      pagamento_name,
      pagamento_valor,
      pagamento_status,
    };
    try {
      const response = await fetch(
        `https://api.devteam.vps-kinghost.net/payment/update/${id}`,
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
      SearchFinanceTag();
    } catch (err) {
      erroAtt();
      console.error(err.message);
    }
  }

  function pageLimits() {
    const pagination = financeTag.slice(
      (currentPage - 1) * todosPerpage,
      currentPage * todosPerpage
    );
    setPage(pagination);

    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(financeTag.length / todosPerpage); i++) {
      pageNumbers.push(i);
      setTotalPage(pageNumbers);
    }
  }

  useEffect(() => {
    SearchFinanceTag();
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
    financeTag,
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
                <h3 className="mb-0">Lista Tag de Pagamento</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Limite</th>
                    <th scope="col">Status</th>
                    {/*<th scope="col">Endereço</th>
                                        <th scope="col">Bairro</th>
                                        <th scope="col">Cidade</th> */}
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {page.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">{item?.nome}</span>
                          </Media>
                        </Media>
                      </th>
                      <td>{item?.valor}</td>
                      <td>{item?.status ? "Sim" : "Nao"}</td>
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
                  Nova Tag
                </Button>
                {totalPage.length > 0 && (
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      {currentPage !== totalPage[0] && (
                        <PaginationItem className="active">
                          <PaginationLink
                            style={{
                              zIndex: 0,
                            }}
                            onClick={() => setCurrentPage(totalPage[0])}
                          >
                            <i className="fas fa-angle-left" />{" "}
                            <i className="fas fa-angle-left" />
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      <PaginationItem
                        className={currentPage === 1 && `disabled`}
                      >
                        <PaginationLink
                          onClick={() => setCurrentPage(currentPage - 1)}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Anterior</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="active">
                        <PaginationLink
                          style={{
                            background: "#F8485E",
                            zIndex: 0,
                            border: "none",
                          }}
                          onClick={() => setCurrentPage(currentPage)}
                        >
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>
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
                      {currentPage < totalPage.length && (
                        <PaginationItem className="active">
                          <PaginationLink
                            style={{
                              // background: currentPage === index ? "black" : "",
                              zIndex: 0,
                            }}
                            onClick={() => setCurrentPage(totalPage.length)}
                          >
                            <i className="fas fa-angle-right" />
                            <i className="fas fa-angle-right" />
                          </PaginationLink>
                        </PaginationItem>
                      )}
                    </Pagination>
                  </nav>
                )}
              </CardFooter>
            </Card>
          </div>
        </Row>
        {editOpen === true && (
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <large>Editar Tag</large>
            </div>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-tags" />
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
                      <i className="fas fa-spinner" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Valor"
                    type="text"
                    autoComplete="novo-valor"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <ButtonGroup
                  className="input-group-alternative"
                  style={{ marginTop: "10px" }}
                >
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-id-card " />
                    </InputGroupText>
                  </InputGroupAddon>

                  <Button
                    onClick={() => setChecked(!checked)}
                    color={checked ? "success" : ""}
                  >
                    {checked ? "Sim" : "Não"}
                  </Button>
                </ButtonGroup>
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
              <large>Nova Tag</large>
            </div>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-tags" />
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
                      <i className="fas fa-spinner" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Limite"
                    type="text"
                    autoComplete="novo-valor"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup>
                <ButtonGroup
                  className="input-group-alternative"
                  style={{ marginTop: "10px" }}
                >
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-id-card " />
                    </InputGroupText>
                  </InputGroupAddon>

                  <Button
                    onClick={() => setChecked(!checked)}
                    color={checked ? "success" : ""}
                  >
                    {checked ? "Sim" : "Não"}
                  </Button>
                </ButtonGroup>
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

export default PagamentoPage;
