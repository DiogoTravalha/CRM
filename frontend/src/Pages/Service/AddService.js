import React, { useState } from "react";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  CardBody,
  FormGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  Form,
} from "reactstrap";
import { useAuth } from "./../../components/context/index";
import { Typeahead } from "react-bootstrap-typeahead";
import Moment from "moment";

function AddService() {
  const { SearchService, client, serviceTag, mesAtual, anoAtual } = useAuth();
  const [IsOpen, setIsOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [nomeValue, setNomeValue] = useState();
  const [valor, setValor] = useState();
  const [ambiente, setAmbiente] = useState();
  const [valorProgresso, setValorProgresso] = useState("0");
  const [statusProgresso, setStatusProgresso] = useState("Sem Tag");
  const [valueEntrega, setValueEntrega] = useState();
  const [valueFechado, setValueFechado] = useState();
  const [dataFechado, setDataFechado] = useState();
  const [entrega, setEntrega] = useState();
  const [statusEntrega, setStatusEntrega] = useState("Compras");
  const [valorProgressoEntrega, setValorProgressoEntrega] = useState("10");

  const sucesso = () => toast.success("Cadastrado com Sucesso!");
  const erro = () => toast.error("Erro ao Cadastrar!");

  function updadeStatus(e) {
    let idx = e.target.selectedIndex;
    let dataset = e.target.options[idx].dataset;
    setStatusProgresso(e.target.value);
    setValorProgresso(dataset.isd);
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  //Adicionar Servico
  async function AddServico() {
    const servico_name = nomeValue !== undefined ? nomeValue[0].nome : "";
    const servico_price = valor === undefined ? "" : valor;
    const servico_environment = ambiente === undefined ? "" : ambiente;
    const servico_status = valorProgresso;
    const servico_progress = statusProgresso;
    const servico_statusdelivery =
      statusEntrega === undefined ? "" : statusEntrega;
    const servico_progressdelivery =
      valorProgressoEntrega === undefined ? "" : valorProgressoEntrega;
    const servico_month =
      statusProgresso.toLowerCase() === "fechada" ? mesAtual : "";
    const servico_year =
      statusProgresso.toLowerCase() === "fechada" ? anoAtual : "";
    const servico_closed =
      statusProgresso.toLowerCase() === "fechada" ? dataFechado : "";
    const servico_delivery = entrega === undefined ? "" : entrega;

    if (servico_name === "") {
      alert("Selecione o Cliente");
      return;
    }
    if (servico_price === "" && servico_environment === "") {
      alert("Preencha todos os Campos");
      return;
    }

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
        "https://api.devteam.vps-kinghost.net/service/create",
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
      SearchService();
      setNomeValue();
      setValor();
      setAmbiente();
      closeModal();
    } catch (err) {
      erro();
      console.error(err.message);
    }
  }

  const customStyles = {
    content: {
      borderRadius: "25px",
      border: "solid 2px #DBE9F6",
      position: "fixed",
      width: "60%",
      maxWidth: "500px",
      margin: "5% auto",
      left: 0,
      right: 0,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    overlay: {
      position: "fixed",
      top: 0,
      background: "#0000003a",
      transition: "opacity 0.2s ease",
    },
  };

  return (
    <div>
      <Button color="success" onClick={openModal}>
        Novo Serviço
      </Button>
      <Modal isOpen={IsOpen} onRequestClose={closeModal} style={customStyles}>
        <CardBody
          className="px-lg-5 py-lg-5"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            justifyItems: "center",
          }}
        >
          <div className="text-center text-muted mb-4">
            <large>Novo Serviço</large>
          </div>
          <Form role="form">
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-single-02" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Typeahead
                    id="Selecionar"
                    emptyLabel="Sem Resultados"
                    labelKey="nome"
                    /* onChange={setNomeValue} */
                    onChange={setNomeValue}
                    options={client}
                    placeholder="Selecione o Cliente..."
                    selected={nomeValue}
                    /* clearButton */
                    className="rbt form-control"
                    inputProps={{
                      style: {
                        marginTop: "-10px",
                      },
                    }}
                  />
                </InputGroup>
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-dollar-sign" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  required={true}
                  placeholder="Valor"
                  type="number"
                  autoComplete="novo-tel"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                ></Input>
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
                  required={true}
                  placeholder="Ambiente"
                  type="text"
                  autoComplete="novo-Ambiente"
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
                  defaultValue="Selecione"
                >
                  <option data-isd="" value="Selecione">
                    Selecione
                  </option>
                  {serviceTag.map((item) => (
                    <option data-isd={item.valor} value={item.nome}>
                      {item.nome}
                    </option>
                  ))}
                </Input>
              </InputGroup>
            </FormGroup>
            {statusProgresso.toLowerCase() === "fechada" && (
              <>
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
                          Moment(e.target.value).format("DD-MM-YYYY"),
                          setValueFechado(e.target.value)
                        )
                      }
                    />
                  </InputGroup>
                </FormGroup>
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
                          Moment(e.target.value).format("DD-MM-YYYY"),
                          setValueEntrega(e.target.value)
                        )
                      }
                    />
                  </InputGroup>
                </FormGroup>
              </>
            )}

            <div className="text-center">
              <Button
                className="my-4"
                color="primary"
                type="button"
                onClick={AddServico}
              >
                Cadastrar
              </Button>
              <Button
                className="my-2"
                style={{ background: "#6C757D", color: "#fff" }}
                onClick={closeModal}
              >
                Fechar
              </Button>
            </div>
          </Form>
        </CardBody>
      </Modal>
    </div>
  );
}

export default AddService;
