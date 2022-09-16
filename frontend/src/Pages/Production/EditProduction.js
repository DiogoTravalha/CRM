import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
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

function EditProduction({ editOpen, dados, setEditOpen }) {
  const { SearchService, productionTag, SearchProductionTag } = useAuth();

  const [valor, setValor] = useState();
  const [ambiente, setAmbiente] = useState();
  const [valorProgresso, setValorProgresso] = useState("0");
  const [statusProgresso, setStatusProgresso] = useState("Sem Tag");
  const [statusEntrega, setStatusEntrega] = useState("Compras");
  const [valorProgressoEntrega, setValorProgressoEntrega] = useState("10");

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

  //Editar Fabricacao
  async function editProduction() {
    const servico_price = valor === undefined ? dados?.valor : valor;
    const servico_environment =
      ambiente === undefined ? dados?.ambiente : ambiente;
    const servico_progress =
      statusProgresso === undefined ? dados?.statusProgresso : statusProgresso;
    const servico_statusdelivery =
      statusEntrega === undefined ? dados?.statusEntrega : statusEntrega;
    const servico_progressdelivery =
      valorProgressoEntrega === undefined
        ? dados?.valorProgressoEntrega
        : valorProgressoEntrega;

    const body = {
      servico_price,
      servico_environment,
      servico_progress,
      servico_statusdelivery,
      servico_progressdelivery,
    };

    try {
      const response = await fetch(
        `https://api.devteam.vps-kinghost.net/service/production/update/${dados?.id}`,
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

  function updadeStatus(e) {
    let idx = e.target.selectedIndex;
    let dataset = e.target.options[idx].dataset;
    setStatusEntrega(e.target.value);
    setValorProgressoEntrega(dataset.isd);
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
    SearchProductionTag();
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
            <large>Editar Fabricação</large>
          </div>
          <Form role="form">
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-diamond" />
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
                  value={
                    statusEntrega === undefined
                      ? dados?.statusEntrega
                      : statusEntrega
                  }
                >
                  {productionTag.map((item) => (
                    <option data-isd={item.valor} value={item.nome}>
                      {item.nome}
                    </option>
                  ))}
                </Input>
              </InputGroup>
            </FormGroup>

            <div className="text-center">
              <Button
                className="my-4"
                color="primary"
                type="button"
                onClick={editProduction}
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

export default EditProduction;
