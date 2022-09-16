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
import { useAuth } from "../../context";

function ModalClientes({ edit, dados }) {
  const { ListaClientes, diaAtual, mesAtual, anoAtual, IsOpen, setIsOpen } =
    useAuth();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [endereco, setEndereco] = useState("");
  const [cidade, setCidade] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [dia, setDia] = useState("");
  const [id, setId] = useState("");

  const sucesso = () => toast.success("Cadastrado com Sucesso!");
  const sucessoEdit = () => toast.success("Editado com Sucesso!");
  const sucessoDel = () => toast.success("Deletado com Sucesso!");
  const erro = () => toast.error("Erro ao Cadastrar!");
  const erroAtt = () => toast.error("Erro ao Atualizar!");
  const erroDel = () => toast.error("Erro ao Deletar!");

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
      // ListaClientes();
    } catch (err) {
      console.error(err.message);
      erro();
    }
  }

  //Editar Cliente
  async function EditCliente() {
    const client_name = nome;
    const client_tel = telefone;
    const client_street = endereco;
    const client_number = numero;
    const client_district = bairro;
    const client_city = cidade;
    const client_dia = dia;

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
        `https://api.devteam.vps-kinghost.net/client/update/${id}`,
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
      // ListaClientes();
    } catch (err) {
      erroAtt();
      console.error(err.message);
    }
  }

  const customStyles = {
    content: {
      top: "80px",
      borderRadius: "25px",
      border: "solid 2px #DBE9F6",
    },
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "#0000003a",
      transition: "opacity 0.2s ease",
    },
  };

  // function Edit() {
  //   setNome(dados.nome);
  //   setId(dados.id);
  //   setTelefone(dados.telefone);
  //   setEndereco(dados.endereco);
  //   setBairro(dados.bairro);
  //   setCidade(dados.cidade);
  //   setNumero(dados.numero);
  //   setDia(dados.dia);
  // }

  useEffect(() => {}, [edit, dados]);

  return (
    <div>
      <Button color="success" onClick={openModal}>
        Novo Cliente
      </Button>
      <Modal isOpen={IsOpen} onRequestClose={closeModal} style={customStyles}>
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <large>{edit === true ? "Editar Cliente" : "Novo Cliente"}</large>
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
                  value={nome === "" ? dados.nome : nome}
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
                onClick={edit === true ? EditCliente : AddCliente}
              >
                {edit === true ? "Atualizar" : "Cadastrar"}
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

export default ModalClientes;
