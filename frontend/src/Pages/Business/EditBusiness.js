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

function EditBusiness({ editOpen, dados, setEditOpen }) {
  const { SearchMerchant } = useAuth();
  const [IsOpen, setIsOpen] = useState(false);
  const [nome, setNome] = useState();
  const [telefone, setTelefone] = useState();

  const sucessoEdit = () => toast.success("Editado com Sucesso!");
  const erroAtt = () => toast.error("Erro ao Atualizar!");

  function closeModal() {
    setEditOpen(false);
  }

  //Adicionar Fornecedor
  async function editCliente() {
    const fornecedor_name = nome === undefined ? dados?.nome : nome;
    const fornecedor_phone =
      telefone === undefined ? dados?.telefone : telefone;

    const body = {
      fornecedor_name,
      fornecedor_phone,
    };
    try {
      const response = await fetch(
        `https://api.devteam.vps-kinghost.net/company/update/${dados?.id}`,
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
      setNome();
      setTelefone();
      SearchMerchant();
      setEditOpen(false);
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

  return (
    <div>
      <Modal isOpen={editOpen} onRequestClose={closeModal} style={customStyles}>
        <CardBody
          className="px-lg-5 py-lg-5"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            justifyItems: "center",
          }}
        >
          <div className="text-center text-muted mb-4">
            <large>Novo Fornecedor</large>
          </div>
          <Form role="form">
            <FormGroup>
              <InputGroup className="input-group-alternative">
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
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText>
                    <i className="fas fa-mobile-alt" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder="Telefone"
                  type="number"
                  min={0}
                  autoComplete="novo-telefone"
                  value={telefone === undefined ? dados?.telefone : telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </InputGroup>
            </FormGroup>

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

export default EditBusiness;
