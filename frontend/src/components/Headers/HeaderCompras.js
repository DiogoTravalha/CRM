import { useEffect } from "react";
import { Card, CardBody, CardTitle, Col, Container, Row } from "reactstrap";

import { useAuth } from "../context";

const HeaderCompras = () => {
  const { client, service, buy, financeTag, cartao } = useAuth();

  //   function Cal() {
  //     const card01 = compras.filter(function (item) {
  //       const dia = moment(item.dia, "DD-MM-YYYY");

  //       const listaPagamentos = pagamentoTag.filter(function (doc) {
  //         return doc.status === true;
  //       });

  //       return listaPagamentos.filter(function (doc) {
  //         return (
  //           item.dia !== "" &&
  //           (moment(dia).month() + 1).toString() === mes &&
  //           moment(dia).year().toString() === ano
  //         );
  //       });
  //     });

  //     const newArray = [];

  //     for (var i = 0; i < card01.length; i++) {
  //       var cidadeIgual = false;
  //       for (var j = 0; j < i; j++) {
  //         if (newArray[j] && card01[i].pagamento == newArray[j].tipo) {
  //           newArray[j].valor.push(Number(card01[i].preco));
  //           cidadeIgual = true;
  //           break;
  //         }
  //       }

  //       if (!cidadeIgual) {
  //         newArray.push({
  //           tipo: card01[i].pagamento,
  //           valor: [Number(card01[i].preco)],
  //         });
  //       }
  //     }

  //     function calculaSaldo(utilizador) {
  //       const entradas = utilizador.valor;

  //       return somaNumeros(entradas);
  //     }

  //     function somaNumeros(numeros) {
  //       return numeros.reduce((sum, nr) => sum + nr, 0);
  //     }
  //     const somas = newArray.map(calculaSaldo);

  //     const newSoma = somas.map((soma, i) => ({
  //       nome: newArray[i].tipo,
  //       valor: soma,
  //     }));

  //     setCartao01(newSoma);
  //   }

  useEffect(() => {
    console.log(cartao);
  }, []);

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
              {financeTag.map((item) => (
                <>
                  {item.status && (
                    <>
                      {cartao.map((doc) => (
                        <>
                          {doc.nome === item.nome && (
                            <Col lg="6" xl="3">
                              <Card className="card-stats mb-4 mb-xl-0">
                                <CardBody>
                                  <Row>
                                    <div className="col">
                                      <CardTitle
                                        tag="h5"
                                        className="text-uppercase text-muted mb-0"
                                      >
                                        {item.nome}
                                      </CardTitle>

                                      <span className="h2 font-weight-bold mb-0">
                                        {Number(doc.valor).toLocaleString(
                                          "pt-br",
                                          {
                                            style: "currency",
                                            currency: "BRL",
                                            minimumFractionDigits: 2,
                                          }
                                        )}
                                      </span>
                                    </div>
                                    <Col className="col-auto">
                                      <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                                        <i className="fas fa-credit-card" />
                                      </div>
                                    </Col>
                                  </Row>
                                  <p className="mt-3 mb-0 text-red text-sm">
                                    <CardTitle
                                      tag="h5"
                                      className="text-uppercase text-warning mb-0"
                                    >
                                      <a className="text-uppercase text-muted mb-0">
                                        Limite Disponível
                                      </a>
                                      {cartao.map((doc) => (
                                        <>
                                          {doc.nome === item.nome && (
                                            <a
                                              style={{
                                                color:
                                                  item.valor - doc.valor < 0
                                                    ? "red"
                                                    : "green",
                                              }}
                                            >
                                              {" "}
                                              {Number(
                                                item.valor - doc.valor
                                              ).toLocaleString("pt-br", {
                                                style: "currency",
                                                currency: "BRL",
                                                minimumFractionDigits: 2,
                                              })}
                                            </a>
                                          )}
                                        </>
                                      ))}
                                    </CardTitle>
                                  </p>
                                </CardBody>
                              </Card>
                            </Col>
                          )}
                        </>
                      ))}
                    </>
                  )}
                </>
              ))}
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default HeaderCompras;
