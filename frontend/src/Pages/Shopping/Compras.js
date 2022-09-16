import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Typeahead } from "react-bootstrap-typeahead";
import { Confirm, CustomDialog, useDialog } from "react-st-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Badge,
  Button,
  Card,
  CardFooter,
  CardHeader,
  Container,
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
import HeaderCompras from "../../components/Headers/HeaderCompras";

const Compras = () => {
  const {
    SearchFinanceTag,
    serviceFilter,
    service,
    vendido,
    mesAtual,
    setMesAtual,
    anoAtual,
    setAnoAtual,
    finance,

    merchant,
    buy,
    SearchBuy,
    financeTag,
    setCartao,
    SearchMerchant,
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
  const [representanteNome, setRepresentanteNome] = useState([]);
  const [representanteFilter, setRepresentanteFilter] = useState("TODOS");
  const [valorRepresentante, setValorRepresentante] = useState(0);

  const sucesso = () => toast.success("Cadastrado com Sucesso!");
  const sucessoEdit = () => toast.success("Editado com Sucesso!");
  const sucessoDel = () => toast.success("Deletado com Sucesso!");
  const erro = () => toast.error("Erro ao Cadastrar!");
  const erroAtt = () => toast.error("Erro ao Atualizar!");
  const erroDel = () => toast.error("Erro ao Deletar!");

  function CustomDialogContent(dados, item) {
    const dialog = useDialog();
    const [value, setValue] = useState();
    const [tipo, setTipo] = useState();
    const [preco, setPreco] = useState(0);
    const [obs, setObs] = useState("");
    const [pagamento, setPagamento] = useState("");
    const [parcelas, setParcelas] = useState(0);
    const [dia, setDia] = useState(undefined);

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
            onChange={(e) => setPagamento(e.target.value)}
            value={pagamento}
          >
            <option value="">Selecione</option>
            {financeTag.map((item) => (
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
              <i className="fas fa-industry" />
            </InputGroupText>
          </InputGroupAddon>
          <Typeahead
            emptyLabel="Sem Resultados"
            labelKey="nome"
            onChange={(e) => setValue(e)}
            options={merchant}
            placeholder="Selecione o Fornecedor..."
            selected={value}
            /* clearButton */
            className="rbt form-control"
            inputProps={{
              style: {
                marginTop: "-10px",
              },
            }}
          />
        </InputGroup>
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
              <i className="fas fa-file-signature text-blue" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Responsavel"
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
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
              <InputGroupText>Data da Compra</InputGroupText>
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
              }
              if (dia === undefined) {
                alert("Preencha a Data");
              } else {
                addFinancas(
                  dados,
                  value,
                  dialog,
                  tipo,
                  preco,
                  dia,
                  obs,
                  pagamento
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
    const [value, setValue] = useState([item.nome]);
    const [tipo, setTipo] = useState(item.tipo);
    const [preco, setPreco] = useState(item.preco);
    const [obs, setObs] = useState(item.obs);
    const [pagamento, setPagamento] = useState(item.pagamento);
    const [dia, setDia] = useState(undefined);

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
            onChange={(e) => setPagamento(e.target.value)}
            value={pagamento}
          >
            <option value="">Selecione</option>
            {financeTag.map((item) => (
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
              <i className="fas fa-industry" />
            </InputGroupText>
          </InputGroupAddon>
          <Typeahead
            emptyLabel="Sem Resultados"
            labelKey="nome"
            onChange={(e) => setValue(e)}
            options={merchant}
            placeholder="Selecione o Fornecedor..."
            selected={value}
            /* clearButton */
            className="rbt form-control"
            inputProps={{
              style: {
                marginTop: "-10px",
              },
            }}
          />
        </InputGroup>
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
              <i className="fas fa-file-signature text-blue" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Responsavel"
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
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
              <InputGroupText>Data da Compra</InputGroupText>
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
              }
              if (dia === undefined) {
                alert("Preencha a Data");
              } else {
                editFinancas(
                  dados,
                  value,
                  dialog,
                  tipo,
                  preco,
                  dia,
                  obs,
                  pagamento,
                  id
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
    obs,
    pagamento,
    id
  ) {
    const compras_name = value[0].nome === undefined ? value[0] : value[0].nome;
    const compras_price = preco;
    const compras_date =
      moment(dia).format("DD-MM-YYYY") === "Invalid date"
        ? dia
        : moment(dia).format("DD-MM-YYYY");
    const compras_type = tipo;
    const compras_obs = obs;
    const compras_payment = pagamento;

    const body = {
      compras_name,
      compras_price,
      compras_date,
      compras_type,
      compras_obs,
      compras_payment,
    };
    try {
      const response = await fetch(
        `https://api.devteam.vps-kinghost.net/buy/update/${id}`,
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
      SearchBuy();

      Cal();
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
    obs,
    pagamento
  ) {
    const compras_name = value[0].nome;
    const compras_price = preco;
    const compras_date = moment(dia).format("DD-MM-YYYY");
    const compras_type = tipo;
    const compras_obs = obs;
    const compras_payment = pagamento;

    const body = {
      compras_name,
      compras_price,
      compras_date,
      compras_type,
      compras_obs,
      compras_payment,
    };
    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/buy/create",
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
      SearchBuy();
      Cal();
      dialog.close();
    } catch (err) {
      console.error(err.message);
    }
  }

  async function delDespesas(item) {
    try {
      const deleteTodo = await fetch(
        `https://api.devteam.vps-kinghost.net/buy/delete/${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      sucessoDel();
      SearchBuy();
      Cal();
    } catch (err) {
      erroDel();
      console.error(err.message);
    }
  }

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
    const filtro = buy.filter((doc) => doc.dia !== "");
    const filtragem = filtro.map((item) => {
      const dia = moment(item.dia, "DD-MM-YYYY");
      return moment(dia).year();
    });

    const lista = [...new Set(filtragem)];
    setListAno(lista.sort());

    const nome = merchant.map((item) => item.nome);
    const newNomes = [...new Set(nome)];
    setRepresentanteNome(newNomes.sort());
  }

  function pageLimits() {
    if (representanteFilter === "TODOS") {
      const filtragemNova = buy.filter(function (item) {
        const dia = moment(item.dia, "DD-MM-YYYY");
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
      const filtragemNova = buy.filter(function (item) {
        const dia = moment(item.dia, "DD-MM-YYYY");
        return (
          (moment(dia).month() + 1).toString() === filterListMes &&
          moment(dia).year().toString() === filterListAno &&
          item.nome === representanteFilter
        );
      });
      console.log(filtragemNova);
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
    }
  }

  function Cal() {
    const card01 = buy.filter(function (item) {
      const dia = moment(item.dia, "DD-MM-YYYY");

      const listaPagamentos = financeTag.filter(function (doc) {
        return doc.status === true;
      });

      return (
        item.dia !== "" &&
        (moment(dia).month() + 1).toString() === filterListMes &&
        moment(dia).year().toString() === filterListAno
      );
    });

    const newArray = [];

    for (var i = 0; i < card01.length; i++) {
      var cidadeIgual = false;
      for (var j = 0; j < i; j++) {
        if (newArray[j] && card01[i].pagamento == newArray[j].tipo) {
          newArray[j].valor.push(Number(card01[i].preco));
          cidadeIgual = true;
          break;
        }
      }

      if (!cidadeIgual) {
        newArray.push({
          tipo: card01[i].pagamento,
          valor: [Number(card01[i].preco)],
        });
      }
    }

    function calculaSaldo(utilizador) {
      const entradas = utilizador.valor;

      return somaNumeros(entradas);
    }

    function somaNumeros(numeros) {
      return numeros.reduce((sum, nr) => sum + nr, 0);
    }
    const somas = newArray.map(calculaSaldo);

    const newSoma = somas.map((soma, i) => ({
      nome: newArray[i].tipo,
      valor: soma,
    }));

    setCartao(newSoma);
  }

  useEffect(() => {
    SearchFinanceTag();
    SearchMerchant();
    filterAno();
    pageLimits();
    Cal();
  }, [
    open,
    serviceFilter,
    service,
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
    representanteFilter,
    buy,
  ]);

  return (
    <>
      <Navbar
        className="navbar-top navbar-dark"
        expand="md"
        id="navbar-main"
      ></Navbar>
      <HeaderCompras />
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
                  <h3 className="mb-0">Compras</h3>
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: "10px",
                  }}
                >
                  <>
                    <FormGroup style={{ marginRight: "10px" }}>
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
                          <option value="TODOS">Selecione</option>
                          {representanteNome.map((item, index) => (
                            <option value={item} key={index}>
                              {item}
                            </option>
                          ))}
                        </Input>
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
                    <th scope="col">Nome</th>
                    <th scope="col">Obs</th>
                    <th scope="col">Valor</th>
                    <th scope="col">Pagamento</th>
                    <th scope="col">Responsável</th>
                    <th scope="col">Dia</th>
                    <th scope="col">Deletar</th>
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
                              maxWidth: "300px",
                            }}
                          >
                            <Media className="align-items-left">
                              <Media>
                                <span className="mb-0 text-sm">
                                  {item.nome}
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
                    </>
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
                  Nova Entrada
                </Button>

                {representanteFilter === "TODOS" ? (
                  <></>
                ) : (
                  <>
                    {" "}
                    <Button color="danger" disabled>
                      {Number(valorRepresentante).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Button>
                  </>
                )}

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

export default Compras;
