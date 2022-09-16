import { PropTypes } from "prop-types";
import { useEffect, useState } from "react";
import { Link, NavLink as NavLinkRRD, Redirect } from "react-router-dom";

import {
  Col,
  Collapse,
  Container,
  Nav,
  Navbar,
  NavbarBrand,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";
import AdminLayout from "../../layouts/Admin";

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState();

  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };

  const closeCollapse = () => {
    setCollapseOpen(true);
  };

  const createLinks = () => {
    return routes.map((prop, key) => {
      return (
        <NavItem key={key}>
          <NavLink
            to={prop.layout + prop.path}
            tag={NavLinkRRD}
            onClick={closeCollapse}
            activeClassName="active"
          >
            <i className={prop.icon} />
            {prop.name}
          </NavLink>
        </NavItem>
      );
    });
  };

  function logout() {
    window.location.replace(
      <Redirect to="/admin" render={(props) => <AdminLayout {...props} />} />
    );
    localStorage.removeItem("token");
  }

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  useEffect(() => {}, [collapseOpen]);

  return (
    <>
      <>
        <Navbar
          className="navbar-vertical fixed-left navbar-light bg-white"
          expand="md"
          id="sidenav-main"
        >
          <Container fluid>
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleCollapse}
            >
              <span className="navbar-toggler-icon" />
            </button>

            {logo ? (
              <>
                <NavbarBrand className="pt-0" {...navbarBrandProps}>
                  <img
                    alt={logo.imgAlt}
                    className="navbar-brand-img"
                    src={logo.imgSrc}
                  />
                </NavbarBrand>
              </>
            ) : null}

            <Collapse navbar isOpen={collapseOpen}>
              <div className="navbar-collapse-header d-md-none">
                <Row>
                  {logo ? (
                    <Col className="collapse-brand" xs="6">
                      {logo.innerLink ? (
                        <Link to={logo.innerLink}>
                          <img alt={logo.imgAlt} src={logo.imgSrc} />
                        </Link>
                      ) : (
                        <a href={logo.outterLink}>
                          <img alt={logo.imgAlt} src={logo.imgSrc} />
                        </a>
                      )}
                    </Col>
                  ) : null}
                  <Col className="collapse-close" xs="6">
                    <button
                      className="navbar-toggler"
                      type="button"
                      onClick={toggleCollapse}
                    >
                      <span />
                      <span />
                    </button>
                  </Col>
                </Row>
              </div>

              <Nav navbar onClick={toggleCollapse}>
                {createLinks(routes)}
              </Nav>

              <hr className="my-3" />
              <Nav navbar onClick={toggleCollapse}>
                <NavLink to={""} tag={NavLinkRRD} onClick={(e) => logout(e)}>
                  <i className="fas fa-power-off text-red" />
                  Sair
                </NavLink>
              </Nav>
            </Collapse>
          </Container>
        </Navbar>
      </>
    </>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
