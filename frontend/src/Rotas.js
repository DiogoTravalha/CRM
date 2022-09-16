import "@fortawesome/fontawesome-free/css/all.min.css";
import React, { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import api from "./api";
import "./assets/plugins/nucleo/css/nucleo.css";
import "./assets/scss/argon-dashboard-react.scss";
import { AuthProvider } from "./components/context";
import AdminLayout from "./layouts/Admin.js";
import AuthLayout from "./layouts/Auth";

export default function Rotas() {
  const [auth, setAuth] = useState(false);
  const [userAuth, setUserAuth] = useState();

  const checkAuth = async () => {
    if (localStorage.getItem("token") !== null) {
      const result = await api.checkToken(localStorage.getItem("token"));
      //localStorage.removeItem("token");

      if (result.erro) {
        setAuth(false);
      } else {
        const user = await result.map((item) => ({
          id: item.user_id,
          email: item.user_email,
          level: item.user_level,
          token: localStorage.getItem("token"),
        }));
        setUserAuth(user[0]);
        setAuth(true);
      }
    } else {
      setAuth(false);
    }
  };

  useEffect(async () => {
    checkAuth();
  }, [auth]);

  return (
    <Switch>
      {auth === false ? (
        <Route to="/auth" render={(props) => <AuthLayout {...props} />} />
      ) : (
        <Route
          to="/admin"
          render={(props) => <AdminLayout {...props} user={userAuth} />}
        />
      )}
    </Switch>
  );
}
