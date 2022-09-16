import moment from "moment";
import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";

import { useAuth } from "../context";

const HeaderFinanceiro = ({ mes, ano }) => {
  const { clientes, service, finance } = useAuth();
  const [valorFinal, setValorFinal] = useState();
  const [saidasVendas, setSaidasVendas] = useState(0);
  const [entradaVendas, setEntradaVendas] = useState(0);
  const [balancoVendas, setBalancoVendas] = useState(0);
  const [pendenteSaidaVendas, setPendenteSaidaVendas] = useState(0);
  const [pendenteEntradaVendas, setPendenteEntradaVendas] = useState(0);

  function cal() {
    //Saidas
    var saidas = finance.filter(function (item) {
      const dia = moment(item.dia, "DD-MM-YYYY");
      return (
        item.tipo === "Saída" &&
        item.dia !== "" &&
        (moment(dia).month() + 1).toString() === mes &&
        moment(dia).year().toString() === ano
      );
    });
    let saidadomes = 0;
    for (let i = 0; i < saidas.length; i++) {
      saidadomes += Number(saidas[i].preco);
    }
    setSaidasVendas(saidadomes);

    //Pendente Saida
    var pendenteSaida = finance.filter(function (item) {
      const dia = moment(item.dia, "DD-MM-YYYY");
      return (
        item.tipo === "Pendente Saída" &&
        item.dia !== "" &&
        (moment(dia).month() + 1).toString() === mes &&
        moment(dia).year().toString() === ano
      );
    });
    let pendenteSaidames = 0;
    for (let i = 0; i < pendenteSaida.length; i++) {
      pendenteSaidames += Number(pendenteSaida[i].preco);
    }
    setPendenteSaidaVendas(pendenteSaidames);

    //Pendente Entrada
    var pendenteEntrada = finance.filter(function (item) {
      const dia = moment(item.dia, "DD-MM-YYYY");
      return (
        item.tipo === "Pendente Entrada" &&
        item.dia !== "" &&
        (moment(dia).month() + 1).toString() === mes &&
        moment(dia).year().toString() === ano
      );
    });
    let pendenteEntradames = 0;
    for (let i = 0; i < pendenteEntrada.length; i++) {
      pendenteEntradames += Number(pendenteEntrada[i].preco);
    }
    setPendenteEntradaVendas(pendenteEntradames);

    //Vendas Mes Atual
    var entradas = finance.filter(function (item) {
      const dia = moment(item.dia, "DD-MM-YYYY");
      return (
        item.tipo === "Entrada" &&
        item.dia !== "" &&
        (moment(dia).month() + 1).toString() === mes &&
        moment(dia).year().toString() === ano
      );
    });
    let entradames = 0;
    for (let i = 0; i < entradas.length; i++) {
      entradames += Number(entradas[i].preco);
    }
    setEntradaVendas(entradames);

    //Vendas Total Ano
    const balancoGeral = entradames - saidadomes;
    setBalancoVendas(balancoGeral);
  }

  useEffect(() => {
    cal();
  }, [
    service,
    valorFinal,
    mes,
    ano,
    saidasVendas,
    entradaVendas,
    balancoVendas,
    cal,
  ]);

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Entradas
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {Number(entradaVendas).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="fas fa-chart-bar" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-warning mb-0"
                      >
                        <a className="text-uppercase text-muted mb-0">
                          Pendente{" "}
                        </a>
                        -{" "}
                        {Number(pendenteEntradaVendas).toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </CardTitle>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Saídas
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {Number(saidasVendas).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                          <i className="fas fa-chart-pie" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-warning mb-0"
                      >
                        <a className="text-uppercase text-muted mb-0">
                          Pendente{" "}
                        </a>
                        -{" "}
                        {Number(pendenteSaidaVendas).toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </CardTitle>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              {/* <Col lg="6" xl="3">
                                <Card className="card-stats mb-4 mb-xl-0">
                                    <CardBody>
                                        <Row>
                                            <div className="col">
                                                <CardTitle
                                                    tag="h5"
                                                    className="text-uppercase text-muted mb-0"
                                                >
                                                    Pendentes
                                                </CardTitle>
                                                <span className="h2 font-weight-bold mb-0 text-black">
                                                    {Number(
                                                        pendenteVendas
                                                    ).toLocaleString('pt-br', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    })}
                                                </span>
                                            </div>
                                            <Col className="col-auto">
                                                <div className="icon icon-shape bg-yellow text-white rounded-circle shadow">
                                                    <i className="fas fa-wallet " />
                                                </div>
                                            </Col>
                                        </Row>
                                        <p className="mt-3 mb-0 text-muted text-sm">
                                            <span className="text-nowrap">
                                                Mês Atual
                                            </span>
                                        </p>
                                    </CardBody>
                                </Card>
                            </Col> */}

              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Balanço
                        </CardTitle>
                        <span
                          className={
                            entradaVendas >= saidasVendas
                              ? "h2 font-weight-bold mb-0 text-green"
                              : "h2 font-weight-bold mb-0 text-red"
                          }
                        >
                          {Number(balancoVendas).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                          <i className="fas fa-wallet" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <CardTitle
                        tag="h5"
                        className="text-uppercase text-warning mb-0"
                      >
                        <a className="text-uppercase text-muted mb-0">Saldo</a>
                      </CardTitle>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default HeaderFinanceiro;
