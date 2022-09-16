import CarrosPage from "./Pages/examples/Carros";
import Clientes from "./Pages/Client/Clients";
import Compras from "./Pages/Shopping/Compras";
import Fabricacao from "./Pages/Production/Production.js";
import Financeiro from "./Pages/Finance/Finance";
import Fornecedores from "./Pages/Business/Business";
import Inicio from "./Pages/Home/Inicio";
import Servicos from "./Pages/Service/Service";
import Calendario from "./Pages/Calendar/Calendar";
import Login from "./Pages/examples/Login";
import ServicoTagPage from "./Pages/Tags/ServicoTag";
import CalendarioTagPage from "./Pages/Tags/CalendarTag";
import FabricarTagPage from "./Pages/Tags/FabricacaoTag";
import PagamentoPage from "./Pages/Tags/PagamentoTag";
import MotoristaPage from "./Pages/examples/Motoristas";
import PreloadPage from "./Pages/Preload/Preload";

var routes = [
  /* {
        path: '/index',
        name: 'Início',
        icon: 'ni ni-tv-2 text-primary',
        component: Index,
        layout: '/admin',
    }, */
  /* {
        path: '/tables',
        name: 'Tables',
        icon: 'ni ni-bullet-list-67 text-red',
        component: Tables,
        layout: '/admin',
    }, */
  {
    path: "/inicio",
    name: "Início",
    icon: "ni ni-tv-2 text-primary",
    component: Inicio,
    layout: "/admin",
    nivel: "1",
  },

  {
    path: "/clientes",
    name: "Clientes",
    icon: "ni ni-single-02 text-yellow",
    component: Clientes,
    layout: "/admin",
    nivel: "1",
  },
  /*    {
        path: '/produtos',
        name: 'Produtos',
        icon: 'ni ni-box-2 text-blue',
        component: Produtos,
        layout: '/admin',
    }, */
  {
    path: "/servicos",
    name: "Serviços",
    icon: "ni ni-bullet-list-67 text-red",
    component: Servicos,
    layout: "/admin",
    nivel: "1",
  },
  {
    path: "/fabricacao",
    name: "Fabricação",
    icon: "ni ni-building text-blue",
    component: Fabricacao,
    layout: "/admin",
    nivel: "2",
  },
  {
    path: "/financeiro",
    name: "Financeiro",
    icon: "fas fa-donate text-green",
    component: Financeiro,
    layout: "/admin",
    nivel: "3",
  },
  {
    path: "/calendario",
    name: "Calendário",
    icon: "far fa-calendar-alt text-orange",
    component: Calendario,
    layout: "/admin",
    nivel: "1",
  },
  /*  {
        path: '/icons',
        name: 'Icons',
        icon: 'ni ni-planet text-blue',
        component: Icons,
        layout: '/admin',
    }, */
  /*     {
        path: '/orcar',
        name: 'Orçamento',
        icon: 'ni ni-paper-diploma text-blue',
        component: Orcamentos,
        layout: '/admin',
    },
    {
        path: '/editorcar',
        name: 'Editar Orçamento',
        icon: 'ni ni-paper-diploma text-blue',
        component: EditOrcamentos,
        layout: '/admin',
    },
    {
        path: '/icons',
        name: 'Icons',
        icon: 'ni ni-planet text-blue',
        component: Icons,
        layout: '/admin',
    }, 
    /*   {
        path: '/maps',
        name: 'Maps',
        icon: 'ni ni-pin-3 text-orange',
        component: Maps,
        layout: '/admin',
    }, */
  /* {
        path: '/user-profile',
        name: 'User Profile',
        icon: 'ni ni-single-02 text-yellow',
        component: Profile,
        layout: '/admin',
    },
    {
        path: '/tables',
        name: 'Tables',
        icon: 'ni ni-bullet-list-67 text-red',
        component: Tables,
        layout: '/admin',
    }, */

  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: Login,
    layout: "/auth",
    nivel: "5",
  },
  // {
  //   path: "/register",
  //   name: "Register",
  //   icon: "ni ni-key-25 text-info",
  //   component: Register,
  //   layout: "/auth",
  //   nivel: "5",
  // },
  {
    path: "/compras",
    name: "Compras",
    icon: "fas fa-shopping-basket text-info",
    component: Compras,
    layout: "/admin",
    nivel: "2",
  },
  {
    path: "/fornecedor",
    name: "Fornecedores",
    icon: "fas fa-industry text-muted",
    component: Fornecedores,
    layout: "/admin",
    nivel: "2",
  },
  // {
  //   path: "/carros",
  //   name: "Carros",
  //   icon: "fas fa-car text-pink",
  //   component: CarrosPage,
  //   layout: "/admin",
  //   nivel: "0",
  // },
  // {
  //   path: "/motoristas",
  //   name: "Motoristas",
  //   icon: "fas fa-users text-info",
  //   component: MotoristaPage,
  //   layout: "/admin",
  //   nivel: "3",
  // },
  {
    path: "/pagamentos",
    name: "Tag Pagamentos",
    icon: "fas fa-tags text-muted",
    component: PagamentoPage,
    layout: "/admin",
    nivel: "3",
  },
  {
    path: "/tagservicos",
    name: "Tag Serviços",
    icon: "fas fa-tags text-green",
    component: ServicoTagPage,
    layout: "/admin",
    nivel: "3",
  },
  {
    path: "/tagfabricacao",
    name: "Tag Fabricação",
    icon: "fas fa-tags text-red",
    component: FabricarTagPage,
    layout: "/admin",
    nivel: "3",
  },
  {
    path: "/tagcalendario",
    name: "Tag Calendário",
    icon: "fas fa-tags text-blue",
    component: CalendarioTagPage,
    layout: "/admin",
    nivel: "3",
  },
  /*    {
        path: '/programacao',
        name: 'Programação',
        icon: 'ni ni-circle-08 text-pink',
        component: Programacao,
        layout: '/admin',
    }, */
];
export default routes;
