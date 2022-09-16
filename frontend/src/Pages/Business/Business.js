import { useEffect, useState } from "react";
import { Confirm } from "react-st-modal";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  CardTitle,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Form,
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
import AddBusiness from "./AddBusiness";
import EditBusiness from "./EditBusiness";

const Fornecedores = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [nome, setNome] = useState();
  const [telefone, setTelefone] = useState();
  const [endereco, setEndereco] = useState();
  const [cidade, setCidade] = useState();
  const [bairro, setBairro] = useState();
  const [page, setPage] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState([]);
  const [todosPerpage, setTodosPerpage] = useState(10);
  const [id, setId] = useState();
  const [dados, setDados] = useState();
  const [digitado, setDigitado] = useState("");

  const { SearchMerchant, merchant } = useAuth();

  const sucessoDel = () => toast.success("Deletado com Sucesso!");
  const erroDel = () => toast.error("Erro ao Deletar!");

  function togleOpenEdit(item) {
    if (editOpen === false) {
      setEditOpen(true);
      setOpen(false);
      setDados(item);
    } else {
      setEditOpen(false);
    }
  }

  async function delCliente(item) {
    try {
      const deleteTodo = await fetch(
        `https://api.devteam.vps-kinghost.net/company/delete/${item.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      sucessoDel();
      SearchMerchant();
    } catch (err) {
      erroDel();
      console.error(err.message);
    }
  }

  function pageLimits() {
    const dados = merchant.filter((doc) => {
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
    SearchMerchant();
    pageLimits();
  }, [
    open,
    editOpen,
    currentPage,
    nome,
    telefone,
    endereco,
    cidade,
    bairro,
    merchant,
    digitado,
  ]);
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
                <h3 className="mb-0">Lista Fornecedores</h3>
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
                    {/*<th scope="col">Endereço</th>
                                        <th scope="col">Bairro</th>
                                        <th scope="col">Cidade</th> */}
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
                            <DropdownItem
                              onClick={async () => {
                                const isConfirm = await Confirm(
                                  "Você não pode desfazer esta ação",
                                  `Você tem certeza que você quer excluir ${item.nome}?`,
                                  "Deletar",
                                  "Cancelar"
                                );

                                if (isConfirm) {
                                  delCliente(item);
                                }
                              }}
                            >
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
                <AddBusiness />
                <EditBusiness
                  dados={dados}
                  editOpen={editOpen}
                  setEditOpen={setEditOpen}
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

export default Fornecedores;
