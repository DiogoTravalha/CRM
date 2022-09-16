import moment from "moment";
import { useEffect, useState } from "react";
import { CustomDialog, useDialog, Confirm } from "react-st-modal";
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
} from "reactstrap";
import { useAuth } from "../../components/context";
import HeaderFinanceiro from "../../components/Headers/HeaderFinanceiro";

const Financeiro = () => {
  const {
    service,
    vendido,
    mesAtual,
    setMesAtual,
    anoAtual,
    setAnoAtual,
    finance,
    SearchFinance,
    financeTag,
    SearchFinanceTag,
  } = useAuth();
  const [open, setOpen] = useState(false);
  const [nomeValue, setNomeValue] = useState();
  const [nome, setNome] = useState("");
  const [color, setColor] = useState("danger");
  const [statusProgresso, setStatusProgresso] = useState("Medir");
  const [valorProgresso, setValorProgresso] = useState("10");
  const [statusEntrega, setStatusEntrega] = useState("Compras");
  const [valorProgressoEntrega, setValorProgressoEntrega] = useState("10");
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
  const [digitado, setDigitado] = useState("");

  const sucesso = () => toast.success("Cadastrado com Sucesso!");
  const sucessoEdit = () => toast.success("Editado com Sucesso!");
  const sucessoDel = () => toast.success("Deletado com Sucesso!");
  const erro = () => toast.error("Erro ao Cadastrar!");
  const erroAtt = () => toast.error("Erro ao Atualizar!");
  const erroDel = () => toast.error("Erro ao Deletar!");

  function CustomDialogContent(dados, item) {
    const dialog = useDialog();
    const [value, setValue] = useState();
    const [tipo, setTipo] = useState("Pendente Entrada");
    const [preco, setPreco] = useState(0);
    const [obs, setObs] = useState("");
    const [pagamento, setPagamento] = useState("Dinheiro");
    const [parcelas, setParcelas] = useState(0);
    const [dia, setDia] = useState(moment().format("DD-MM-YYYY"));

    return (
      <FormGroup style={{ padding: "20px" }}>
        <InputGroup
          className="input-group-alternative"
          style={{ marginTop: "10px" }}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-tag" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type="select"
            onChange={(e) => setTipo(e.target.value)}
            value={tipo}
            defaultValue="Pendente Entrada"
          >
            <option value="Pendente Entrada">Pendente Entrada</option>
            <option value="Pendente Saída">Pendente Saída</option>
            <option value="Entrada">Entrada</option>
            <option value="Saída">Saída</option>
          </Input>
        </InputGroup>
        {tipo === "Pendente Entrada" && (
          <InputGroup
            className="input-group-alternative"
            style={{ marginTop: "10px" }}
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="fas fa-minus-circle text-yellow" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Titulo"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </InputGroup>
        )}
        {tipo === "Pendente Saída" && (
          <InputGroup
            className="input-group-alternative"
            style={{ marginTop: "10px" }}
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="fas fa-minus-circle text-yellow" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Titulo"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </InputGroup>
        )}
        {tipo === "Entrada" && (
          <InputGroup
            className="input-group-alternative"
            style={{ marginTop: "10px" }}
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="fas fa-arrow-alt-circle-right text-green" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Titulo"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </InputGroup>
        )}
        {tipo === "Saída" && (
          <InputGroup
            className="input-group-alternative"
            style={{ marginTop: "10px" }}
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="fas fa-arrow-alt-circle-left text-red" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Titulo"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </InputGroup>
        )}

        <InputGroup
          className="input-group-alternative"
          style={{ marginTop: "10px" }}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fas fa-donate text-green" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Valor"
            type="number"
            value={preco === 0 ? "Valor" : preco}
            onChange={(e) => setPreco(e.target.value)}
          />
        </InputGroup>
        <InputGroup
          className="input-group-alternative"
          style={{ marginTop: "10px" }}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-tag" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type="select"
            onChange={(e) => setPagamento(e.target.value)}
            value={pagamento}
            defaultValue="Dinheiro"
          >
            <option value="">Selecione</option>
            {financeTag.map((item, index) => (
              <option value={item.nome}>{item.nome}</option>
            ))}
          </Input>
        </InputGroup>
        <InputGroup
          className="input-group-alternative"
          style={{ marginTop: "10px" }}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fas fa-file-signature text-blue" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Parcelas"
            type="number"
            min={0}
            max={12}
            value={parcelas === 0 ? "Parcelas" : parcelas}
            onChange={(e) => setParcelas(e.target.value)}
          />
        </InputGroup>
        <InputGroup
          className="input-group-alternative"
          style={{ marginTop: "10px" }}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fas fa-book text-blue" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Observação"
            type="text"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
          />
        </InputGroup>
        <FormGroup>
          <InputGroup
            className="input-group-alternative"
            style={{ marginTop: "10px" }}
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="far fa-calendar-alt text-blue" />
              </InputGroupText>
            </InputGroupAddon>

            <Input
              type="date"
              defaultValue={dia}
              value={dia}
              onChange={(e) => setDia(e.target.value)}
            />
          </InputGroup>
        </FormGroup>

        <div style={{ marginTop: "20px", marginLeft: "20px" }}>
          <Button
            onClick={() => {
              if (value === undefined || "") {
                alert("Preencha os Campos");
              } else {
                addFinancas(
                  dados,
                  value,
                  dialog,
                  tipo,
                  preco,
                  dia,
                  parcelas,
                  pagamento,
                  obs
                );
              }
            }}
          >
            Salvar
          </Button>
          <Button onClick={() => dialog.close()}>Cancelar</Button>
        </div>
      </FormGroup>
    );
  }

  function EditContent({ dados, item }) {
    const dialog = useDialog();
    const [id, setId] = useState(item.id);
    const [value, setValue] = useState(item.nome);
    const [tipo, setTipo] = useState(item.tipo);
    const [preco, setPreco] = useState(item.preco);
    const [obs, setObs] = useState(item.obs);
    const [pagamento, setPagamento] = useState(item.pagamento);
    const [parcelas, setParcelas] = useState(item.parcelas);
    const [dia, setDia] = useState(item.dia);
    const [newDate, setNewDate] = useState("");

    return (
      <FormGroup style={{ padding: "20px" }}>
        <InputGroup
          className="input-group-alternative"
          style={{ marginTop: "10px" }}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-tag" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type="select"
            onChange={(e) => setTipo(e.target.value)}
            value={tipo}
            defaultValue="Pendente"
          >
            <option value="Pendente Entrada">Pendente Entrada</option>
            <option value="Pendente Saída">Pendente Saída</option>
            <option value="Entrada">Entrada</option>
            <option value="Saída">Saída</option>
          </Input>
        </InputGroup>
        {tipo === "Pendente Entrada" ||
          (tipo === "Pendente Saída" && (
            <InputGroup
              className="input-group-alternative"
              style={{ marginTop: "10px" }}
            >
              <InputGroupAddon addonType="prepend">
                <InputGroupText>
                  <i className="fas fa-minus-circle text-yellow" />
                </InputGroupText>
              </InputGroupAddon>
              <Input
                placeholder="Titulo"
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </InputGroup>
          ))}
        {tipo === "Entrada" && (
          <InputGroup
            className="input-group-alternative"
            style={{ marginTop: "10px" }}
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="fas fa-arrow-alt-circle-right text-green" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Titulo"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </InputGroup>
        )}
        {tipo === "Saída" && (
          <InputGroup
            className="input-group-alternative"
            style={{ marginTop: "10px" }}
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="fas fa-arrow-alt-circle-left text-red" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Titulo"
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </InputGroup>
        )}

        <InputGroup
          className="input-group-alternative"
          style={{ marginTop: "10px" }}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fas fa-donate text-green" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Valor"
            type="number"
            value={preco}
            min={0}
            onChange={(e) => setPreco(e.target.value)}
          />
        </InputGroup>
        <InputGroup
          className="input-group-alternative"
          style={{ marginTop: "10px" }}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="ni ni-tag" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type="select"
            onChange={(e) => setPagamento(e.target.value)}
            value={pagamento}
            defaultValue="Dinheiro"
          >
            <option value="">Selecione</option>
            {financeTag.map((item, index) => (
              <option value={item.nome}>{item.nome}</option>
            ))}
          </Input>
        </InputGroup>

        <InputGroup
          className="input-group-alternative"
          style={{ marginTop: "10px" }}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fas fa-book text-blue" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Observação"
            type="text"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
          />
        </InputGroup>
        <FormGroup>
          <InputGroup
            className="input-group-alternative"
            style={{ marginTop: "10px" }}
          >
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="far fa-calendar-alt text-blue" />
              </InputGroupText>
            </InputGroupAddon>

            <Input
              type="date"
              defaultValue={newDate}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
            />
          </InputGroup>
        </FormGroup>

        <div style={{ marginTop: "20px", marginLeft: "20px" }}>
          <Button
            onClick={() => {
              if (value === undefined || "") {
                alert("Preencha os Campos");
              } else {
                editFinancas(
                  dados,
                  value,
                  dialog,
                  tipo,
                  preco,
                  dia,
                  parcelas,
                  pagamento,

                  obs,
                  id,
                  newDate
                );
              }
            }}
          >
            Salvar
          </Button>
          <Button onClick={() => dialog.close()}>Cancelar</Button>
        </div>
      </FormGroup>
    );
  }
  async function editFinancas(
    dados,
    value,
    dialog,
    tipo,
    preco,
    dia,
    parcelas,
    pagamento,
    obs,
    id,
    newDate
  ) {
    const financeiro_name = value;
    const financeiro_price = preco;
    const financeiro_date =
      moment(newDate).format("DD-MM-YYYY") === "Invalid date"
        ? dia
        : moment(newDate).format("DD-MM-YYYY");
    const financeiro_type = tipo;
    const financeiro_split = parcelas;
    const financeiro_obs = obs;
    const financeiro_payment = pagamento;

    const body = {
      financeiro_name,
      financeiro_price,
      financeiro_date,
      financeiro_type,
      financeiro_split,
      financeiro_obs,
      financeiro_payment,
    };
    try {
      const response = await fetch(
        `https://api.devteam.vps-kinghost.net/finance/update/${id}`,
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
      SearchFinance();
      dialog.close();
    } catch (err) {
      erroAtt();
      console.error(err.message);
    }
  }

  async function addFinancas(
    dados,
    value,
    dialog,
    tipo,
    preco,
    dia,
    parcelas,
    pagamento,
    obs
  ) {
    if (parcelas === 0) {
      const data = moment(dia).format("DD-MM-YYYY");
      if (data === "Invalid date") {
        const financeiro_name = value;
        const financeiro_price = preco;
        const financeiro_date = dia;
        const financeiro_type = tipo;
        const financeiro_split = parcelas;
        const financeiro_obs = obs;
        const financeiro_payment = pagamento;

        const body = {
          financeiro_name,
          financeiro_price,
          financeiro_date,
          financeiro_type,
          financeiro_split,
          financeiro_obs,
          financeiro_payment,
        };
        try {
          const response = await fetch(
            "https://api.devteam.vps-kinghost.net/finance/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(body),
            }
          );

          setOpen(!open);
          sucesso();
          SearchFinance();
          dialog.close();
        } catch (err) {
          console.error(err.message);
        }
      } else {
        const financeiro_name = value;
        const financeiro_price = preco;
        const financeiro_date = data;
        const financeiro_type = tipo;
        const financeiro_split = parcelas;
        const financeiro_obs = obs;
        const financeiro_payment = pagamento;

        const body = {
          financeiro_name,
          financeiro_price,
          financeiro_date,
          financeiro_type,
          financeiro_split,
          financeiro_obs,
          financeiro_payment,
        };
        try {
          const response = await fetch(
            "https://api.devteam.vps-kinghost.net/finance/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(body),
            }
          );

          setOpen(!open);
          sucesso();
          SearchFinance();
          dialog.close();
        } catch (err) {
          console.error(err.message);
        }
      }
    } else {
      const newData = moment(dia);
      for (let count = 1; count <= parcelas; count++) {
        const days = moment(newData).endOf("month").format("DD");
        newData.add(days, "days");
        newData.format("DD-MM-YYYY");
        const novo = moment(newData).subtract(1, "month");

        const financeiro_name = `${value}` + ` - ` + `${count} / ${parcelas}`;
        const financeiro_price = preco;
        const financeiro_date = novo.format("DD-MM-YYYY");
        const financeiro_type = tipo;
        const financeiro_split = parcelas;
        const financeiro_obs = obs;
        const financeiro_payment = pagamento;

        const body = {
          financeiro_name,
          financeiro_price,
          financeiro_date,
          financeiro_type,
          financeiro_split,
          financeiro_obs,
          financeiro_payment,
        };
        try {
          const response = await fetch(
            "https://api.devteam.vps-kinghost.net/finance/create",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(body),
            }
          );

          setOpen(!open);
          sucesso();
          SearchFinance();
          dialog.close();
        } catch (err) {
          console.error(err.message);
        }
      }
    }
  }

  async function delDespesas(item) {
    try {
      const deleteTodo = await fetch(
        `https://api.devteam.vps-kinghost.net/finance/delete/${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      sucessoDel();
      SearchFinance();
    } catch (err) {
      erroDel();
      console.error(err.message);
    }
  }

  function pageLimits() {
    const filtragemNova = finance.filter(function (item) {
      const dia = moment(item.dia, "DD-MM-YYYY");
      return (
        (moment(dia).month() + 1).toString() === filterListMes &&
        moment(dia).year().toString() === filterListAno
      );
    });

    const dados = filtragemNova.filter((doc) => {
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
    const filtro = finance.filter((doc) => doc.dia !== "");
    const filtragem = filtro.map((item) => {
      const dia = moment(item.dia, "DD-MM-YYYY");
      return moment(dia).year();
    });
    const lista = [...new Set(filtragem)];

    if (lista.length === 0) {
      setListAno([moment().year().toString()]);
    } else {
      setListAno(lista.sort());
    }
  }

  useEffect(() => {
    SearchFinance();
    filterAno();
    pageLimits();
    SearchFinanceTag();
  }, [
    open,
    color,
    statusProgresso,
    valorProgresso,
    nome,
    nomeValue,
    currentPage,
    valorProgressoEntrega,
    statusEntrega,
    vendido,
    mesAtual,
    anoAtual,
    setAnoAtual,
    setMesAtual,
    filterListMes,
    filterListAno,
    finance,
  ]);

  return (
    <>
      <Navbar
        className="navbar-top navbar-dark"
        expand="md"
        id="navbar-main"
      ></Navbar>
      <HeaderFinanceiro ano={filterListAno} mes={filterListMes} />
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
                  <h3 className="mb-0">Financeiro</h3>
                </div>

                <div
                  style={{
                    display: "flex",
                    marginTop: "10px",
                  }}
                >
                  <>
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
                    <th scope="col">Nome</th>
                    <th scope="col">Obs</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Pagamento</th>
                    <th scope="col">Situação</th>
                    <th scope="col">Dia</th>
                    <th scope="col">Deletar</th>
                  </tr>
                </thead>

                {/* Resultados */}
                <tbody>
                  {page.map((item, index) => (
                    <tr
                      key={index}
                      style={{
                        background:
                          item.tipo === "Entrada"
                            ? "rgb(8, 139, 63, 0.2)"
                            : item.tipo === "Saída"
                            ? "rgb(241, 37, 22, 0.2)"
                            : "rgb(244, 133, 55, 0.2)",
                        color: "#000",
                      }}
                    >
                      <>
                        <th
                          scope="row"
                          style={{
                            maxWidth: "200px",
                          }}
                        >
                          <Media className="align-items-left">
                            <Media>
                              <span className="mb-0 text-sm">{item.nome}</span>
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
                            {item.obs}
                          </Badge>
                        </td>
                        <td
                          style={{
                            maxWidth: "200px",
                          }}
                        >
                          {Number(item?.preco).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </td>
                        <td
                          style={{
                            maxWidth: "200px",
                          }}
                        >
                          <Badge color="" className="badge-dot mr-4">
                            {item.pagamento}
                          </Badge>
                        </td>
                        <td
                          style={{
                            maxWidth: "200px",
                          }}
                        >
                          <Badge color="" className="badge-dot mr-4">
                            {item.tipo}
                          </Badge>
                        </td>
                        <td
                          style={{
                            maxWidth: "200px",
                          }}
                        >
                          <Badge color="" className="badge-dot mr-4">
                            {item.dia}
                          </Badge>
                        </td>
                        <td className="text-right">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText
                              onClick={async () => {
                                const isConfirm = await Confirm(
                                  "Você não pode desfazer esta ação",
                                  `Você tem certeza que você quer excluir ${item.nome}?`,
                                  "Deletar",
                                  "Cancelar"
                                );

                                if (isConfirm) {
                                  delDespesas(item);
                                }
                              }}
                              style={{
                                marginRight: "10px",
                                cursor: "pointer",
                              }}
                            >
                              <i className="fas fa-trash text-red" />
                            </InputGroupText>
                            <InputGroupText
                              onClick={async (e) => {
                                const result = await CustomDialog(
                                  <EditContent dados={e} item={item} />,
                                  {
                                    title: "Editar Evento",
                                    showCloseIcon: true,
                                  }
                                );
                              }}
                              style={{
                                cursor: "pointer",
                              }}
                            >
                              <i className="fas fa-edit text-green" />
                            </InputGroupText>
                          </InputGroupAddon>
                        </td>
                      </>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <CardFooter className="py-4">
                <Button
                  color="success"
                  onClick={async (e) => {
                    const result = await CustomDialog(
                      <CustomDialogContent dados={e} />,
                      {
                        title: "Adicionar Evento",
                        showCloseIcon: true,
                      }
                    );
                  }}
                >
                  Novo
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
      </Container>
    </>
  );
};

export default Financeiro;
