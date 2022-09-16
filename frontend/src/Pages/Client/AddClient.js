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

function AddCLient() {
  const { diaAtual, mesAtual, anoAtual, SearchClient } = useAuth();
  const [IsOpen, setIsOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");

  const sucesso = () => toast.success("Cadastrado com Sucesso!");
  const erro = () => toast.error("Erro ao Cadastrar!");

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  //Adicionar Cliente
  async function AddCliente() {
    const client_name = nome === undefined ? "" : nome;
    const client_tel = telefone === undefined ? "" : telefone;
    const client_street = endereco === undefined ? "" : endereco;
    const client_number = numero === undefined ? "" : numero;
    const client_district = bairro === undefined ? "" : bairro;
    const client_city = cidade === undefined ? "" : cidade;
    const client_dia = `${diaAtual}-${mesAtual}-${anoAtual}`;

    const body = {
      client_name,
      client_tel,
      client_street,
      client_number,
      client_district,
      client_city,
      client_dia,
    };
    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/client/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );

      setIsOpen(false);
      setBairro();
      setEndereco();
      setCidade();
      setNome();
      setTelefone();
      sucesso();
      SearchClient();
    } catch (err) {
      console.error(err.message);
      erro();
    }
  }

  const customStyles = {
    content: {
      borderRadius: "25px",
      border: "solid 2px #DBE9F6",
      position: "fixed",
      width: "60%",
      maxWidth: "500px",
      margin: "auto",
      top: "80px",
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
        Novo Cliente
      </Button>
      <Modal isOpen={IsOpen} onRequestClose={closeModal} style={customStyles}>
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <large>Novo Cliente</large>
          </div>
          <Form role="form">
            <FormGroup>
              <InputGroup
                className="input-group-alternative"
                style={{ border: "solid 1px #DBE9F6" }}
              >
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-single-02" />
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
              <InputGroup
                className="input-group-alternative"
                style={{ border: "solid 1px #DBE9F6" }}
              >
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-mobile-button" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Telefone"
                  type="text"
                  autoComplete="novo-tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup
                className="input-group-alternative"
                style={{ border: "solid 1px #DBE9F6" }}
              >
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-square-pin" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Endereço"
                  type="text"
                  autoComplete="novo-endereco"
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup
                className="input-group-alternative"
                style={{ border: "solid 1px #DBE9F6" }}
              >
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-square-pin" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Numero"
                  type="text"
                  autoComplete="novo-numero"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup
                className="input-group-alternative"
                style={{ border: "solid 1px #DBE9F6" }}
              >
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-square-pin" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Bairro"
                  type="text"
                  autoComplete="novo-bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup
                className="input-group-alternative"
                style={{ border: "solid 1px #DBE9F6" }}
              >
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="ni ni-square-pin" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Cidade"
                  type="text"
                  autoComplete="nova-cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <div className="text-center">
              <Button
                className="my-2"
                color="success"
                type="button"
                onClick={AddCliente}
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

export default AddCLient;
