import moment from "moment";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export const AuthContext = createContext({});

export const AuthProvider = (props) => {
  const [auth, setAuth] = useState(false);
  const [authUser, setAuthUser] = useState(props.user);
  const [userAuth, setUserAuth] = useState();
  //////////////////////////////////////////////////////
  const [openImprimir, setOpenImprimir] = useState(false);
  const [produtos, setProdutos] = useState([]);

  const [mesGrafico, setMesGrafico] = useState([]);
  const [diaAtual, setDiaAtual] = useState(moment().date().toString());
  const [mesAtual, setMesAtual] = useState((moment().month() + 1).toString());
  const [anoAtual, setAnoAtual] = useState(moment().year().toString());
  const [valorTotal, setValorTotal] = useState(0);
  const [token, setToken] = useState();

  const [programacao, setProgramacao] = useState([]);
  const [usuario, setUsuario] = useState([]);
  const [nivelUser, setNivelUser] = useState("1");
  const [comercialRoute, setComercialRoute] = useState([]);
  const [comprasRoute, setComprasRoute] = useState([]);
  const [admRoute, setAdmRoute] = useState([]);
  const [routeNivel, setRouteNivel] = useState([]);
  const [novoPath, setNovoPath] = useState([]);
  const [carros, setCarros] = useState([]);
  const [km, setKm] = useState([]);
  const [motorista, setMotorista] = useState([]);
  const [oleo, setOleo] = useState(false);
  const [user, setUser] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cartao, setCartao] = useState([]);

  /////////////////////////////////////////////////////
  //////////////Buscas////////////////////////////////
  const [digitado, setDigitado] = useState("");

  ////////////////////////////////////////////////////
  ////////////////////////////////////////////////////

  /////////////////////////////////////////////////////
  //////////////Clientes///////////////////////////////
  const [client, setClient] = useState([]);
  const SearchClient = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/client",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const jsonData = await response.json();
      const newArray = jsonData.map((item) => ({
        id: item.client_id,
        nome: item.client_name,
        telefone: item.client_tel,
        endereco: item.client_street,
        numero: item.client_number,
        bairro: item.client_district,
        cidade: item.client_city,
        dia: item.client_dia,
      }));
      setClient(
        newArray
          .sort(function (a, b) {
            return a.nome.toLowerCase() > b.nome.toLowerCase()
              ? 1
              : b.nome.toLowerCase() > a.nome.toLowerCase()
              ? -1
              : 0;
          })
          .filter((item) => {
            return Object.keys(item).some((key) => {
              return item[key]
                .toString()
                .toLowerCase()
                .includes(digitado.toLowerCase());
            });
          })
      );
    } catch (err) {
      console.error(err.message);
    }
  }, [digitado]);
  /////////////////////////////////////////////////////
  //////////////Servicos///////////////////////////////
  const [service, setService] = useState([]);
  const [serviceClosed, setserviceClosed] = useState([]);
  const [serviceFilter, setServiceFilter] = useState([]);
  const [serviceFilterProduction, setServiceFilterProduction] = useState([]);
  const SearchService = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/service",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const jsonData = await response.json();
      const newArray = jsonData.map((item) => ({
        id: item.servico_id,
        nome: item.servico_name,
        valor: item.servico_price,
        ambiente: item.servico_environment,
        status: item.servico_status,
        valorProgresso: item.servico_progress,
        statusEntrega: item.servico_statusdelivery,
        valorProgressoEntrega: item.servico_progressdelivery,
        mes: item.servico_month,
        ano: item.servico_year,
        fechado: item.servico_closed,
        entrega: item.servico_delivery,
      }));

      const filtragem = newArray.map(function (item) {
        return item.status;
      });

      const filtro = filtragem.filter(function (item) {
        return item.toLowerCase() !== "fechada";
      });

      const fechada = newArray.filter(
        (item) => item.status.toLowerCase() === "fechada"
      );

      const novoFilter = fechada.map((item) => {
        return item.statusEntrega;
      });

      var novaArr = novoFilter.filter(function (este, i) {
        return novoFilter.indexOf(este) === i;
      });

      setServiceFilterProduction(novaArr);

      setserviceClosed(fechada);

      const lista = [...new Set(filtro)];
      setServiceFilter(lista.sort());

      setService(
        newArray.sort(function (a, b) {
          return a.nome.toLowerCase() > b.nome.toLowerCase()
            ? 1
            : b.nome.toLowerCase() > a.nome.toLowerCase()
            ? -1
            : 0;
        })
      );
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  ///////////////////////////////////////////////////////
  //////////////Financeiro///////////////////////////////
  const [finance, setFinance] = useState([]);
  const [financieroFilter, setFinanceiroFilter] = useState([]);
  const SearchFinance = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/finance",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const jsonData = await response.json();
      const newArray = jsonData.map((item) => ({
        id: item.financeiro_id,
        nome: item.financeiro_name,
        preco: item.financeiro_price,
        dia: item.financeiro_date,
        tipo: item.financeiro_type,
        parcelas: item.financeiro_split,
        obs: item.financeiro_obs,
        pagamento: item.financeiro_payment,
      }));
      setFinance(
        newArray
          .sort(function (a, b) {
            return a.dia.toLowerCase() > b.dia.toLowerCase()
              ? 1
              : b.dia.toLowerCase() > a.dia.toLowerCase()
              ? -1
              : 0;
          })
          .filter((item) => {
            return Object.keys(item).some((key) => {
              return item[key]
                .toString()
                .toLowerCase()
                .includes(digitado.toLowerCase());
            });
          })
      );
    } catch (err) {
      console.error(err.message);
    }
  }, [digitado]);

  ///////////////////////////////////////////////////////
  //////////////Agenda///////////////////////////////////
  const [events, setEvents] = useState([]);
  const SearchEvents = useCallback(async (mes) => {
    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/schedule",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const jsonData = await response.json();
      const filter = jsonData.filter(
        (item) => moment(item.agenda_start).format("M") === mes
      );
      const newArray = filter.map((item) => ({
        id: item.agenda_id,
        title: item.agenda_title,
        start: item.agenda_start,
        end: item.agenda_end,
        color: item.agenda_color,
        ano: item.agenda_year,
        status: item.agenda_status,
      }));
      setEvents(newArray);
      console.log("Agenda", newArray);
    } catch (err) {
      console.error(err.message);
    }
  }, []);

  ///////////////////////////////////////////////////////
  //////////////Compras///////////////////////////////////
  const [buy, setBuy] = useState([]);
  const SearchBuy = useCallback(async () => {
    try {
      const response = await fetch("https://api.devteam.vps-kinghost.net/buy", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const jsonData = await response.json();
      const newArray = jsonData.map((item) => ({
        id: item.compras_id,
        nome: item.compras_name,
        preco: item.compras_price,
        dia: item.compras_date,
        tipo: item.compras_type,
        obs: item.compras_obs,
        pagamento: item.compras_payment,
      }));
      setBuy(
        newArray
          .sort(function (a, b) {
            return a.dia.toLowerCase() > b.dia.toLowerCase()
              ? 1
              : b.dia.toLowerCase() > a.dia.toLowerCase()
              ? -1
              : 0;
          })
          .filter((item) => {
            return Object.keys(item).some((key) => {
              return item[key]
                .toString()
                .toLowerCase()
                .includes(digitado.toLowerCase());
            });
          })
      );
    } catch (err) {
      console.error(err.message);
    }
  }, [digitado]);

  ///////////////////////////////////////////////////////
  //////////////Fornecedor///////////////////////////////
  const [merchant, serMerchant] = useState([]);
  const SearchMerchant = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/company",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const jsonData = await response.json();
      const newArray = jsonData.map((item) => ({
        id: item.fornecedor_id,
        nome: item.fornecedor_name,
        telefone: item.fornecedor_phone,
      }));
      serMerchant(
        newArray
          .sort(function (a, b) {
            return a.nome.toLowerCase() > b.nome.toLowerCase()
              ? 1
              : b.nome.toLowerCase() > a.nome.toLowerCase()
              ? -1
              : 0;
          })
          .filter((item) => {
            return Object.keys(item).some((key) => {
              return item[key]
                .toString()
                .toLowerCase()
                .includes(digitado.toLowerCase());
            });
          })
      );
    } catch (err) {
      console.error(err.message);
    }
  }, [digitado]);

  ///////////////////////////////////////////////////////
  //////////////Tag Pagamento/////////////////////////////
  const [financeTag, setFinanceTag] = useState([]);
  const SearchFinanceTag = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/payment",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const jsonData = await response.json();
      const newArray = jsonData.map((item) => ({
        id: item.pagamento_id,
        nome: item.pagamento_name,
        valor: item.pagamento_valor,
        status: item.pagamento_status,
      }));

      setFinanceTag(
        newArray
          .sort(function (a, b) {
            return a.nome.toLowerCase() > b.nome.toLowerCase()
              ? 1
              : b.nome.toLowerCase() > a.nome.toLowerCase()
              ? -1
              : 0;
          })
          .filter((item) => {
            return Object.keys(item).some((key) => {
              return item[key]
                .toString()
                .toLowerCase()
                .includes(digitado.toLowerCase());
            });
          })
      );
    } catch (err) {
      console.error(err.message);
    }
  }, [digitado]);

  ///////////////////////////////////////////////////////
  //////////////Tag Servicos/////////////////////////////
  const [serviceTag, setServiceTag] = useState([]);
  const SearchServiceTag = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/service/tag",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const jsonData = await response.json();
      const newArray = jsonData.map((item) => ({
        id: item.servicotag_id,
        nome: item.servicotag_name,
        valor: item.servicotag_valor,
      }));

      setServiceTag(
        newArray
          .sort(function (a, b) {
            return a.nome.toLowerCase() > b.nome.toLowerCase()
              ? 1
              : b.nome.toLowerCase() > a.nome.toLowerCase()
              ? -1
              : 0;
          })
          .filter((item) => {
            return Object.keys(item).some((key) => {
              return item[key]
                .toString()
                .toLowerCase()
                .includes(digitado.toLowerCase());
            });
          })
      );
    } catch (err) {
      console.error(err.message);
    }
  }, [digitado]);

  ///////////////////////////////////////////////////////
  //////////////Tag Fabricacao///////////////////////////
  const [productionTag, setProductionTag] = useState([]);
  const SearchProductionTag = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/service/production/tag",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const jsonData = await response.json();
      const newArray = jsonData.map((item) => ({
        id: item.fabricartag_id,
        nome: item.fabricartag_name,
        valor: item.fabricartag_valor,
      }));

      setProductionTag(
        newArray
          .sort(function (a, b) {
            return a.nome.toLowerCase() > b.nome.toLowerCase()
              ? 1
              : b.nome.toLowerCase() > a.nome.toLowerCase()
              ? -1
              : 0;
          })
          .filter((item) => {
            return Object.keys(item).some((key) => {
              return item[key]
                .toString()
                .toLowerCase()
                .includes(digitado.toLowerCase());
            });
          })
      );
    } catch (err) {
      console.error(err.message);
    }
  }, [digitado]);

  ///////////////////////////////////////////////////////
  //////////////Tag Calendario///////////////////////////
  const [scheduleTag, setScheduleTag] = useState([]);
  const SearchScheduleTag = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/schedule/tag",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const jsonData = await response.json();
      const newArray = jsonData.map((item) => ({
        id: item.calendariotag_id,
        nome: item.calendariotag_name,
        valor: item.calendariotag_valor,
        status: item.calendarioTag_status,
      }));

      setScheduleTag(
        newArray
          .sort(function (a, b) {
            return a.nome.toLowerCase() > b.nome.toLowerCase()
              ? 1
              : b.nome.toLowerCase() > a.nome.toLowerCase()
              ? -1
              : 0;
          })
          .filter((item) => {
            return Object.keys(item).some((key) => {
              return item[key]
                .toString()
                .toLowerCase()
                .includes(digitado.toLowerCase());
            });
          })
      );
    } catch (err) {
      console.error(err.message);
    }
  }, [digitado]);

  const ListaCarros = useCallback(async () => {
    try {
      const response = await fetch("https://api.devteam.vps-kinghost.net/car", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const jsonData = await response.json();
      const newArray = jsonData.map((item) => ({
        id: item.carro_id,
        nome: item.carro_name,
        placa: item.carro_plate,
        status: item.carro_status,
        km: item.carro_km,
        iddoc: item.carro_iddoc,
        motorista: item.carro_driver,
        carro: item.carro_car,
        kmfinal: item.carro_kmstop,
        kminicial: item.carro_kmstart,
        obs: item.carro_obs,
        diaFinal: item.carro_daystop,
        destino: item.carro_destiny,
        dia: item.carro_date,
        oleo: item.carro_oil,
      }));
      setCarros(
        newArray.filter((item) => {
          return Object.keys(item).some((key) => {
            return item[key]
              .toString()
              .toLowerCase()
              .includes(digitado.toLowerCase());
          });
        })
      );
    } catch (err) {
      console.error(err.message);
    }
  }, [digitado]);

  const ListaKm = useCallback(async () => {
    try {
      const response = await fetch("https://api.devteam.vps-kinghost.net/km", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const jsonData = await response.json();
      const newArray = jsonData.map((item) => ({
        id: item.km_id,
        carro: item.km_car,
        dia: item.km_date,
        destino: item.km_destiny,
        motorista: item.km_driver,
        kmfinal: item.km_kmstop,
        kminicial: item.km_kmstart,
        obs: item.km_obs,
        diaFinal: item.km_daystop,
      }));
      setKm(
        newArray.filter((item) => {
          return Object.keys(item).some((key) => {
            return item[key]
              .toString()
              .toLowerCase()
              .includes(digitado.toLowerCase());
          });
        })
      );
    } catch (err) {
      console.error(err.message);
    }
  }, [digitado, km]);

  const ListaMotorista = useCallback(async () => {
    try {
      const response = await fetch(
        "https://api.devteam.vps-kinghost.net/driver",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const jsonData = await response.json();
      const newArray = jsonData.map((item) => ({
        id: item.motorista_id,
        nome: item.motorista_name,
        validade: item.motorista_validate,
      }));

      setMotorista(
        newArray.filter((item) => {
          return Object.keys(item).some((key) => {
            return item[key]
              .toString()
              .toLowerCase()
              .includes(digitado.toLowerCase());
          });
        })
      );
    } catch (err) {
      console.error(err.message);
    }
  }, [digitado, motorista]);

  useEffect(() => {
    SearchClient();
    SearchService();
    SearchBuy();
  }, []);
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        userAuth,
        setUserAuth,
        authUser,
        setAuthUser,
        client,
        setClient,
        service,
        setService,
        serviceFilter,
        setServiceFilter,
        serviceClosed,
        setserviceClosed,
        finance,
        setFinance,
        buy,
        setBuy,
        produtos,
        setProdutos,
        events,
        setEvents,
        merchant,
        serMerchant,
        financeTag,
        setFinanceTag,
        serviceTag,
        setServiceTag,
        productionTag,
        setProductionTag,
        scheduleTag,
        setScheduleTag,
        digitado,
        setDigitado,
        mesGrafico,
        setMesGrafico,
        diaAtual,
        setDiaAtual,
        mesAtual,
        setMesAtual,
        setAnoAtual,
        anoAtual,
        openImprimir,
        setOpenImprimir,
        valorTotal,
        setValorTotal,
        financieroFilter,
        setFinanceiroFilter,
        token,
        setToken,
        programacao,
        setProgramacao,
        usuario,
        setUsuario,
        nivelUser,
        setNivelUser,
        comercialRoute,
        comprasRoute,
        admRoute,
        setComercialRoute,
        setAdmRoute,
        setComprasRoute,
        routeNivel,
        setRouteNivel,
        novoPath,
        setNovoPath,
        carros,
        setCarros,
        km,
        setKm,
        motorista,
        setMotorista,
        setOleo,
        oleo,
        user,
        setUser,
        email,
        setEmail,
        password,
        setPassword,
        cartao,
        setCartao,
        SearchClient,
        SearchService,
        SearchFinance,
        SearchEvents,
        SearchBuy,
        SearchMerchant,
        SearchFinanceTag,
        SearchServiceTag,
        SearchProductionTag,
        SearchScheduleTag,
        serviceFilterProduction,
        setServiceFilterProduction,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
