import { Container, Img, Loading } from "./PreloadCss";

import { useEffect, useState } from "react";
import { Route, Switch } from "react-router-dom";
import AuthLayout from "../../layouts/Auth";
import AdminLayout from "../../layouts/Admin";
import imgLogo from "../../assets/Logo.png";

import api from "../../api";

export default function PreloadPage() {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [userAuth, setUserAuth] = useState();

  const checkAuth = async () => {
    if (localStorage.getItem("token")) {
      const result = await api.checkToken(localStorage.getItem("token"));

      if (result.erro) {
        setAuth(false);
        setLoading(false);
      } else {
        const user = await result.data.map((item) => ({
          id: item.user_id,
          email: item.user_email,
          level: item.user_level,
          token: localStorage.getItem("token"),
        }));
        setUserAuth(user[0]);
        setAuth(true);
        setLoading(false);
      }
    } else {
      console.log("Preload");
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [auth]);

  return (
    <>
      {loading ? (
        <Container>
          <Img src={imgLogo} />
          <Loading />
        </Container>
      ) : (
        <Switch>
          {auth === false ? (
            <Route to="/" render={(props) => <AuthLayout {...props} />} />
          ) : (
            <Route
              to="/"
              render={(props) => <AdminLayout {...props} user={userAuth} />}
            />
          )}
        </Switch>
      )}
    </>
  );
}
