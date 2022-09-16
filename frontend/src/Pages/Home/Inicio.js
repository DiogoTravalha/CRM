import moment from "moment";
import { useEffect, useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
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
import Header from "../../components/Headers/Header";

const Inicio = () => {
  const {
    serviceClosed,
    SearchService,
    mesAtual,
    setMesAtual,
    anoAtual,
    setAnoAtual,
    serviceTag,
    SearchServiceTag,
  } = useAuth();

  /////
  const [page, setPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState([]);
  const [todosPerpage, setTodosPerpage] = useState(5);
  const [listAno, setListAno] = useState([moment().year().toString()]);
  const [filterListMes, setFilterListMes] = useState(
    (moment().month() + 1).toString()
  );
  const [filterListAno, setFilterListAno] = useState(
    moment().year().toString()
  );
  const [id, setId] = useState();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [nomeValue, setNomeValue] = useState();
  const [nome, setNome] = useState("");
  const [entrega, setEntrega] = useState();
  const [valor, setValor] = useState();
  const [ambiente, setAmbiente] = useState();
  const [statusProgresso, setStatusProgresso] = useState("Sem Tag");
  const [valorProgresso, setValorProgresso] = useState("0");
  const [valueEntrega, setValueEntrega] = useState();
  const [valueFechado, setValueFechado] = useState();
  const [dataFechado, setDataFechado] = useState();
  const [statusEntrega, setStatusEntrega] = useState("Compras");
  const [valorProgressoEntrega, setValorProgressoEntrega] = useState("10");
  const [mes, setMes] = useState();
  const [ano, setAno] = useState();
  const [digitado, setDigitado] = useState("");

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
      setNome(item.nome);
      setValor(item.valor);
      setAmbiente(item.ambiente);
      setValorProgresso(item.valorProgresso);
      setStatusEntrega(item.statusEntrega);
      setValorProgressoEntrega(item.valorProgressoEntrega);
      setMes(item.mes);
      setAno(item.ano);
      setDataFechado(item.fechado);
      setEntrega(item.entrega);
      setId(item.id);
      setStatusProgresso(item.status);
    } else {
      setEditOpen(false);
    }
  }

  function updadeStatus(e) {
    let idx = e.target.selectedIndex;
    let dataset = e.target.options[idx].dataset;
    setStatusProgresso(e.target.value);
    setValorProgresso(dataset.isd);
  }

  async function delCliente(item) {
    try {
      const deleteTodo = await fetch(
        `https://api.devteam.vps-kinghost.net/service/delete/${item.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      sucessoDel();
      SearchService();
    } catch (err) {
      erroDel();
      console.error(err.message);
    }
  }

  async function editCliente() {
    const servico_name = nome;
    const servico_price = valor;
    const servico_environment = ambiente;
    const servico_status = valorProgresso;
    const servico_progress = statusProgresso;
    const servico_statusdelivery =
      statusProgresso.toLowerCase() === "fechada" ? statusEntrega : "";
    const servico_progressdelivery =
      statusProgresso.toLowerCase() === "fechada" ? valorProgressoEntrega : "";
    const servico_month =
      statusProgresso.toLowerCase() === "fechada" ? mes : "";
    const servico_year = statusProgresso.toLowerCase() === "fechada" ? ano : "";
    const servico_closed =
      statusProgresso.toLowerCase() === "fechada" ? dataFechado : "";
    const servico_delivery =
      statusProgresso.toLowerCase() === "fechada" ? entrega : "";

    const body = {
      servico_name,
      servico_price,
      servico_environment,
      servico_progress,
      servico_status,
      servico_statusdelivery,
      servico_progressdelivery,
      servico_month,
      servico_year,
      servico_closed,
      servico_delivery,
    };

    try {
      const response = await fetch(
        `https://api.devteam.vps-kinghost.net/service/update/${id}`,
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
      SearchService();
    } catch (err) {
      erroAtt();
      console.error(err.message);
    }
  }

  function pageLimits() {
    var filtro = serviceClosed.filter(function (item) {
      const dia = moment(item.fechado, "DD-MM-YYYY");
      return (
        item.status.toLowerCase() === "fechada" &&
        item.fechado !== "" &&
        (moment(dia).month() + 1).toString() == filterListMes &&
        moment(dia).year().toString() === filterListAno
      );
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

  function filterAno() {
    const filtro = serviceClosed.filter((doc) => doc.fechado !== " ");
    const filtragem = filtro.map((item) => {
      const dia = moment(item.fechado, "DD-MM-YYYY");
      return moment(dia).year();
    });

    const lista = [...new Set(filtragem)];

    if (lista.length !== 0) {
      setListAno(lista.sort());
    }
    //  else {
    //   setListAno(moment().year().toString());
    // }
  }

  useEffect(() => {
    filterAno();
    pageLimits();
    SearchServiceTag();
    SearchService();
  }, [
    currentPage,
    mesAtual,
    anoAtual,
    setAnoAtual,
    setMesAtual,
    filterListMes,
    filterListAno,
    digitado,
  ]);

  return (
    <>
      <Navbar
        className="navbar-top navbar-dark"
        expand="md"
        id="navbar-main"
      ></Navbar>
      <Header ano={filterListAno} mes={filterListMes} />
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
                  <h3 className="mb-0">Vendas Fechadas</h3>
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
                          <i className="ni ni-calendar-grid-58" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="select"
                        defaultValue={mesAtual}
                        placeholder={mesAtual}
                        onChange={(e) => setFilterListMes(e.target.value)}
                        value={filterListMes}
                      >
                        <option value="1">Janeiro</option>
                        <option value="2">Fevereiro</option>
                        <option value="3">Março</option>
                        <option value="4">Abril</option>
                        <option value="5">Maio</option>
                        <option value="6">Junho</option>
                        <option value="7">Julho</option>

                        <option value="8">Agosto</option>
                        <option value="9">Setembro</option>
                        <option value="10">Outubro</option>
                        <option value="11">Novembro</option>
                        <option value="12">Dezembro</option>
                      </Input>
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="ni ni-calendar-grid-58" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="select"
                        defaultValue={anoAtual}
                        placeholder={anoAtual}
                        onChange={(e) => setFilterListAno(e.target.value)}
                        value={filterListAno}
                      >
                        {listAno.length === 0 ? (
                          <option value={moment().year().toString()}>
                            {moment().year().toString()}
                          </option>
                        ) : (
                          listAno.map((item, index) => (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          ))
                        )}
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
                      item.status.toLowerCase() === "fechada" && (
                        <tr key={index}>
                          <>
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
                                {item.statusEntrega}
                              </Badge>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <span className="mr-2">
                                  {item.valorProgressoEntrega}%
                                </span>
                                <div>
                                  <Progress
                                    max="100"
                                    value={item.valorProgressoEntrega}
                                    color={
                                      item.valorProgressoEntrega === "10"
                                        ? "danger"
                                        : item.valorProgressoEntrega === "20"
                                        ? "danger"
                                        : item.valorProgressoEntrega === "30"
                                        ? "danger"
                                        : item.valorProgressoEntrega === "40"
                                        ? "warning"
                                        : item.valorProgressoEntrega === "50"
                                        ? "warning"
                                        : item.valorProgressoEntrega === "60"
                                        ? "warning"
                                        : item.valorProgressoEntrega === "70"
                                        ? "info"
                                        : item.valorProgressoEntrega === "80"
                                        ? "info"
                                        : item.valorProgressoEntrega === "90"
                                        ? "info"
                                        : item.valorProgressoEntrega === "100"
                                        ? item.status.toLowerCase() ===
                                          "fechada"
                                          ? "success"
                                          : "danger"
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
                                    onClick={() => delCliente(item)}
                                  >
                                    Deletar
                                  </DropdownItem>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </td>
                          </>
                        </tr>
                      )
                  )}
                </tbody>
              </Table>

              <CardFooter className="py-4">
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

        {/* Editando Serviço */}
        {editOpen === true && (
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <large>Editar Serviço</large>
            </div>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="fas fa-dollar-sign" />
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
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-shop" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Ambiente"
                    type="text"
                    autoComplete="novo-ambiente"
                    value={ambiente}
                    onChange={(e) => setAmbiente(e.target.value)}
                  />
                </InputGroup>
              </FormGroup>

              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-watch-time" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    type="select"
                    onChange={(e) => updadeStatus(e)}
                    value={statusProgresso}
                  >
                    {serviceTag.map((item) => (
                      <option data-isd={item.valor} value={item.nome}>
                        {item.nome}
                      </option>
                    ))}
                  </Input>
                </InputGroup>
              </FormGroup>
              {/* {statusProgresso === "Fechada" && (
                <>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>Data Entrega</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        placeholder="Entrega"
                        type="date"
                        value={valueEntrega}
                        onChange={(e) =>
                          setEntrega(
                            moment(e.target.value).format("DD-MM-YYYY"),
                            setValueEntrega(e.target.value)
                          )
                        }
                      />
                    </InputGroup>
                  </FormGroup>
                  <FormGroup>
                    <InputGroup className="input-group-alternative">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>Data Fechamento</InputGroupText>
                      </InputGroupAddon>

                      <Input
                        placeholder="Fechamento"
                        type="date"
                        value={valueFechado}
                        onChange={(e) =>
                          setDataFechado(
                            moment(e.target.value).format("DD-MM-YYYY"),
                            setValueFechado(e.target.value)
                          )
                        }
                      />
                    </InputGroup>
                  </FormGroup>
                </>
              )} */}
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
      </Container>
    </>
  );
};

export default Inicio;
