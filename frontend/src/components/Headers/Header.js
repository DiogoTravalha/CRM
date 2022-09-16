import "./Header.css";
import moment from "moment";
import { useEffect, useState } from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";

import { useAuth } from "../context";

const Header = ({ mes, ano }) => {
  const { client, service } = useAuth();
  const [valorFinal, setValorFinal] = useState();
  const [numVendas, setNumVendas] = useState(0);
  const [numClientes, setNumClientes] = useState(0);
  const [numClientesAnterior, setNumClientesAnterior] = useState(0);
  const [crecimentoClientes, setCrescimentoClientes] = useState(0);
  const [crescimentoVendasFechadas, setCrescimentoVendasFechadas] = useState(0);
  const [crecimentoMes, setCrescimentoMes] = useState(0);
  const [valorFinalMesAnterior, setValorFinalMesAnterior] = useState(0);
  const [anoTotalMedia, setAnoTotalMedia] = useState(0);

  function cal() {
    //Clientes do Mes Anterio
    var clientesMesAnterior = client.filter(function (item) {
      const dia = moment(item.dia, "DD-MM-YYYY");
      return (
        (moment(dia).month() + 1).toString() === Number(mes - 1).toString() &&
        moment(dia).year().toString() === ano
      );
    });

    //Clientes do Mes Atual
    var clientesMes = client.filter(function (item) {
      const dia = moment(item.dia, "DD-MM-YYYY");
      return (
        (moment(dia).month() + 1).toString() === mes &&
        moment(dia).year().toString() === ano
      );
    });

    //Vendas Mes Anterior
    var vendasMesAnterior = service.filter(function (item) {
      const dia = moment(item.fechado, "DD-MM-YYYY");
      return (
        item.status.toLowerCase() === "fechada" &&
        item.fechado !== "" &&
        (moment(dia).month() + 1).toString() === Number(mes - 1).toString() &&
        moment(dia).year().toString() === ano
      );
    });

    let somaMesAnterior = 0;
    for (let i = 0; i < vendasMesAnterior.length; i++) {
      somaMesAnterior += Number(vendasMesAnterior[i].valor);
    }

    //Vendas Mes Atual
    var vendasMesAtual = service.filter(function (item) {
      const dia = moment(item.fechado, "DD-MM-YYYY");
      return (
        item.status.toLowerCase() === "fechada" &&
        item.fechado !== "" &&
        (moment(dia).month() + 1).toString() === mes &&
        moment(dia).year().toString() === ano
      );
    });
    let somaMesAtual = 0;
    for (let i = 0; i < vendasMesAtual.length; i++) {
      somaMesAtual += Number(vendasMesAtual[i].valor);
    }

    //Vendas Total Ano
    var vendaTotalAno = service.filter(function (item) {
      const dia = moment(item.fechado, "DD-MM-YYYY");
      return (
        item.status.toLowerCase() === "fechada" &&
        item.fechado !== "" &&
        moment(dia).year().toString() === ano
      );
    });

    let somaAnoTotal = 0;
    for (let i = 0; i < vendaTotalAno.length; i++) {
      somaAnoTotal += Number(vendaTotalAno[i].valor);
    }
    setAnoTotalMedia(somaAnoTotal / 12);

    //Porcentagem Vendas
    const arrayVendas = [somaMesAtual, somaMesAnterior];

    const porcentagemVendas = arrayVendas.reduce(function (um, dois) {
      if (dois !== 0) {
        return ((um - dois) / dois) * 100;
      } else {
        if (um !== 0) {
          return (um / um) * 100;
        } else {
          return 0;
        }
      }
    });

    //Porcentagem Clientes Novos
    const arrayClientesNovos = [clientesMes.length, clientesMesAnterior.length];
    const porcentagemClientesNovos = arrayClientesNovos.reduce(function (
      um,
      dois
    ) {
      if (dois !== 0) {
        return ((um - dois) / dois) * 100;
      } else {
        if (um !== 0) {
          return (um / um) * 100;
        } else {
          return 0;
        }
      }
    });

    //Porcentagem Vendas Finalizadas
    const arrayMesVendas = [vendasMesAtual.length, vendasMesAnterior.length];
    const porcentagemVendasFinalizadas = arrayMesVendas.reduce(function (
      um,
      dois
    ) {
      if (dois !== 0) {
        return ((um - dois) / dois) * 100;
      } else {
        if (um !== 0) {
          return (um / um) * 100;
        } else {
          return 0;
        }
      }
    });

    ////////////////////////////////////////////
    setValorFinalMesAnterior(somaMesAnterior);
    setCrescimentoMes(porcentagemVendas);
    setCrescimentoClientes(porcentagemClientesNovos);
    setCrescimentoVendasFechadas(porcentagemVendasFinalizadas);
    setValorFinal(somaMesAtual);
    setNumVendas(vendasMesAtual.length);
    setNumClientes(clientesMes.length);
    setNumClientesAnterior(clientesMesAnterior.length);
  }

  useEffect(() => {
    cal();
  }, [service, valorFinal, mes, ano, numVendas, numClientes, client]);

  return (
    <>
      <div className="header bg-gradient-info pb-8 pt-5 pt-md-8">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Vendas no Mês
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {Number(valorFinal).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                      {/* <Col className="col-auto">
                        <div className="icon icon-shape ">
                          <i className="fas fa-chart-bar" id="mes" />
                        </div>
                      </Col> */}
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span
                        className={
                          crecimentoMes >= 0
                            ? "text-success mr-2"
                            : "text-danger mr-2"
                        }
                      >
                        <i
                          className={
                            crecimentoMes >= 0
                              ? "fas fa-arrow-up"
                              : "fas fa-arrow-down text-danger"
                          }
                        />
                        {crecimentoMes.toFixed(2)}%
                      </span>
                      <span className="text-nowrap">Mês Atual</span>
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
                          Vendas Fechadas
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {numVendas}
                        </span>
                      </div>
                      {/* <Col className="col-auto">
                        <div className="icon icon-shape ">
                          <i className="fas fa-chart-pie" id="fechada" />
                        </div>
                      </Col> */}
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span
                        className={
                          crescimentoVendasFechadas >= 0
                            ? "text-success mr-2"
                            : "text-danger mr-2"
                        }
                      >
                        <i
                          className={
                            crescimentoVendasFechadas >= 0
                              ? "fas fa-arrow-up"
                              : "fas fa-arrow-down text-danger"
                          }
                        />
                        {crescimentoVendasFechadas.toFixed(2)}%
                      </span>
                      <span className="text-nowrap">Mês Atual</span>
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
                          Clientes Novos
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {numClientes}
                        </span>
                      </div>
                      <Col className="col-auto">
                        {/* <div className="icon icon-shape">
                          <i className="fas fa-users" id="clientes" />
                        </div> */}
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span
                        className={
                          crecimentoClientes >= 0
                            ? "text-success mr-2"
                            : "text-danger mr-2"
                        }
                      >
                        <i
                          className={
                            crecimentoClientes >= 0
                              ? "fas fa-arrow-up"
                              : "fas fa-arrow-down text-danger"
                          }
                          style={{
                            marginRight: "5px",
                          }}
                        />
                        {crecimentoClientes.toFixed(2)}%
                      </span>
                      <span className="text-nowrap">Mês Atual</span>
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
                          Evolução
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {Number(anoTotalMedia).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </span>
                      </div>
                      {/* <Col className="col-auto">
                        <div className="icon icon-shape">
                          <i className="fas fa-wallet" id="carteira" />
                        </div>
                      </Col> */}
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      {/*   <span className="text-success mr-2">
                                                <i className="fas fa-arrow-up" />{' '}
                                                12%
                                            </span> */}
                      <span className="text-nowrap">Media do Ano</span>
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

export default Header;
