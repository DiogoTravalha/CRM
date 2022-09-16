import React, { useState, useEffect } from "react";
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
import Moment from "moment";

function EditService({ editOpen, dados, setEditOpen }) {
  const { SearchService, mesAtual, anoAtual, serviceTag, SearchServiceTag } =
    useAuth();

  const [nome, setNome] = useState();
  const [valor, setValor] = useState();
  const [ambiente, setAmbiente] = useState();
  const [valorProgresso, setValorProgresso] = useState("0");
  const [statusProgresso, setStatusProgresso] = useState("Sem Tag");
  const [statusEntrega, setStatusEntrega] = useState("Compras");
  const [valorProgressoEntrega, setValorProgressoEntrega] = useState("10");
  const [entrega, setEntrega] = useState();
  const [dataFechado, setDataFechado] = useState();
  const [valueEntrega, setValueEntrega] = useState();
  const [valueFechado, setValueFechado] = useState();

  const sucessoEdit = () => toast.success("Editado com Sucesso!");
  const erroAtt = () => toast.error("Erro ao Atualizar!");

  function closeModal() {
    setEditOpen(false);
  }

  function updadeStatus(e) {
    let idx = e.target.selectedIndex;
    let dataset = e.target.options[idx].dataset;
    setStatusProgresso(e.target.value);
    setValorProgresso(dataset.isd);
  }

  //Editar Servico
  async function editCliente() {
    const servico_name = nome === undefined ? dados?.nome : nome;
    const servico_price = valor === undefined ? dados?.valor : valor;
    const servico_environment =
      ambiente === undefined ? dados?.ambiente : ambiente;
    const servico_status =
      valorProgresso === undefined ? dados?.valorProgresso : valorProgresso;
    const servico_progress =
      statusProgresso === undefined ? dados?.statusProgresso : statusProgresso;
    const servico_statusdelivery =
      statusEntrega === undefined ? dados?.statusEntrega : statusEntrega;
    const servico_progressdelivery =
      valorProgressoEntrega === undefined
        ? dados?.valorProgressoEntrega
        : valorProgressoEntrega;
    const servico_month =
      statusProgresso.toLowerCase() === "fechada" ? mesAtual : "";
    const servico_year =
      statusProgresso.toLowerCase() === "fechada" ? anoAtual : "";
    const servico_closed =
      statusProgresso.toLowerCase() === "fechada" ? dataFechado : "";
    const servico_delivery = entrega === undefined ? dados?.entrega : entrega;

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
        `https://api.devteam.vps-kinghost.net/service/update/${dados?.id}`,
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
      SearchService();
      setEditOpen(!editOpen);
    } catch (err) {
      erroAtt();
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

  useEffect(() => {
    SearchServiceTag();
  }, [dados]);

  return (
    <div>
      <Modal isOpen={editOpen} onRequestClose={closeModal} style={customStyles}>
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
                  value={valor === undefined ? dados?.valor : valor}
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
                  value={ambiente === undefined ? dados?.ambiente : ambiente}
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
                onClick={editCliente}
              >
                Atualizar
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

export default EditService;
