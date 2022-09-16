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

function EditClient({ editOpen, dados, setEditOpen }) {
  const { SearchClient } = useAuth();
  const [nome, setNome] = useState();
  const [telefone, setTelefone] = useState();
  const [endereco, setEndereco] = useState();
  const [cidade, setCidade] = useState();
  const [bairro, setBairro] = useState();
  const [numero, setNumero] = useState();

  const sucessoEdit = () => toast.success("Editado com Sucesso!");
  const erroAtt = () => toast.error("Erro ao Atualizar!");

  function closeModal() {
    setEditOpen(false);
  }

  //Editar Cliente
  async function editCliente() {
    const client_name = nome === undefined ? dados?.nome : nome;
    const client_tel = telefone === undefined ? dados?.telefone : telefone;
    const client_street = endereco === undefined ? dados?.endereco : endereco;
    const client_number = numero === undefined ? dados?.numero : numero;
    const client_district = bairro === undefined ? dados?.bairro : bairro;
    const client_city = cidade === undefined ? dados?.cidade : cidade;
    const client_dia = dados?.dia;

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
        `https://api.devteam.vps-kinghost.net/client/update/${dados?.id}`,
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
      SearchClient();
      setEditOpen(false);
    } catch (err) {
      erroAtt();
      console.error(err.message);
    }
  }

  useEffect(() => {}, [editOpen, dados]);

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

  return (
    <div>
      <Modal isOpen={editOpen} onRequestClose={closeModal} style={customStyles}>
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <large>Editar Cliente</large>
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
                  value={nome === undefined ? dados?.nome : nome}
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
                  value={telefone === undefined ? dados?.telefone : telefone}
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
                  value={endereco === undefined ? dados?.endereco : endereco}
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
                  value={numero === undefined ? dados?.numero : numero}
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
                  value={bairro === undefined ? dados?.bairro : bairro}
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
                  value={cidade === undefined ? dados?.cidade : cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <div className="text-center">
              <Button
                className="my-2"
                color="success"
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

export default EditClient;
