import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Badge,
  Button,
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
  Progress,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import { useAuth } from "../../components/context";
import HeaderPage from "../../components/Headers/HeaderPage.js";
import AddService from "./AddService";
import DelService from "./DelService";
import EditService from "./EditService";

const Servicos = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [dados, setDados] = useState();
  const [nomeValue, setNomeValue] = useState();
  const [nome, setNome] = useState("");
  const [statusProgresso, setStatusProgresso] = useState("Sem Tag");
  const [valorProgresso, setValorProgresso] = useState("0");
  const [statusEntrega, setStatusEntrega] = useState("Compras");
  const [valorProgressoEntrega, setValorProgressoEntrega] = useState("10");
  const [page, setPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState([]);
  const [todosPerpage, setTodosPerpage] = useState(5);
  const [dataFechado, setDataFechado] = useState();
  const [filtroServicos, setFiltroServicos] = useState("");
  const [digitado, setDigitado] = useState("");

  const { service, vendido, mesAtual, serviceFilter } = useAuth();

  function togleOpenEdit(item) {
    if (editOpen === false) {
      setEditOpen(true);
      setOpen(false);
      setDados(item);
    } else {
      setEditOpen(false);
    }
  }

  function togleOpenDel(item) {
    if (delOpen === false) {
      setDelOpen(true);
      setDados(item);
    } else {
      setDelOpen(false);
    }
  }

  function pageLimits() {
    const fechada = service.filter(function (item) {
      return item.status.toLowerCase() !== "fechada";
    });

    var filtro = fechada.filter(function (item) {
      return filtroServicos === "" ? item : filtroServicos === item.status;
    });

    const dados = filtro.filter((doc) => {
      return Object.keys(doc).some((key) => {
        return doc[key]
          .toString()
          .toLowerCase()
          .includes(digitado.toLowerCase());
      });
    });

    const pagination = dados.slice(
      (currentPage - 1) * todosPerpage,
      currentPage * todosPerpage
    );
    setPage(pagination);

    const pageNumbers = [];
    for (let i = 0; i <= Math.ceil(dados.length / todosPerpage); i++) {
      pageNumbers.push(i);
      const filtro = pageNumbers.filter((item, index) => index);
      setTotalPage(filtro);
    }
  }

  useEffect(() => {
    pageLimits();
  }, [
    open,
    service,
    statusProgresso,
    valorProgresso,
    nome,
    nomeValue,
    currentPage,
    valorProgressoEntrega,
    statusEntrega,
    vendido,
    mesAtual,
    dataFechado,
    filtroServicos,
    digitado,
  ]);

  return (
    <>
      <HeaderPage />
      <ToastContainer autoClose={3000} />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader
                className="border-0"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "10px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <h3 className="mb-0">Lista Serviços</h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: "10px",
                  }}
                >
                  <FormGroup className="mb-0" style={{ marginRight: "10px" }}>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fas fa-search" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Busca"
                        type="text"
                        name="nome"
                        id="nome"
                        value={digitado}
                        onChange={(e) => setDigitado(e.currentTarget.value)}
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup style={{ marginRight: "10px" }}>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="fas fa-filter" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="select"
                        defaultValue=""
                        placeholder="Filtro"
                        onChange={(e) => setFiltroServicos(e.target.value)}
                        value={filtroServicos}
                      >
                        <option value="">Filtro</option>
                        {serviceFilter.map((item) => (
                          <option value={item}>{item}</option>
                        ))}
                      </Input>
                    </InputGroup>
                  </FormGroup>
                </div>
              </CardHeader>

              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Ambiente</th>
                    <th scope="col">Status</th>
                    <th scope="col">Progresso</th>
                    <th scope="col" />
                  </tr>
                </thead>

                {/* Resultados */}
                <tbody>
                  {page.map(
                    (item, index) =>
                      item.status.toLowerCase() !== "fechada" && (
                        <tr key={index}>
                          <th scope="row">
                            <Media className="align-items-center">
                              <Media>
                                <span className="mb-0 text-sm">
                                  {item.nome}
                                </span>
                              </Media>
                            </Media>
                          </th>
                          <td>
                            {Number(item?.valor).toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </td>
                          <td>
                            <Badge color="" className="badge-dot mr-4">
                              {item.ambiente}
                            </Badge>
                          </td>
                          <td>
                            <Badge color="" className="badge-dot mr-4">
                              {item.status}
                            </Badge>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <span className="mr-2">
                                {item.valorProgresso}%
                              </span>
                              <div>
                                <Progress
                                  max="100"
                                  value={item.valorProgresso}
                                  color={
                                    item.valorProgresso === "100"
                                      ? "success"
                                      : item.valorProgresso <= "25"
                                      ? "danger"
                                      : item.valorProgresso <= "50"
                                      ? "warning"
                                      : item.valorProgresso <= "99"
                                      ? "info"
                                      : ""
                                  }
                                />
                              </div>
                            </div>
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
                              <DropdownMenu
                                className="dropdown-menu-arrow"
                                right
                              >
                                <DropdownItem
                                  onClick={() => togleOpenEdit(item)}
                                >
                                  Editar
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => togleOpenDel(item)}
                                >
                                  Deletar
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </td>
                        </tr>
                      )
                  )}
                </tbody>
              </Table>

              <CardFooter className="py-4">
                <AddService />
                <EditService
                  dados={dados}
                  editOpen={editOpen}
                  setEditOpen={setEditOpen}
                />
                <DelService
                  dados={dados}
                  delOpen={delOpen}
                  setDelOpen={setDelOpen}
                />
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
      </Container>
    </>
  );
};

export default Servicos;
