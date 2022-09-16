import firebase from '../../components/firebase/index';
import React, { useEffect, useState, useRef } from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';
import Select from 'react-select';

import {
    Badge,
    Button,
    ButtonGroup,
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
import HeaderPage from '../../components/Headers/HeaderPage';
import { useReactToPrint } from 'react-to-print';

import {
    Action,
    Adress,
    Body,
    City,
    ContainerAddItem,
    ContainerClient,
    ContainerDataClient,
    ContainerDate,
    ContainerFinal,
    ContainerHeader,
    ContainerItemButonn,
    ContainerList,
    ContainerLogo,
    ContainerRow,
    ContainerTitle,
    ContainerTotal,
    Dates,
    DueDate,
    IconAdd,
    ListName,
    Logo,
    Name,
    Order,
    Price,
    PriceTotal,
    ProductPrice,
    ProductPriceTotal,
    ProductQt,
    Qt,
    RemoveButton,
    RemoveLinha,
    ResultList,
    SubTotal,
    SubTotalResult,
    Taxa,
    TaxaResult,
    TextAdress,
    TextButton,
    TextCity,
    TextCompany,
    TextName,
    Title,
    Total,
    TotalResult,
    ButtonQta,
    ProductName,
} from './styled';
import { InternalSymbolName } from 'typescript';

const EditOrcamentos = () => {
    const [openEdit, setOpenEdit] = useState(false);
    const [list, setList] = useState([]);
    const [newProduto, setNewProduto] = useState([]);
    const [newAmbiente, setNewAmbiente] = useState([]);
    const [listAmbiente, setListAmbiente] = useState([]);
    const [ambienteValue, setAmbienteValue] = useState([]);
    const [listaOrcamento, setListaOrcamento] = useState();
    const [nomeValue, setNomeValue] = useState([]);
    const [ambiente, setAmbiente] = useState();
    const [qta, setQta] = useState(1);
    const [valor, setValor] = useState(0);
    const [taxa, setTaxa] = useState(3);
    const [data, setData] = useState();
    const [dataVen, setVenData] = useState();
    const [codigo, setCodigo] = useState(0);
    const { clientes, produtos, openImprimir, setOpenImprimir } = useAuth();
    const [page, setPage] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState([]);
    const [todosPerpage, setTodosPerpage] = useState(10);
    const [precoOpciona, setPrecoOpcional] = useState(0);
    const [precoMarcenaria, setPrecoMarcenaria] = useState(0);

    function handlePrint() {
        setOpenImprimir(!openImprimir);
        setTimeout(() => {
            window.print();
            if (window.closed === false) {
                setOpenImprimir(false);
            }
        }, 100);
    }

    function orcamentoLista(e) {
        firebase
            .firestore()
            .collection('clientes')
            .doc(e[0].id)
            .collection('orcamentos')
            .get()
            .then((querySnapshot) => {
                const array = [];
                const ambientesArray = [];
                querySnapshot.forEach((doc) => {
                    if (doc.data.length >= 0) {
                        const {
                            nome,
                            endereco,
                            bairro,
                            cidade,
                            ambiente,
                            dia,
                            list,
                        } = doc.data();
                        array.push({
                            id: doc.id,
                            nome: nome,
                            endereco: endereco,
                            bairro: bairro,
                            cidade: cidade,
                            ambiente: ambiente,
                            dia: dia,
                            list: list,
                        });
                        ambientesArray.push(doc.id);

                        setListAmbiente(array);
                        setNewAmbiente(ambientesArray);
                    } else {
                        ////
                    }
                });
            });
    }

    function selectCliente(e) {
        setNomeValue(e);
        orcamentoLista(e);
    }

    function listando(e) {
        var docRef = firebase
            .firestore()
            .collection('clientes')
            .doc(nomeValue[0].id)
            .collection('orcamentos')
            .doc(e[0]);

        docRef
            .get()
            .then((doc) => {
                if (doc.exists) {
                    setListaOrcamento(doc.data());
                    const { list } = doc.data();
                    setList(list);
                    let soma = 0;

                    for (let i in list.filter(
                        (item) => item.opcional !== true
                    )) {
                        soma +=
                            list[i].price === undefined
                                ? 0
                                : list[i].price * list[i].qta;
                    }

                    let money = soma * 3;
                    setPrecoMarcenaria(money);

                    let somaOpc = 0;

                    for (let i in list.filter(
                        (item) => item.opcional !== true
                    )) {
                        somaOpc +=
                            list[i].price === undefined
                                ? 0
                                : list[i].price * list[i].qta;
                    }

                    let opcional = somaOpc * 2;
                    setPrecoOpcional(opcional);
                } else {
                    console.log('No such document!');
                }
            })
            .catch((error) => {
                console.log('Error getting document:', error);
            });
    }

    function selectAmbiente(e) {
        setAmbienteValue(e);
        listando(e);
    }

    function addLinha() {
        setList([...list, { id: list.length.toString(), qta: 0 }]);
        calcular();
    }

    function removeLinha(item) {
        const newList = list.filter((items) => items.id !== item.id);

        setList(newList);
        calcular();
    }

    function selectItem(e, item) {
        const newItems = list.map((items) => {
            if (items.id === item.id) {
                return {
                    ...items,
                    value: e.value,
                    label: e.label,
                    price: e.price,
                    marca: e.marca,
                    qta: e.qta === undefined ? 1 : e.qta,
                    id: item.id,
                };
            }
            return items;
        });

        setList(newItems);
        calcular();
    }

    function calcular() {
        let soma = 0;
        for (let i in list) {
            soma +=
                list[i].price === undefined ? 0 : list[i].price * list[i].qta;
        }

        let money = soma;
        setValor(money);
    }

    function addQta(e, item) {
        const newItems = list.map((items) => {
            if (items.id === item.id) {
                return {
                    ...items,
                    value: item.value,
                    label: item.label,
                    price: item.price,
                    qta: item.qta + 1,
                    id: item.id,
                };
            }
            return items;
        });
        setList(newItems);
        calcular();
    }

    function removeQta(e, item) {
        const newItems = list.map((items) => {
            if (items.id === item.id) {
                return {
                    ...items,
                    value: item.value,
                    label: item.label,
                    price: item.price,
                    qta: item.qta - 1,
                    id: item.id,
                };
            }
            return items;
        });
        setList(newItems);
        calcular();
    }

    function dataAtualFormatada() {
        var data = new Date(),
            dia = data.getDate().toString(),
            diaF = dia.length == 1 ? '0' + dia : dia,
            mes = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
            mesF = mes.length == 1 ? '0' + mes : mes,
            anoF = data.getFullYear();
        setData(diaF + '/' + mesF + '/' + anoF);
    }

    function adicionarDiasData() {
        var hoje = new Date();
        var dataVenc = new Date(hoje.getTime() + 5 * 24 * 60 * 60 * 1000);
        return (
            dataVenc.getDate() +
            '/' +
            (dataVenc.getMonth() + 1) +
            '/' +
            dataVenc.getFullYear()
        );
    }

    function pageLimits() {
        const pagination = clientes.slice(
            (currentPage - 1) * todosPerpage,
            currentPage * todosPerpage
        );
        setPage(pagination);

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(clientes.length / todosPerpage); i++) {
            pageNumbers.push(i);
            setTotalPage(pageNumbers);
        }
    }

    function listaProdutos() {
        const newList = produtos.map((item) => ({
            value: item.nome,
            label: item.nome,
            price: item.preco,
            marca: item.marca,
            status: item.status,
            opcional: item.opcional,
        }));
        setNewProduto(newList);
    }

    function saveOrcamento() {
        firebase
            .firestore()
            .collection('clientes')
            .doc(nomeValue[0].id)
            .collection('orcamentos')
            .doc(newAmbiente[0])
            .set({
                nome: nomeValue[0].nome,
                endereco: nomeValue[0].endereco,
                bairro: nomeValue[0].bairro,
                cidade: nomeValue[0].cidade,
                ambiente: newAmbiente[0],
                dia: data,
                pedido: codigo + 1,
                list,
            })
            .then((doc) => {
                console.log('sucesso');
            })
            .catch((error) => {
                console.log('erro');
            });
    }

    const customStyle = {
        control: (provided) => ({
            ...provided,
            height: 10,
            width: 150,
            border: '0px solid black',
            fontSize: 13,
            backgroundColor: 'white',
            outline: 'none',
        }),
    };

    useEffect(() => {
        pageLimits();
        dataAtualFormatada();
        calcular();
        setVenData(adicionarDiasData(5));
        listaProdutos();
    }, [produtos, qta, valor, list, openImprimir]);

    return (
        <>
            {openImprimir === false ? (
                <>
                    {/* <HeaderPage /> */}
                    <Container>
                        <Row>
                            <div className="col">
                                <Card className="shadow">
                                    <Body>
                                        <ContainerClient>
                                            <FormGroup>
                                                <InputGroup
                                                    className="input-group-alternative"
                                                    style={{
                                                        marginLeft: '10px',
                                                    }}
                                                >
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="ni ni-single-02" />
                                                            </InputGroupText>
                                                        </InputGroupAddon>

                                                        <Typeahead
                                                            emptyLabel="Sem Resultados"
                                                            labelKey="nome"
                                                            id="nome"
                                                            onChange={(e) =>
                                                                selectCliente(e)
                                                            }
                                                            options={clientes}
                                                            placeholder="Selecione o Cliente..."
                                                            selected={nomeValue}
                                                            /* clearButton */
                                                            className="rbt form-control"
                                                            inputProps={{
                                                                style: {
                                                                    marginTop:
                                                                        '-10px',
                                                                    marginLeft:
                                                                        '-10px',
                                                                },
                                                            }}
                                                        />
                                                    </InputGroup>
                                                </InputGroup>
                                                {openEdit === false && (
                                                    <>
                                                        {nomeValue.length !==
                                                            0 && (
                                                            <ContainerDate
                                                                style={{
                                                                    marginTop:
                                                                        '10px',
                                                                }}
                                                            >
                                                                <FormGroup>
                                                                    <InputGroup
                                                                        className="input-group-alternative"
                                                                        style={{
                                                                            marginLeft:
                                                                                '10px',
                                                                            marginBottom:
                                                                                '-10px',
                                                                        }}
                                                                    >
                                                                        <InputGroupAddon addonType="prepend">
                                                                            <InputGroupText>
                                                                                <i className="ni ni-mobile-button" />
                                                                            </InputGroupText>
                                                                            <div className="rbt form-control">
                                                                                {
                                                                                    nomeValue[0]
                                                                                        .telefone
                                                                                }
                                                                            </div>
                                                                        </InputGroupAddon>
                                                                    </InputGroup>
                                                                </FormGroup>

                                                                <FormGroup>
                                                                    <InputGroup
                                                                        className="input-group-alternative"
                                                                        style={{
                                                                            marginLeft:
                                                                                '10px',
                                                                            marginBottom:
                                                                                '-10px',
                                                                        }}
                                                                    >
                                                                        <InputGroupAddon addonType="prepend">
                                                                            <InputGroupText>
                                                                                <i className="ni ni-square-pin" />
                                                                            </InputGroupText>
                                                                            <div className="rbt form-control">
                                                                                {
                                                                                    nomeValue[0]
                                                                                        .endereco
                                                                                }
                                                                            </div>
                                                                        </InputGroupAddon>
                                                                    </InputGroup>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <InputGroup
                                                                        className="input-group-alternative"
                                                                        style={{
                                                                            marginLeft:
                                                                                '10px',
                                                                            marginBottom:
                                                                                '-10px',
                                                                        }}
                                                                    >
                                                                        <InputGroupAddon addonType="prepend">
                                                                            <InputGroupText>
                                                                                <i className="ni ni-square-pin" />
                                                                            </InputGroupText>
                                                                            <div className="rbt form-control">
                                                                                {`${nomeValue[0].bairro} - ${nomeValue[0].cidade} `}
                                                                            </div>
                                                                        </InputGroupAddon>
                                                                    </InputGroup>
                                                                </FormGroup>
                                                            </ContainerDate>
                                                        )}
                                                    </>
                                                )}
                                            </FormGroup>
                                            <ContainerDate>
                                                <FormGroup
                                                    style={{
                                                        marginRight: '10px',
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            require('../../assets/img/brand/LogoNova.png')
                                                                .default
                                                        }
                                                        height="135px"
                                                    />
                                                </FormGroup>

                                                <ContainerDate
                                                    style={{
                                                        marginTop: '10px',
                                                    }}
                                                >
                                                    <FormGroup>
                                                        <InputGroup
                                                            className="input-group-alternative"
                                                            style={{
                                                                marginLeft:
                                                                    '10px',
                                                            }}
                                                        >
                                                            <InputGroupAddon addonType="prepend">
                                                                <InputGroupText>
                                                                    <i className="ni ni-single-02" />
                                                                </InputGroupText>
                                                            </InputGroupAddon>

                                                            <Typeahead
                                                                emptyLabel="Sem Resultados"
                                                                labelKey="nome"
                                                                id="nome"
                                                                onChange={(e) =>
                                                                    selectAmbiente(
                                                                        e
                                                                    )
                                                                }
                                                                options={
                                                                    newAmbiente
                                                                }
                                                                placeholder="Selecione o Ambiente..."
                                                                selected={
                                                                    ambienteValue
                                                                }
                                                                /* clearButton */
                                                                className="rbt form-control"
                                                                inputProps={{
                                                                    style: {
                                                                        marginTop:
                                                                            '-10px',
                                                                        marginLeft:
                                                                            '-10px',
                                                                    },
                                                                }}
                                                            />
                                                        </InputGroup>
                                                    </FormGroup>
                                                </ContainerDate>
                                            </ContainerDate>

                                            <ContainerDate>
                                                <FormGroup
                                                    style={{
                                                        marginRight: '10px',
                                                    }}
                                                >
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="ni ni-calendar-grid-58" />
                                                            </InputGroupText>
                                                            <div className="rbt form-control">
                                                                Dia:
                                                                {data}
                                                            </div>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                </FormGroup>
                                                <FormGroup
                                                    style={{
                                                        marginRight: '10px',
                                                    }}
                                                >
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="ni ni-calendar-grid-58" />
                                                            </InputGroupText>
                                                            <div className="rbt form-control">
                                                                Vencimento:
                                                                {dataVen}
                                                            </div>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                </FormGroup>
                                            </ContainerDate>
                                        </ContainerClient>
                                        <ContainerList>
                                            <ListName>Material</ListName>
                                            <ListName>Marca</ListName>
                                            <Qt>Qt</Qt>
                                            <Price>Valor</Price>
                                            <PriceTotal>Total</PriceTotal>
                                            <Action>Deletar</Action>
                                        </ContainerList>
                                        {list.map((item, index) => (
                                            <ResultList key={index}>
                                                <ProductName>
                                                    <Select
                                                        options={newProduto}
                                                        placeholder={item.value}
                                                        value={item.value}
                                                        onChange={(e) =>
                                                            selectItem(e, item)
                                                        }
                                                    />
                                                </ProductName>
                                                <ProductPrice>
                                                    {item.marca === undefined
                                                        ? ''
                                                        : item.marca}
                                                </ProductPrice>
                                                <ProductQt>
                                                    <InputGroupText
                                                        onClick={(e) =>
                                                            removeQta(e, item)
                                                        }
                                                        style={{
                                                            marginRight: '10px',
                                                        }}
                                                    >
                                                        <i className="ni ni-bold-left" />
                                                    </InputGroupText>

                                                    {item.qta}
                                                    <InputGroupText
                                                        style={{
                                                            marginLeft: '10px',
                                                        }}
                                                        onClick={(e) =>
                                                            addQta(e, item)
                                                        }
                                                    >
                                                        <i className="ni ni-bold-right" />
                                                    </InputGroupText>
                                                </ProductQt>
                                                <ProductPrice>
                                                    {item.price === undefined
                                                        ? 0
                                                        : item.price}
                                                </ProductPrice>
                                                <ProductPriceTotal>
                                                    {item.price === undefined
                                                        ? 0
                                                        : item.price * item.qta}
                                                </ProductPriceTotal>
                                                <InputGroupText
                                                    style={{
                                                        fontSize: '25px',
                                                        color: 'red',
                                                    }}
                                                    onClick={() =>
                                                        removeLinha(item)
                                                    }
                                                >
                                                    <i className="ni ni-fat-remove" />
                                                </InputGroupText>
                                            </ResultList>
                                        ))}
                                        <div>
                                            <i className="ni ni-fat-delete" />
                                        </div>
                                        {list.map((item, index) => (
                                            <>
                                                {item.opcional === true && (
                                                    <ResultList key={index}>
                                                        <ProductName>
                                                            {item.value ===
                                                            undefined
                                                                ? ''
                                                                : item.value}
                                                        </ProductName>
                                                        <ProductPrice>
                                                            {item.marca ===
                                                            undefined
                                                                ? ''
                                                                : item.marca}
                                                        </ProductPrice>
                                                        <ProductQt>
                                                            <InputGroupText
                                                                onClick={(e) =>
                                                                    removeQta(
                                                                        e,
                                                                        item
                                                                    )
                                                                }
                                                                style={{
                                                                    marginRight:
                                                                        '10px',
                                                                }}
                                                            >
                                                                <i className="ni ni-bold-left" />
                                                            </InputGroupText>

                                                            {item.qta}
                                                            <InputGroupText
                                                                style={{
                                                                    marginLeft:
                                                                        '10px',
                                                                }}
                                                                onClick={(e) =>
                                                                    addQta(
                                                                        e,
                                                                        item
                                                                    )
                                                                }
                                                            >
                                                                <i className="ni ni-bold-right" />
                                                            </InputGroupText>
                                                        </ProductQt>
                                                        <ProductPrice>
                                                            {item.price ===
                                                            undefined
                                                                ? 0
                                                                : item.price}
                                                        </ProductPrice>
                                                        <ProductPriceTotal>
                                                            {item.price ===
                                                            undefined
                                                                ? 0
                                                                : item.price *
                                                                  item.qta}
                                                        </ProductPriceTotal>
                                                        <InputGroupText
                                                            style={{
                                                                fontSize:
                                                                    '25px',
                                                                color: 'red',
                                                            }}
                                                            onClick={() =>
                                                                removeLinha(
                                                                    item
                                                                )
                                                            }
                                                        >
                                                            <i className="ni ni-fat-remove" />
                                                        </InputGroupText>
                                                    </ResultList>
                                                )}
                                            </>
                                        ))}

                                        <ContainerFinal>
                                            {openImprimir === false ? (
                                                <ContainerAddItem
                                                    onClick={addLinha}
                                                >
                                                    <InputGroupAddon addonType="prepend">
                                                        <InputGroupText>
                                                            <i
                                                                className="ni ni-fat-add"
                                                                style={{
                                                                    marginRight:
                                                                        '10px',
                                                                    fontSize:
                                                                        '25px',
                                                                }}
                                                            />
                                                            Adicionar Item
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </ContainerAddItem>
                                            ) : (
                                                <ContainerAddItem
                                                    onClick={addLinha}
                                                >
                                                    <InputGroupAddon addonType="prepend"></InputGroupAddon>
                                                </ContainerAddItem>
                                            )}
                                            <ContainerTotal>
                                                <ContainerRow>
                                                    <Total
                                                        style={{ color: 'red' }}
                                                    >
                                                        Opcional:
                                                        <TotalResult>
                                                            {precoOpciona.toLocaleString(
                                                                'pt-br',
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </TotalResult>
                                                    </Total>
                                                    <Total
                                                        style={{ color: 'red' }}
                                                    >
                                                        Marcenaria:
                                                        <TotalResult>
                                                            {precoMarcenaria.toLocaleString(
                                                                'pt-br',
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </TotalResult>
                                                    </Total>
                                                </ContainerRow>
                                            </ContainerTotal>
                                            <ContainerTotal
                                                style={{ alignItems: 'center' }}
                                            >
                                                <ContainerRow>
                                                    <Total>
                                                        Total:
                                                        <TotalResult>
                                                            {(
                                                                precoOpciona +
                                                                precoMarcenaria
                                                            ).toLocaleString(
                                                                'pt-br',
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </TotalResult>
                                                    </Total>
                                                </ContainerRow>
                                            </ContainerTotal>
                                        </ContainerFinal>
                                        {openImprimir === false && (
                                            <div className="text-center">
                                                <Button
                                                    className="my-4"
                                                    color="primary"
                                                    type="button"
                                                    onClick={saveOrcamento}
                                                >
                                                    Salvar
                                                </Button>
                                                <Button
                                                    className="my-4"
                                                    color="primary"
                                                    type="button"
                                                    onClick={handlePrint}
                                                >
                                                    Imprimir
                                                </Button>
                                            </div>
                                        )}
                                    </Body>
                                </Card>
                            </div>
                        </Row>
                    </Container>
                </>
            ) : (
                <>
                    <Container>
                        <Row>
                            <div className="col">
                                <Card className="shadow">
                                    <Body>
                                        <ContainerClient>
                                            <FormGroup>
                                                <InputGroup
                                                    className="input-group-alternative"
                                                    style={{
                                                        marginLeft: '10px',
                                                    }}
                                                >
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                {/* <i className="ni ni-single-02" /> */}
                                                            </InputGroupText>
                                                        </InputGroupAddon>

                                                        <Typeahead
                                                            emptyLabel="Sem Resultados"
                                                            labelKey="nome"
                                                            id="nome"
                                                            onChange={(e) =>
                                                                selectCliente(e)
                                                            }
                                                            options={clientes}
                                                            placeholder="Selecione o Cliente..."
                                                            selected={nomeValue}
                                                            /* clearButton */
                                                            className="rbt form-control"
                                                            inputProps={{
                                                                style: {
                                                                    marginTop:
                                                                        '-10px',
                                                                    marginLeft:
                                                                        '-10px',
                                                                },
                                                            }}
                                                        />
                                                    </InputGroup>
                                                </InputGroup>
                                                {openEdit === false && (
                                                    <>
                                                        {nomeValue.length !==
                                                            0 && (
                                                            <ContainerDate
                                                                style={{
                                                                    marginTop:
                                                                        '10px',
                                                                }}
                                                            >
                                                                <FormGroup>
                                                                    <InputGroup
                                                                        className="input-group-alternative"
                                                                        style={{
                                                                            marginLeft:
                                                                                '10px',
                                                                            marginBottom:
                                                                                '-10px',
                                                                        }}
                                                                    >
                                                                        <InputGroupAddon addonType="prepend">
                                                                            <InputGroupText>
                                                                                {/* <i className="ni ni-mobile-button" /> */}
                                                                            </InputGroupText>
                                                                            <div className="rbt form-control">
                                                                                {
                                                                                    nomeValue[0]
                                                                                        .telefone
                                                                                }
                                                                            </div>
                                                                        </InputGroupAddon>
                                                                    </InputGroup>
                                                                </FormGroup>

                                                                <FormGroup>
                                                                    <InputGroup
                                                                        className="input-group-alternative"
                                                                        style={{
                                                                            marginLeft:
                                                                                '10px',
                                                                            marginBottom:
                                                                                '-10px',
                                                                        }}
                                                                    >
                                                                        <InputGroupAddon addonType="prepend">
                                                                            <InputGroupText>
                                                                                {/* <i className="ni ni-square-pin" /> */}
                                                                            </InputGroupText>
                                                                            <div className="rbt form-control">
                                                                                {
                                                                                    nomeValue[0]
                                                                                        .endereco
                                                                                }
                                                                            </div>
                                                                        </InputGroupAddon>
                                                                    </InputGroup>
                                                                </FormGroup>
                                                                <FormGroup>
                                                                    <InputGroup
                                                                        className="input-group-alternative"
                                                                        style={{
                                                                            marginLeft:
                                                                                '10px',
                                                                            marginBottom:
                                                                                '-10px',
                                                                        }}
                                                                    >
                                                                        <InputGroupAddon addonType="prepend">
                                                                            <InputGroupText>
                                                                                {/* <i className="ni ni-square-pin" /> */}
                                                                            </InputGroupText>
                                                                            <div className="rbt form-control">
                                                                                {`${nomeValue[0].bairro} - ${nomeValue[0].cidade} `}
                                                                            </div>
                                                                        </InputGroupAddon>
                                                                    </InputGroup>
                                                                </FormGroup>
                                                            </ContainerDate>
                                                        )}
                                                    </>
                                                )}
                                            </FormGroup>
                                            <ContainerDate>
                                                <FormGroup
                                                    style={{
                                                        marginRight: '10px',
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            require('../../assets/img/brand/LogoNova.png')
                                                                .default
                                                        }
                                                        height="135px"
                                                    />
                                                </FormGroup>

                                                <ContainerDate
                                                    style={{
                                                        marginTop: '10px',
                                                    }}
                                                >
                                                    <FormGroup>
                                                        <InputGroup className="input-group-alternative">
                                                            <Typeahead
                                                                emptyLabel="Sem Resultados"
                                                                labelKey="nome"
                                                                id="nome"
                                                                onChange={(e) =>
                                                                    selectAmbiente(
                                                                        e
                                                                    )
                                                                }
                                                                options={
                                                                    newAmbiente
                                                                }
                                                                placeholder="Selecione o Ambiente..."
                                                                selected={
                                                                    ambienteValue
                                                                }
                                                                /* clearButton */
                                                                className="rbt form-control"
                                                                inputProps={{
                                                                    style: {
                                                                        marginTop:
                                                                            '-10px',
                                                                        marginLeft:
                                                                            '-10px',
                                                                        textAlign:
                                                                            'center',
                                                                    },
                                                                }}
                                                            />
                                                        </InputGroup>
                                                    </FormGroup>
                                                </ContainerDate>
                                            </ContainerDate>

                                            <ContainerDate>
                                                <FormGroup
                                                    style={{
                                                        marginRight: '10px',
                                                    }}
                                                >
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="ni ni-calendar-grid-58" />
                                                            </InputGroupText>
                                                            <div className="rbt form-control">
                                                                {/* Dia: */}
                                                                {data}
                                                            </div>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                </FormGroup>
                                                <FormGroup
                                                    style={{
                                                        marginRight: '10px',
                                                    }}
                                                >
                                                    <InputGroup className="input-group-alternative">
                                                        <InputGroupAddon addonType="prepend">
                                                            <InputGroupText>
                                                                <i className="ni ni-calendar-grid-58 text-red" />
                                                            </InputGroupText>
                                                            <div className="rbt form-control">
                                                                {/* Vencimento: */}
                                                                {dataVen}
                                                            </div>
                                                        </InputGroupAddon>
                                                    </InputGroup>
                                                </FormGroup>
                                            </ContainerDate>
                                        </ContainerClient>
                                        <ContainerList>
                                            <ProductName
                                                style={{ color: '#fff' }}
                                            >
                                                Material
                                            </ProductName>
                                            <ProductPrice
                                                style={{ color: '#fff' }}
                                            >
                                                Marca
                                            </ProductPrice>
                                            <ProductQt
                                                style={{ color: '#fff' }}
                                            >
                                                Qt
                                            </ProductQt>
                                            <ProductPrice
                                                style={{ color: '#fff' }}
                                            >
                                                Valor
                                            </ProductPrice>
                                            <ProductPriceTotal
                                                style={{ color: '#fff' }}
                                            >
                                                Total
                                            </ProductPriceTotal>
                                        </ContainerList>

                                        {list.map((item, index) => (
                                            <>
                                                {item.opcional === false && (
                                                    <ContainerList
                                                        key={index}
                                                        style={{
                                                            background:
                                                                'transparent',
                                                        }}
                                                    >
                                                        <ProductName>
                                                            {item.value}
                                                        </ProductName>

                                                        <ProductPrice>
                                                            {item.marca ===
                                                            undefined
                                                                ? ''
                                                                : item.marca}
                                                        </ProductPrice>
                                                        <ProductQt>
                                                            {item.qta}
                                                        </ProductQt>
                                                        <ProductPrice>
                                                            {item.price ===
                                                            undefined
                                                                ? 0
                                                                : item.price}
                                                        </ProductPrice>
                                                        <ProductPriceTotal>
                                                            {item.price ===
                                                            undefined
                                                                ? 0
                                                                : item.price *
                                                                  item.qta}
                                                        </ProductPriceTotal>
                                                    </ContainerList>
                                                )}
                                            </>
                                        ))}
                                        <ContainerList>
                                            <i className="ni ni-fat-delete" />{' '}
                                            <i className="ni ni-fat-delete" />{' '}
                                            <i className="ni ni-fat-delete" />{' '}
                                            <i className="ni ni-fat-delete" />{' '}
                                            <i className="ni ni-fat-delete" />{' '}
                                            <i className="ni ni-fat-delete" />{' '}
                                            <i className="ni ni-fat-delete" />{' '}
                                        </ContainerList>
                                        {list.map((item, index) => (
                                            <>
                                                {item.opcional === true && (
                                                    <ContainerList
                                                        key={index}
                                                        style={{
                                                            background:
                                                                'transparent',
                                                        }}
                                                    >
                                                        <ProductName>
                                                            {item.value}
                                                        </ProductName>

                                                        <ProductPrice>
                                                            {item.marca ===
                                                            undefined
                                                                ? ''
                                                                : item.marca}
                                                        </ProductPrice>
                                                        <ProductQt>
                                                            {item.qta}
                                                        </ProductQt>
                                                        <ProductPrice>
                                                            {item.price ===
                                                            undefined
                                                                ? 0
                                                                : item.price}
                                                        </ProductPrice>
                                                        <ProductPriceTotal>
                                                            {item.price ===
                                                            undefined
                                                                ? 0
                                                                : item.price *
                                                                  item.qta}
                                                        </ProductPriceTotal>
                                                    </ContainerList>
                                                )}
                                            </>
                                        ))}
                                        <ContainerFinal>
                                            <ContainerAddItem
                                                onClick={addLinha}
                                            >
                                                <InputGroupAddon addonType="prepend"></InputGroupAddon>
                                            </ContainerAddItem>

                                            <ContainerTotal>
                                                <ContainerRow>
                                                    <Total
                                                        style={{ color: 'red' }}
                                                    >
                                                        Opcional:
                                                        <TotalResult>
                                                            {precoOpciona.toLocaleString(
                                                                'pt-br',
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </TotalResult>
                                                    </Total>
                                                    <Total
                                                        style={{ color: 'red' }}
                                                    >
                                                        Marcenaria:
                                                        <TotalResult>
                                                            {precoMarcenaria.toLocaleString(
                                                                'pt-br',
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </TotalResult>
                                                    </Total>
                                                </ContainerRow>
                                            </ContainerTotal>
                                            <ContainerTotal
                                                style={{ alignItems: 'center' }}
                                            >
                                                <ContainerRow>
                                                    <Total>
                                                        Total:
                                                        <TotalResult>
                                                            {(
                                                                precoOpciona +
                                                                precoMarcenaria
                                                            ).toLocaleString(
                                                                'pt-br',
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </TotalResult>
                                                    </Total>
                                                </ContainerRow>
                                            </ContainerTotal>
                                        </ContainerFinal>
                                    </Body>
                                </Card>
                            </div>
                        </Row>
                    </Container>
                </>
            )}
        </>
    );
};
export default EditOrcamentos;
