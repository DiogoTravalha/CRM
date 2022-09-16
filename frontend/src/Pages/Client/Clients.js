import { useEffect, useState, useCallback } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Badge,
  Card,
  CardFooter,
  CardHeader,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Media,
  Navbar,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Table,
  UncontrolledDropdown,
} from "reactstrap";
import { useAuth } from "../../components/context";
import HeaderPage from "../../components/Headers/HeaderPage";
import AddClient from "../Client/AddClient";
import DelClient from "./DelClient";
import EditClient from "./EditClient";

const Clientes = () => {
  const { client } = useAuth();
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [dados, setDados] = useState();
  const [page, setPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState([]);
  const [todosPerpage, setTodosPerpage] = useState(5);
  const [digitado, setDigitado] = useState("");

  function togleOpenEdit(item) {
    if (editOpen === false) {
      setEditOpen(true);
      setOpen(false);
      setDados(item);
    } else {
      setEditOpen(false);
    }
  }

  function togleOpenDel(item) {
    if (delOpen === false) {
      setDelOpen(true);
      setDados(item);
    } else {
      setDelOpen(false);
    }
  }

  function pageLimits() {
    const dados = client.filter((doc) => {
      return Object.keys(doc).some((key) => {
        return doc[key]
          .toString()
          .toLowerCase()
          .includes(digitado.toLowerCase());
      });
    });
    const pagination = dados.slice(
      (currentPage - 1) * todosPerpage,
      currentPage * todosPerpage
    );
    setPage(pagination);

    const pageNumbers = [];
    for (let i = 0; i <= Math.ceil(dados.length / todosPerpage); i++) {
      pageNumbers.push(i);
      const filtro = pageNumbers.filter((item, index) => index);
      setTotalPage(filtro);
    }
  }

  useEffect(() => {
    pageLimits();
    console.log(totalPage);
  }, [open, editOpen, client, currentPage, dados, digitado]);

  return (
    <>
      <Navbar
        className="navbar-top navbar-dark"
        expand="md"
        id="navbar-main"
      ></Navbar>
      <HeaderPage />
      <ToastContainer autoClose={3000} />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader
                className="border-0"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  padding: "10px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <h3 className="mb-0">Lista Clientes</h3>
                <FormGroup className="mb-0" style={{ marginRight: "10px" }}>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="fas fa-search" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Busca"
                      type="text"
                      name="nome"
                      id="nome"
                      value={digitado}
                      onChange={(e) => setDigitado(e.currentTarget.value)}
                    />
                  </InputGroup>
                </FormGroup>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Nome</th>
                    <th scope="col">Telefone</th>
                    <th scope="col">Endereço</th>
                    <th scope="col">Bairro</th>
                    <th scope="col">Cidade</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {page.map((item, index) => (
                    <tr key={index}>
                      <th scope="row">
                        <Media className="align-items-center">
                          <Media>
                            <span className="mb-0 text-sm">{item?.nome}</span>
                          </Media>
                        </Media>
                      </th>
                      <td>{item?.telefone}</td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          {item?.endereco} - {item?.numero}
                        </Badge>
                      </td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          {item?.bairro}
                        </Badge>
                      </td>
                      <td>
                        <Badge color="" className="badge-dot mr-4">
                          {item?.cidade}
                        </Badge>
                      </td>

                      <td className="text-right">
                        <UncontrolledDropdown>
                          <DropdownToggle
                            className="btn-icon-only text-light"
                            role="button"
                            size="sm"
                            color=""
                            onClick={(e) => e.preventDefault()}
                          >
                            <i className="fas fa-ellipsis-v" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-arrow" right>
                            <DropdownItem onClick={() => togleOpenEdit(item)}>
                              Editar
                            </DropdownItem>
                            <DropdownItem onClick={() => togleOpenDel(item)}>
                              Deletar
                            </DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <AddClient />
                <EditClient
                  dados={dados}
                  editOpen={editOpen}
                  setEditOpen={setEditOpen}
                />
                <DelClient
                  dados={dados}
                  delOpen={delOpen}
                  setDelOpen={setDelOpen}
                />
                {totalPage.length > 0 && (
                  <nav aria-label="...">
                    <Pagination
                      className="pagination justify-content-end mb-0"
                      listClassName="justify-content-end mb-0"
                    >
                      {currentPage !== totalPage[0] && (
                        <PaginationItem className="active">
                          <PaginationLink
                            style={{
                              zIndex: 0,
                            }}
                            onClick={() => setCurrentPage(totalPage[0])}
                          >
                            <i className="fas fa-angle-left" />{" "}
                            <i className="fas fa-angle-left" />
                          </PaginationLink>
                        </PaginationItem>
                      )}
                      <PaginationItem
                        className={currentPage === 1 && `disabled`}
                      >
                        <PaginationLink
                          onClick={() => setCurrentPage(currentPage - 1)}
                          tabIndex="-1"
                        >
                          <i className="fas fa-angle-left" />
                          <span className="sr-only">Anterior</span>
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem className="active">
                        <PaginationLink
                          style={{
                            background: "#F8485E",
                            zIndex: 0,
                            border: "none",
                          }}
                          onClick={() => setCurrentPage(currentPage)}
                        >
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem
                        className={
                          totalPage.length === currentPage ? `disabled` : ``
                        }
                      >
                        <PaginationLink
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          <i className="fas fa-angle-right" />
                          <span className="sr-only">Proximo</span>
                        </PaginationLink>
                      </PaginationItem>
                      {currentPage < totalPage.length && (
                        <PaginationItem className="active">
                          <PaginationLink
                            style={{
                              // background: currentPage === index ? "black" : "",
                              zIndex: 0,
                            }}
                            onClick={() => setCurrentPage(totalPage.length)}
                          >
                            <i className="fas fa-angle-right" />
                            <i className="fas fa-angle-right" />
                          </PaginationLink>
                        </PaginationItem>
                      )}
                    </Pagination>
                  </nav>
                )}
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Clientes;
