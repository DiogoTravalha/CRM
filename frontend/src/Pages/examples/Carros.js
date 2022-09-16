import moment from "moment";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
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
  CardBody,
} from "reactstrap";
import { useAuth } from "../../components/context";
import HeaderCarros from "../../components/Headers/HeaderCarros";

const CarrosPage = () => {
  const {
    vendido,
    mesAtual,
    setMesAtual,
    anoAtual,
    setAnoAtual,
    financeiro,
    compras,
    km,
    carros,
    ListaCarros,
    ListaMotorista,
  } = useAuth();
  const [open, setOpen] = useState(false);
  const [openMotorista, setOpenMotorista] = useState(false);
  const [nomeValue, setNomeValue] = useState();
  const [nome, setNome] = useState("");
  const [motoristaName, setMotoristaName] = useState("");
  const [motoristaValidate, setMotoristaValidate] = useState("");
  const [color, setColor] = useState("danger");
  const [page, setPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState([]);
  const [todosPerpage, setTodosPerpage] = useState(10);
  const [listAno, setListAno] = useState([]);
  const [filterListMes, setFilterListMes] = useState(
    (moment().month() + 1).toString()
  );
  const [filterListAno, setFilterListAno] = useState(
    moment().year().toString()
  );
  const [representanteNome, setRepresentanteNome] = useState([]);
  const [representanteFilter, setRepresentanteFilter] = useState("TODOS");
  const [valorRepresentante, setValorRepresentante] = useState(0);
  const [carroName, setCarroName] = useState("");
  const [carroPlate, setCarroPlate] = useState("");
  const [carroKm, setCarroKm] = useState("");

  const sucesso = () => toast.success("Cadastrado com Sucesso!");
  const sucessoEdit = () => toast.success("Editado com Sucesso!");
  const sucessoDel = () => toast.success("Deletado com Sucesso!");
  const erro = () => toast.error("Erro ao Cadastrar!");
  const erroAtt = () => toast.error("Erro ao Atualizar!");
  const erroDel = () => toast.error("Erro ao Deletar!");

  function trocarAno(e) {
    setFilterListAno(e.target.value);
    setCurrentPage(1);
  }

  function trocarMes(e) {
    setFilterListMes(e.target.value);
    setCurrentPage(1);
  }

  function trocarFornecedor(e) {
    setRepresentanteFilter(e.target.value);
    setCurrentPage(1);
  }

  function filterAno() {
    const filtro = km.filter((doc) => doc.dia !== "");
    const filtragem = filtro.map((item) => {
      const dia = moment(item.dia, "DD-MM-YYYY");
      return moment(dia).year();
    });

    const lista = [...new Set(filtragem)];
    setListAno(lista.sort());

    if (lista.length === 0) {
      setListAno([moment().year().toString()]);
    } else {
      setListAno(lista.sort());
    }

    const nome = carros.map((item) => item.carro);
    const newNomes = [...new Set(nome)];
    newNomes.push("TODOS");

    setRepresentanteNome(newNomes.sort());
  }

  function pageLimits() {
    if (representanteFilter === "TODOS") {
      const filtragemNova = km.filter(function (item) {
        const dia = moment(item.dia, "DD-MM-YYYY - HH:mm:ss");
        return (
          (moment(dia).month() + 1).toString() === filterListMes &&
          moment(dia).year().toString() === filterListAno
        );
      });

      const pagination = filtragemNova.slice(
        (currentPage - 1) * todosPerpage,
        currentPage * todosPerpage
      );

      setPage(pagination);

      let count = 0;
      for (let i = 0; i < filtragemNova.length; i++) {
        count += Number(filtragemNova[i].preco);
      }
      setValorRepresentante(count);

      const pageNumbers = [];
      for (
        let i = 0;
        i <= Math.ceil(filtragemNova.length / todosPerpage);
        i++
      ) {
        pageNumbers.push(i);
        const filtro = pageNumbers.filter((item, index) => index);

        setTotalPage(filtro);
      }
    } else {
      const filtragemNova = km.filter(function (item) {
        const dia = moment(item.dia, "DD-MM-YYYY - HH:mm:ss");

        return (
          (moment(dia).month() + 1).toString() === filterListMes &&
          moment(dia).year().toString() === filterListAno &&
          item.carro === representanteFilter
        );
      });

      const pagination = filtragemNova.slice(
        (currentPage - 1) * todosPerpage,
        currentPage * todosPerpage
      );

      setPage(pagination);

      const valorMin = filtragemNova.map((item) => item.kminicial);
      const valorMax = filtragemNova.map((item) => item.kmfinal);

      const min = Math.min(...valorMin);
      const max = Math.max(...valorMax);

      setValorRepresentante(max - min);

      /*    let count = 0;
            for (let i = 0; i < filtragemNova.length; i++) {
                count += Number(filtragemNova[i].preco);
            }
            setValorRepresentante(count); */

      const pageNumbers = [];
      for (
        let i = 0;
        i <= Math.ceil(filtragemNova.length / todosPerpage);
        i++
      ) {
        pageNumbers.push(i);
        const filtro = pageNumbers.filter((item, index) => index);

        setTotalPage(filtro);
      }
    }
  }

  async function AddCarro() {
    const carro_name = carroName;
    const carro_plate = carroPlate;
    const carro_status = false;
    const carro_km = carroKm;
    const carro_kmstart = carroKm;
    const carro_car = `${carroName} - ${carroPlate}`;

    const bodyKm = {
      carro_name,
      carro_plate,
      carro_status,
      carro_km,
      carro_kmstart,
      carro_car,
    };

    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/car/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bodyKm),
        }
      );
      sucesso();
      ListaCarros();
      setCarroKm();
      setCarroName();
      setCarroPlate();
      setOpen(!open);
    } catch (err) {
      erro();
      console.error(err.message);
    }
  }

  useEffect(() => {
    filterAno();
    pageLimits();
  }, [
    open,
    color,
    nome,
    nomeValue,
    currentPage,
    vendido,
    mesAtual,
    anoAtual,
    setAnoAtual,
    setMesAtual,
    filterListMes,
    filterListAno,
    financeiro,
    compras,
    representanteFilter,
    km,
  ]);

  return (
    <>
      <Navbar
        className="navbar-top navbar-dark"
        expand="md"
        id="navbar-main"
      ></Navbar>
      <HeaderCarros ano={filterListAno} mes={filterListMes} />
      <ToastContainer autoClose={3000} />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            {localStorage.getItem("email") !== "carros@simioni.com.br" && (
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
                    <h3 className="mb-0">Carros</h3>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginTop: "10px",
                    }}
                  >
                    <>
                      <FormGroup
                        style={{
                          marginRight: "10px",
                        }}
                      >
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fas fa-industry" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="select"
                            defaultValue="TODOS"
                            placeholder="Representante"
                            onChange={(e) => trocarFornecedor(e)}
                            value={representanteFilter}
                          >
                            {representanteNome.map((item, index) => (
                              <option value={item} key={index}>
                                {item}
                              </option>
                            ))}
                          </Input>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup
                        style={{
                          marginRight: "10px",
                        }}
                      >
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
                            onChange={(e) => trocarMes(e)}
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
                            onChange={(e) => trocarAno(e)}
                            value={filterListAno}
                          >
                            {listAno.map((item, index) => (
                              <option value={item} key={index}>
                                {item}
                              </option>
                            ))}
                          </Input>
                        </InputGroup>
                      </FormGroup>
                    </>
                  </div>
                </CardHeader>

                <Table
                  className="align-items-center table-flush"
                  responsive
                  style={{ borderCollapse: "inherit" }}
                >
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">Carro</th>
                      <th scope="col">Data - Inicial</th>
                      <th scope="col">Destino</th>
                      <th scope="col">Motorista</th>
                      <th scope="col">KM</th>
                      <th scope="col">Data - Final</th>
                      <th scope="col">Obs</th>
                    </tr>
                  </thead>

                  {/* Resultados */}
                  <tbody>
                    {page.map((item, index) => (
                      <>
                        <tr
                          key={index}
                          style={{
                            background:
                              item.obs === ""
                                ? "rgb(8, 139, 63, 0.2)"
                                : "rgb(244, 133, 55, 0.2)",
                            color: "#000",
                          }}
                        >
                          <>
                            <th
                              scope="row"
                              style={{
                                maxWidth: "250px",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              <Media className="align-items-left">
                                <Media>
                                  <span className="mb-0 text-sm">
                                    {item.carro}
                                  </span>
                                </Media>
                              </Media>
                            </th>
                            <td
                              style={{
                                maxWidth: "200px",
                              }}
                            >
                              <Badge
                                style={{
                                  maxWidth: "200px",
                                  whiteSpace: "pre-wrap",
                                }}
                                color=""
                                className="badge-dot mr-4"
                              >
                                {item.dia}
                              </Badge>
                            </td>
                            <td
                              style={{
                                maxWidth: "200px",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              {item.destino}
                            </td>
                            <td
                              style={{
                                maxWidth: "200px",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              <Badge color="" className="badge-dot mr-4">
                                {item.motorista}
                              </Badge>
                            </td>
                            <td
                              style={{
                                maxWidth: "200px",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              <Badge color="" className="badge-dot mr-4">
                                {item.kminicial} - {item.kmfinal}
                              </Badge>
                            </td>
                            <td
                              style={{
                                maxWidth: "200px",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              <Badge color="" className="badge-dot mr-4">
                                {item.diaFinal}
                              </Badge>
                            </td>
                            <td
                              style={{
                                maxWidth: "200px",
                                whiteSpace: "pre-wrap",
                              }}
                            >
                              <Badge color="" className="badge-dot mr-4">
                                {item.obs}
                              </Badge>
                            </td>
                          </>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </Table>

                <CardFooter className="py-4">
                  <Button color="success" onClick={() => setOpen(!open)}>
                    Novo Carro
                  </Button>

                  {representanteFilter === "TODOS" ? (
                    <></>
                  ) : (
                    <>
                      {" "}
                      <Button color="danger" disabled>
                        <i className="fas fa-tachometer-alt" />
                        {" - "}
                        {Number(valorRepresentante).toLocaleString("pt-br")}
                      </Button>
                    </>
                  )}

                  {totalPage.length > 0 && (
                    <nav aria-label="...">
                      <Pagination
                        className="pagination justify-content-end mb-0"
                        listClassName="justify-content-end mb-0"
                      >
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
                        {totalPage.map((index) => (
                          <PaginationItem className="active" key={index}>
                            <PaginationLink
                              style={{
                                background:
                                  currentPage === index ? "black" : "",
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
                  )}
                </CardFooter>
                {open && (
                  <CardBody className="px-lg-5 py-lg-5">
                    <div className="text-center text-muted mb-4">
                      <large>Adicionar Carro</large>
                    </div>
                    <Form role="form">
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fa fa-car" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Nome Carro"
                            type="text"
                            value={carroName}
                            onChange={(e) => setCarroName(e.target.value)}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fa fa-address-card" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Placa"
                            type="text"
                            value={carroPlate}
                            onChange={(e) => setCarroPlate(e.target.value)}
                          />
                        </InputGroup>
                      </FormGroup>
                      <FormGroup>
                        <InputGroup className="input-group-alternative">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="fa fa-road" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            placeholder="Km"
                            type="text"
                            value={carroKm}
                            onChange={(e) => setCarroKm(e.target.value)}
                          />
                        </InputGroup>
                      </FormGroup>
                      <div className="text-center">
                        <Button
                          className="my-4"
                          color="primary"
                          type="button"
                          onClick={AddCarro}
                        >
                          Cadastrar
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                )}
              </Card>
            )}
          </div>
        </Row>
      </Container>
    </>
  );
};

export default CarrosPage;
