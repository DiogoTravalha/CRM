import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Badge,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
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
    Pagination,
    PaginationItem,
    PaginationLink,
    Row,
    Table,
    UncontrolledDropdown,
} from 'reactstrap';
import { useAuth } from '../../components/context';
import firebase from '../../components/firebase';
import HeaderPage from '../../components/Headers/HeaderPage.js';

const Produtos = () => {
    const [open, setOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [nome, setNome] = useState();
    const [marca, setMarca] = useState();
    const [preco, setPreco] = useState();
    const [id, setId] = useState();
    const [page, setPage] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState([]);
    const [todosPerpage, setTodosPerpage] = useState(10);
    const {
        clientes,
        setClientes,        
        produtos,
        setProdutos,
        produtosFilter,
        setProdutosFilter,
        produtosFiltrado,
        setProdutosFiltrado,
    } = useAuth();

    const sucesso = () => toast.success('Cadastrado com Sucesso!');
    const sucessoEdit = () => toast.success('Editado com Sucesso!');
    const sucessoDel = () => toast.success('Deletado com Sucesso!');
    const erro = () => toast.error('Erro ao Cadastrar!');
    const erroAtt = () => toast.error('Erro ao Atualizar!');
    const erroDel = () => toast.error('Erro ao Deletar!');

    function togleOpenEdit(item) {
        if (editOpen === false) {
            setEditOpen(true);
            setOpen(false);
            setNome(item.nome);
            setId(item.id);
            setMarca(item.marca);
            setPreco(item.preco);
        } else {
            setEditOpen(false);
        }
    }

    function togleOpenAdd() {
        if (open === false) {
            setOpen(true);
            setEditOpen(false);
            setNome();
            setId();
            setMarca();
            setPreco();
        } else {
            setOpen(false);
        }
    }

    function pageLimits() {
        const pagination = produtos.slice(
            (currentPage - 1) * todosPerpage,
            currentPage * todosPerpage
        );
        setPage(pagination);

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(produtos.length / todosPerpage); i++) {
            pageNumbers.push(i);
            setTotalPage(pageNumbers);
        }
    }

    function AddProduto() {
        const current = new Date();
        const date = `${current.getDate()}/${
            current.getMonth() + 1
        }/${current.getFullYear()}`;

        firebase
            .firestore()
            .collection('produtos')
            .add({
                nome: nome,
                marca: marca,
                preco: preco,
                status: true,
                dia: date,
                opcional: false,
            })
            .then((doc) => {
                setProdutos((prev) => [
                    {
                        id: doc.id,
                        nome: nome,
                        marca: marca,
                        preco: preco,
                        status: true,
                        dia: date,
                        opcional: false,
                    },
                    ...prev,
                ]);

                setOpen(!open);
                setNome();
                setMarca();
                sucesso();
            })
            .catch((error) => {
                erro();
            });
    }

    function delCliente(item) {
        const produtoID = produtos.filter((doc) => doc.id !== item.id);
        firebase
            .firestore()
            .collection('produtos')
            .doc(item.id)
            .delete()
            .then(() => {
                if (produtos.length === 1) {
                    setProdutos([]);
                    sucessoDel();
                    setEditOpen(false);
                    setOpen(false);
                } else {
                    setProdutos(produtoID);
                    sucessoDel();
                }
            })
            .catch((error) => {
                erroDel();
            });
    }

    function editCliente() {
        const current = new Date();
        const date = `${current.getDate()}/${
            current.getMonth() + 1
        }/${current.getFullYear()}`;
        const clienteID = produtos.filter((doc) => doc.id !== id);
        setProdutos(clienteID);

        firebase
            .firestore()
            .collection('produtos')
            .doc(id)
            .update({
                nome: nome,
                marca: marca,
                preco: preco,
            })
            .then(() => {
                setProdutos((prev) => [
                    {
                        id: id,
                        nome: nome,
                        marca: marca,
                        preco: preco,
                        status: true,
                        dia: date,
                    },
                    ...prev,
                ]);

                sucessoEdit();
                setEditOpen(!editOpen);
            })
            .catch((error) => {
                erroAtt();
                console.log(error);
            });
    }

    function updadeStatus(item) {
        firebase
            .firestore()
            .collection('produtos')
            .doc(item.id)
            .update({
                status: !item.status,
            })
            .then(() => {
                sucessoEdit();
                // ListaClientes();
            })
            .catch((error) => {
                erroAtt();
                console.log(error);
            });
    }

    function updadeStatusOpcional(item) {
        firebase
            .firestore()
            .collection('produtos')
            .doc(item.id)
            .update({
                opcional: !item.opcional,
            })
            .then(() => {
                sucessoEdit();
                // ListaClientes();
            })
            .catch((error) => {
                erroAtt();
                console.log(error);
            });
    }

    useEffect(() => {
        pageLimits();
    }, [open, produtos, produtosFilter, currentPage, produtosFiltrado]);

    return (
        <>
            <HeaderPage />
            <ToastContainer />
            <Container className="mt--7" fluid>
                <Row>
                    <div className="col">
                        <Card className="shadow">
                            <CardHeader className="border-0">
                                <h3 className="mb-0">Lista Produtos</h3>
                            </CardHeader>
                            <Table
                                className="align-items-center table-flush"
                                responsive
                            >
                                <thead className="thead-light">
                                    <tr>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Marca</th>
                                        <th scope="col">Preco</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Opcional</th>
                                        <th scope="col" />
                                        <th scope="col" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {page.map((item, index) => (
                                        <tr key={index}>
                                            <th scope="row">
                                                <Media className="align-items-center">
                                                    <Media>
                                                        <span className="mb-0 text-sm">
                                                            {item?.nome}
                                                        </span>
                                                    </Media>
                                                </Media>
                                            </th>
                                            <td>{item?.marca}</td>
                                            <td>
                                                <Badge
                                                    color=""
                                                    className="badge-dot mr-4"
                                                >
                                                    {Number(
                                                        item?.preco
                                                    ).toLocaleString('pt-br', {
                                                        style: 'currency',
                                                        currency: 'BRL',
                                                    })}
                                                </Badge>
                                            </td>
                                            <td>
                                                <Button
                                                    onClick={() =>
                                                        updadeStatus(item)
                                                    }
                                                    color={
                                                        item?.status === true
                                                            ? 'success'
                                                            : 'danger'
                                                    }
                                                >
                                                    {item?.status === true
                                                        ? 'Sim'
                                                        : 'Não'}
                                                </Button>
                                            </td>

                                            <td>
                                                <Button
                                                    onClick={() =>
                                                        updadeStatusOpcional(
                                                            item
                                                        )
                                                    }
                                                    color={
                                                        item?.opcional === true
                                                            ? 'success'
                                                            : 'danger'
                                                    }
                                                >
                                                    {item?.opcional === true
                                                        ? 'Sim'
                                                        : 'Não'}
                                                </Button>
                                            </td>

                                            <td className="text-right">
                                                <UncontrolledDropdown>
                                                    <DropdownToggle
                                                        className="btn-icon-only text-light"
                                                        role="button"
                                                        size="sm"
                                                        color=""
                                                        onClick={(e) =>
                                                            e.preventDefault()
                                                        }
                                                    >
                                                        <i className="fas fa-ellipsis-v" />
                                                    </DropdownToggle>
                                                    <DropdownMenu
                                                        className="dropdown-menu-arrow"
                                                        right
                                                    >
                                                        <DropdownItem
                                                            onClick={() =>
                                                                togleOpenEdit(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            Editar
                                                        </DropdownItem>
                                                        <DropdownItem
                                                            onClick={() =>
                                                                delCliente(item)
                                                            }
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
                                <Button color="success" onClick={togleOpenAdd}>
                                    Novo Produto
                                </Button>
                                <nav aria-label="...">
                                    <Pagination
                                        className="pagination justify-content-end mb-0"
                                        listClassName="justify-content-end mb-0"
                                    >
                                        <PaginationItem
                                            className={
                                                currentPage === 1 && `disabled`
                                            }
                                        >
                                            <PaginationLink
                                                onClick={() =>
                                                    setCurrentPage(
                                                        currentPage - 1
                                                    )
                                                }
                                                tabIndex="-1"
                                            >
                                                <i className="fas fa-angle-left" />
                                                <span className="sr-only">
                                                    Anterior
                                                </span>
                                            </PaginationLink>
                                        </PaginationItem>
                                        {totalPage.map((index) => (
                                            <PaginationItem
                                                className="active"
                                                key={index}
                                            >
                                                <PaginationLink
                                                    style={{
                                                        background:
                                                            currentPage ===
                                                            index
                                                                ? 'black'
                                                                : '',
                                                    }}
                                                    onClick={() =>
                                                        setCurrentPage(index)
                                                    }
                                                >
                                                    {index}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}
                                        <PaginationItem
                                            className={
                                                totalPage.length === currentPage
                                                    ? `disabled`
                                                    : ``
                                            }
                                        >
                                            <PaginationLink
                                                onClick={() =>
                                                    setCurrentPage(
                                                        currentPage + 1
                                                    )
                                                }
                                            >
                                                <i className="fas fa-angle-right" />
                                                <span className="sr-only">
                                                    Proximo
                                                </span>
                                            </PaginationLink>
                                        </PaginationItem>
                                    </Pagination>
                                </nav>
                            </CardFooter>
                        </Card>
                    </div>
                </Row>
                {editOpen === true && (
                    <CardBody className="px-lg-5 py-lg-5">
                        <div className="text-center text-muted mb-4">
                            <large>Editar Produto</large>
                        </div>
                        <Form role="form">
                            <FormGroup>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-single-02" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Nome"
                                        type="text"
                                        autoComplete="novo-nome"
                                        value={nome}
                                        onChange={(e) =>
                                            setNome(e.target.value)
                                        }
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-delivery-fast" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Marca"
                                        type="text"
                                        autoComplete="novo-tel"
                                        value={marca}
                                        onChange={(e) =>
                                            setMarca(e.target.value)
                                        }
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-diamond" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Endereço"
                                        type="text"
                                        autoComplete="novo-endereco"
                                        value={preco}
                                        onChange={(e) =>
                                            setPreco(e.target.value)
                                        }
                                    />
                                </InputGroup>
                            </FormGroup>

                            <div className="text-center">
                                <Button
                                    className="my-4"
                                    color="primary"
                                    type="button"
                                    onClick={editCliente}
                                >
                                    Atualizar
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                )}
                {open === true && (
                    <CardBody className="px-lg-5 py-lg-5">
                        <div className="text-center text-muted mb-4">
                            <large>Novo Produto</large>
                        </div>
                        <Form role="form">
                            <FormGroup>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-single-02" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Nome"
                                        type="text"
                                        autoComplete="novo-nome"
                                        value={nome}
                                        onChange={(e) =>
                                            setNome(e.target.value)
                                        }
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-delivery-fast" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Marca"
                                        type="text"
                                        autoComplete="novo-tel"
                                        value={marca}
                                        onChange={(e) =>
                                            setMarca(e.target.value)
                                        }
                                    />
                                </InputGroup>
                            </FormGroup>
                            <FormGroup>
                                <InputGroup className="input-group-alternative">
                                    <InputGroupAddon addonType="prepend">
                                        <InputGroupText>
                                            <i className="ni ni-diamond" />
                                        </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                        placeholder="Preço"
                                        type="text"
                                        autoComplete="novo-endereco"
                                        value={preco}
                                        onChange={(e) =>
                                            setPreco(e.target.value)
                                        }
                                    />
                                </InputGroup>
                            </FormGroup>

                            <div className="text-center">
                                <Button
                                    className="my-4"
                                    color="primary"
                                    type="button"
                                    onClick={AddProduto}
                                >
                                    Cadastrar
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                )}
            </Container>
        </>
    );
};

export default Produtos;
