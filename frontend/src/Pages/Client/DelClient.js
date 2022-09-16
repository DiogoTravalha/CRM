import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, CardBody, Form } from "reactstrap";
import { useAuth } from "./../../components/context/index";

const sucessoDel = () => toast.success("Deletado com Sucesso!");
const erroDel = () => toast.error("Erro ao Deletar!");

function DelClient({ dados, delOpen, setDelOpen }) {
  const { SearchClient } = useAuth();
  function closeModal() {
    setDelOpen(false);
  }

  //Deletar Cliente
  async function delCliente() {
    try {
      const deleteTodo = await fetch(
        `https://api.devteam.vps-kinghost.net/client/delete/${dados?.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      sucessoDel();
      SearchClient();
      setDelOpen(false);
    } catch (err) {
      erroDel();
      console.error(err.message);
    }
  }

  useEffect(() => {}, [dados]);

  const customStyles = {
    content: {
      borderRadius: "25px",
      border: "solid 2px #DBE9F6",
      position: "fixed",
      width: "500px",
      height: "200px",
      margin: "5% auto",
      left: 0,
      right: 0,
      overflow: "hidden",
    },
    overlay: {
      position: "fixed",
      top: 0,
      background: "#0000003a",
      transition: "opacity 0.2s ease",
    },
  };

  return (
    <Modal isOpen={delOpen} onRequestClose={closeModal} style={customStyles}>
      <CardBody>
        <div className="text-center text-muted mb-4">
          <large>Deletar cliente </large>
          <b>{dados?.nome} ?</b>
        </div>
        <Form role="form">
          <div className="text-center">
            <Button
              className="my-2"
              color="success"
              type="button"
              onClick={delCliente}
            >
              Deletar
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
  );
}

export default DelClient;
