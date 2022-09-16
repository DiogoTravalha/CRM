import moment from "moment";
import { useEffect, useState } from "react";
import { CustomDialog, useDialog } from "react-st-modal";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
} from "reactstrap";
import { useAuth } from "../context";

const HeaderCarros = ({ mes, ano }) => {
  const {
    servicos,
    carros,
    setCarros,
    motorista,
    km,
    ListaCarros,
    ListaKm,
    ListaMotorista,
  } = useAuth();
  const [valorFinal, setValorFinal] = useState();
  const [entradaVendas, setEntradaVendas] = useState(0);
  const [balancoVendas, setBalancoVendas] = useState(0);

  const sucesso = () => toast.success("Cadastrado com Sucesso!");
  const sucessoEdit = () => toast.success("Editado com Sucesso!");
  const sucessoDel = () => toast.success("Deletado com Sucesso!");
  const erro = () => toast.error("Erro ao Cadastrar!");
  const erroAtt = () => toast.error("Erro ao Atualizar!");
  const erroDel = () => toast.error("Erro ao Deletar!");

  async function verificarStatus(item) {
    ListaMotorista();
    if (item.status === false) {
      const result = await CustomDialog(<EntradaInput item={item} />, {
        title: "Adicionar Entrada",
        showCloseIcon: true,
      });
    } else {
      const result = await CustomDialog(<SaindaInput item={item} />, {
        title: "Adicionar Saida",
        showCloseIcon: true,
      });
    }
  }

  function EntradaInput(item) {
    const dialog = useDialog();
    const [destinoAtual, setDestinoAtual] = useState("");
    const [motoristaAtual, setMotoristaAtual] = useState("");
    const [carroAtual, setCarroAtual] = useState(
      `${item.item.nome} - ${item.item.placa}`
    );
    const [dia, setDia] = useState(moment().format("DD-MM-YYYY - HH:mm:ss "));
    const [kmInicial, setKmInicial] = useState(item.item.km);

    return (
      <FormGroup style={{ padding: "20px" }}>
        <InputGroup
          className="input-group-alternative"
          style={{ marginTop: "10px" }}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fas fa-car" />
            </InputGroupText>
          </InputGroupAddon>
          <InputGroupText>
            {item.item.nome} - {item.item.placa}
          </InputGroupText>
        </InputGroup>
        <InputGroup
          className="input-group-alternative"
          style={{ marginTop: "10px" }}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fas fa-users" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            type="select"
            onChange={(e) => setMotoristaAtual(e.target.value)}
            value={motoristaAtual}
            defaultValue=""
          >
            <option value="">Selecione</option>
            {motorista.map((item, index) => (
              <option
                value={item.nome}
                style={{
                  color:
                    moment(item.validade, "DD-MM-YYYY").format("YYYYMMDD") >=
                    moment(new Date()).format("YYYYMMDD")
                      ? ""
                      : "red",
                }}
                disabled={
                  moment(item.validade, "DD-MM-YYYY").format("YYYYMMDD") >=
                  moment(new Date()).format("YYYYMMDD")
                    ? false
                    : true
                }
              >
                {item.nome}
              </option>
            ))}
          </Input>
        </InputGroup>
        <InputGroup
          className="input-group-alternative"
          style={{ marginTop: "10px" }}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fas fa-map-marker-alt text-green" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Destino"
            type="text"
            value={destinoAtual}
            onChange={(e) => setDestinoAtual(e.target.value)}
          />
        </InputGroup>
        <div style={{ marginTop: "20px", marginLeft: "20px" }}>
          <Button
            onClick={() => {
              if (motoristaAtual === "") {
                alert("Preencha o Motorista");
              }
              if (destinoAtual === "") {
                alert("Preencha o Destino");
              } else {
                addEntrada(
                  item,
                  dialog,
                  carroAtual,
                  motoristaAtual,
                  destinoAtual,
                  dia,
                  kmInicial
                );
              }
            }}
          >
            Salvar
          </Button>
          <Button onClick={() => dialog.close()}>Cancelar</Button>
          <Button
            className="my-4"
            color="danger"
            type="button"
            onClick={() => DelCar(item, dialog)}
          >
            Deletar
          </Button>
        </div>
      </FormGroup>
    );
  }

  async function DelCar(item, dialog) {
    try {
      const deleteTodo = await fetch(
        `https://api.devteam.vps-kinghost.net/car/delete/${item.item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      sucessoDel();
      ListaCarros();
      dialog.close();
    } catch (err) {
      erroDel();
      console.error(err.message);
    }
  }

  function SaindaInput(item) {
    const dialog = useDialog();
    const [kmfinal, setKmFinal] = useState("");
    const [obs, setObs] = useState("");
    const [diaFinal, setDiaFinal] = useState(
      moment().format("DD-MM-YYYY - HH:mm:ss ")
    );

    return (
      <FormGroup style={{ padding: "20px" }}>
        <InputGroup
          className="input-group-alternative"
          style={{ marginTop: "10px" }}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fas fa-tachometer-alt text-blue" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Km Final"
            type="number"
            min={0}
            value={kmfinal}
            onChange={(e) => setKmFinal(e.target.value)}
          />
        </InputGroup>
        <InputGroup
          className="input-group-alternative"
          style={{ marginTop: "10px" }}
        >
          <InputGroupAddon addonType="prepend">
            <InputGroupText>
              <i className="fas fa-comment-dots text-green" />
            </InputGroupText>
          </InputGroupAddon>
          <Input
            placeholder="Observação"
            type="text"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
          />
        </InputGroup>
        <div style={{ marginTop: "20px", marginLeft: "20px" }}>
          <Button
            onClick={() => {
              if (kmfinal === "") {
                alert("Preencha o Km Final");
              }
              if (Number(kmfinal) <= Number(item.item.km)) {
                alert(`Km Final tem que ser maior: ${item.item.km}`);
              } else {
                addSaida(item, obs, kmfinal, diaFinal, dialog);
              }
            }}
          >
            Salvar
          </Button>
          <Button onClick={() => dialog.close()}>Cancelar</Button>
        </div>
      </FormGroup>
    );
  }

  async function addEntrada(
    item,
    dialog,
    carroAtual,
    motoristaAtual,
    destinoAtual,
    dia,
    kmInicial
  ) {
    //KM

    const km_car = carroAtual;
    const km_driver = motoristaAtual;
    const km_destiny = destinoAtual;
    const km_kmstart = kmInicial;
    const km_date = dia;

    const bodyKm = {
      km_car,
      km_driver,
      km_destiny,
      km_kmstart,
      km_date,
    };
    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/km/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bodyKm),
        }
      );

      ListaMotorista();
    } catch (err) {
      console.error(err.message);
    }

    ///Carro
    const carro_name = item.item.nome;
    const carro_plate = item.item.placa;
    const carro_status = !item.item.status;
    const carro_km = item.item.km;
    const carro_iddoc = item.item.id;
    const carro_driver = motoristaAtual;
    const carro_car = carroAtual;
    const carro_kmstart = kmInicial;
    const carro_destiny = destinoAtual;
    const carro_date = dia;
    const carro_oil = item.item.oleo;

    const body = {
      carro_name,
      carro_plate,
      carro_status,
      carro_km,
      carro_iddoc,
      carro_driver,
      carro_car,
      carro_kmstart,
      carro_destiny,
      carro_date,
      carro_oil,
    };
    try {
      const response = await fetch(
        `https://api.devteam.vps-kinghost.net/car/update/${item.item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );

      sucesso();
      ListaCarros();
    } catch (err) {
      console.error(err.message);
    }
    dialog.close();
    ListaKm();
  }

  async function addSaida(item, obs, kmfinal, diaFinal, dialog) {
    const newResponse = await fetch("https://api.devteam.vps-kinghost.net/km", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const jsonData = await newResponse.json();
    const newArray = jsonData.map((doc) => doc.km_id);
    const newId = Math.max(...newArray);

    //Atualizar Saida KM
    const km_kmstop = kmfinal;
    const km_obs = obs;
    const km_daystop = diaFinal;

    const bodyKm = {
      km_kmstop,
      km_obs,
      km_daystop,
    };
    try {
      const response = await fetch(
        `https://api.devteam.vps-kinghost.net/km/exit/update/${newId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bodyKm),
        }
      );
    } catch (err) {
      console.error(err.message);
    }

    //Atualizar Saida Carro
    const carro_kmstart = kmfinal;
    const carro_kmstop = kmfinal;
    const carro_status = !item.item.status;
    const carro_km = kmfinal;

    const bodyCar = {
      carro_kmstop,
      carro_status,
      carro_kmstart,
      carro_km,
    };
    try {
      const response = await fetch(
        `https://api.devteam.vps-kinghost.net/car/exit/update/${item.item.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(bodyCar),
        }
      );
      sucesso();
      ListaKm();
      ListaCarros();
    } catch (err) {
      console.error(err.message);
    }
    dialog.close();
  }

  function AddTrocaOleo(item) {
    const dialog = useDialog();
    const [carroSelect, setCarroSelect] = useState("");
    const [kmNova, setKmNova] = useState(0);

    return (
      <>
        <FormGroup>
          <InputGroup className="input-group-alternative">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="fas fa-car-side" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Carro"
              type="select"
              autoComplete="novo-carro"
              value={carroSelect}
              onChange={(e) => setCarroSelect(e.target.value)}
            >
              <option value={""}>Selecione o Carro</option>
              {carros.map((item, index) => (
                <option value={`${item.nome} - ${item.placa}`} key={index}>
                  {item.nome} - {item.placa}
                </option>
              ))}
            </Input>
          </InputGroup>
        </FormGroup>
        <FormGroup>
          <InputGroup className="input-group-alternative">
            <InputGroupAddon addonType="prepend">
              <InputGroupText>
                <i className="fas fa-tachometer-alt" />
              </InputGroupText>
            </InputGroupAddon>
            <Input
              placeholder="Kilometragem"
              type="number"
              min={0}
              value={kmNova}
              onChange={(e) => setKmNova(e.target.value)}
            />
          </InputGroup>
        </FormGroup>
        <div className="text-center">
          <Button
            className="my-4"
            color="success"
            type="button"
            onClick={() => {
              if (carroSelect === "") {
                alert("Selecione o Carro");
                return dialog.close();
              }
              if (kmNova === 0) {
                alert("Adicione o Km");
                return dialog.close();
              }
              addOleo(dialog, item, carroSelect, kmNova);
            }}
          >
            Salvar
          </Button>
          <Button
            className="my-4"
            color="danger"
            type="button"
            onClick={() => dialog.close()}
          >
            Cancelar
          </Button>
        </div>
      </>
    );
  }

  async function addOleo(dialog, item, carroSelect, kmNova) {
    const response = await fetch("https://api.devteam.vps-kinghost.net/car", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    const jsonData = await response.json();
    const filter = jsonData.filter((doc) => doc.carro_car === carroSelect);
    const newId = filter[0].carro_id;
    const carro_oil = kmNova;
    const body = {
      carro_oil,
    };
    try {
      const response = await fetch(
        `https://api.devteam.vps-kinghost.net/car/oil/updated/${newId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(body),
        }
      );
      sucesso();
      ListaKm();
      ListaCarros();
    } catch (err) {
      erro();
      console.error(err.message);
    }
    dialog.close();
  }

  useEffect(() => {}, [
    servicos,
    valorFinal,
    entradaVendas,
    balancoVendas,
    km,
    carros,
    motorista,
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
              {carros.map((item, index) => (
                <Col lg="6" xl="3" key={index}>
                  <Card
                    className="card-stats mb-4 mb-xl-0"
                    style={{
                      cursor: "pointer",
                    }}
                    onClick={() => verificarStatus(item)}
                  >
                    <CardBody>
                      <Row>
                        <div className="col">
                          <CardTitle
                            tag="h5"
                            className="text-uppercase text-black mb-0"
                          >
                            {item.nome} - {item.placa}
                          </CardTitle>
                          <span className="h2 font-weight-bold mb-0 text-muted">
                            <i className="fas fa-tachometer-alt" /> - {item.km}
                          </span>
                          <br></br>
                          <span className="h2 font-weight-bold mb-0 text-muted">
                            <i className="fas fa-oil-can" /> - {item.oleo}
                          </span>
                        </div>
                        <Col className="col-auto">
                          <div
                            className={
                              item.status === false
                                ? "icon icon-shape bg-success text-white rounded-circle shadow"
                                : "icon icon-shape bg-danger text-white rounded-circle shadow"
                            }
                            style={{
                              marginRight: "10px",
                            }}
                          >
                            <i className="fas fa-car-side" />
                          </div>
                          <div
                            className={
                              Number(item.oleo) > Number(item.km)
                                ? "icon icon-shape bg-success text-white rounded-circle shadow"
                                : "icon icon-shape bg-danger text-white rounded-circle shadow"
                            }
                          >
                            <i className="fas fa-oil-can" />
                          </div>
                        </Col>
                      </Row>
                      <p className="mt-3 mb-0 text-red text-sm">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-warning mb-0"
                        >
                          <a
                            className={
                              item.status === false
                                ? "text-uppercase text-green mb-0"
                                : "text-uppercase text-red mb-0"
                            }
                          >
                            {item.status === false ? "Disponível" : "Em Uso"}
                          </a>
                        </CardTitle>
                      </p>
                    </CardBody>
                  </Card>
                </Col>
              ))}
              <Col lg="6" xl="3">
                <Card
                  className="card-stats mb-4 mb-xl-0"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={async (e) => {
                    const result = await CustomDialog(
                      <AddTrocaOleo item={e} />,
                      {
                        title: "Adicionar Troca de Óleo",
                        showCloseIcon: true,
                      }
                    );
                  }}
                >
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-black mb-0"
                        >
                          Adicionar Troca de Óleo
                        </CardTitle>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="fas fa-oil-can" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-red text-sm"></p>
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

export default HeaderCarros;
