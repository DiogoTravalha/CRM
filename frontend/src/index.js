import React from "react";
import ReactDOM from "react-dom";

import "./assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./assets/scss/argon-dashboard-react.scss";

import Rotas from "./Rotas";
import { AuthProvider } from "./components/context";
import { BrowserRouter } from "react-router-dom";
import PreloadPage from "./Pages/Preload/Preload";

ReactDOM.render(
  <AuthProvider>
    <BrowserRouter>
      <PreloadPage />
    </BrowserRouter>
  </AuthProvider>,
  document.getElementById("root")
);
