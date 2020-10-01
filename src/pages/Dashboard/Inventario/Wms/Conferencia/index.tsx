import React, {
  useCallback,
  useEffect,
  useState,
  ChangeEvent,
  useRef,
} from 'react';
import { FiSearch, FiCalendar } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import ReactLoading from 'react-loading';
import * as Yup from 'yup';
import api from '../../../../../services/api';
import getValidationErrors from '../../../../../utils/getValidationErros';
import formataValidade from '../../../../../utils/formataData';

import Dialog from '../../../../../components/Dialog';
import Input from '../../../../../components/Input';
import { createMessage } from '../../../../../components/Toast';
import NavBar from '../../../../../components/NavBar';

import { Container, Content } from './style';

interface Props {
  enderecoOrig: [
    {
      codendereco: number;
      inventos: number;
      tipoender: string;
      numinvent: number;
      status: string;
      codprod: number;
      qtunitcx: number;
      descricao: string;
      qt: number;
      contagem: number;
      deposito: number;
      rua: number;
      predio: number;
      nivel: number;
      apto: number;
    },
  ];
  endereco: {
    codendereco: number;
    status: string;
    contagem: number;
    tipoender: string;
    codprod: number;
    ean: number;
    dun: number;
    qtunitcx: number;
    descricao: string;
    numinvent: number;
    inventos: number;
  };
}

interface OsInventario {
  codendereco: number;
  inventos: number;
  tipoender: string;
  numinvent: number;
  status: string;
  codprod: number;
  ean: number;
  dun: number;
  qtunitcx: number;
  descricao: string;
  qt: number;
  contagem: number;
  deposito: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
}

interface EndAtualProps {
  codendereco: number;
  status: string;
  contagem: number;
  tipoender: string;
  codprod: number;
  ean: number;
  dun: number;
  qtunitcx: number;
  descricao: string;
  numinvent: number;
  inventos: number;
}

interface ProdutoInventario {
  codprod: number;
  descricao: string;
  qtunitcx: number;
  erro?: string;
  warning?: string;
}

interface SubmitForm {
  numinvent: number;
  inventos: number;
  codendereco: number;
  matdig: number;
  status: string;
  codprod: number;
  qtunitcx: number;
  contagem: number;
  lastro: number;
  camada: number;
  qtcx: number;
  qtun: number;
  total: number;
  datavalidade: string;
  alteravalidade: boolean;
}

const ConferenciaWms: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const endAtual = history.location.state as Props;
  const formRefProd = useRef<FormHandles>(null);
  const formRef = useRef<FormHandles>(null);
  const [mostrarDescricao, setMostrarDescricao] = useState(false);
  const [endereco, setEndereco] = useState({} as EndAtualProps);
  const [produto, setProduto] = useState(0);

  const [lastro, setLastro] = useState(0);
  const [camada, setCamada] = useState(0);
  const [cx, setCx] = useState(0);
  const [un, setUn] = useState(0);
  const [total, setTotal] = useState(0);

  const [date, setDate] = useState('');

  const [loading, setLoanding] = useState(false);
  const [buscaProduto, setBuscaProduto] = useState(false);
  const [trocouProduto, setTrocouProduto] = useState(false);

  useEffect(() => {
    setEndereco(endAtual.endereco);
    document.getElementById('produto')?.focus();
  }, [endAtual]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setProduto(Number(event.target.value));
    },
    [],
  );

  const zerarAereo = useCallback(() => {
    const codprod = 0;
    setTotal(0);
    setEndereco({
      ...endereco,
      codprod,
      descricao: '',
      qtunitcx: 0,
    });
    setMostrarDescricao(true);
    document.getElementById('button')?.focus();
  }, [endereco]);

  const zerarPicking = useCallback(() => {
    setTotal(0);
    setMostrarDescricao(true);
    document.getElementById('button')?.focus();
  }, []);

  const trocaProdutoAereo = useCallback(async () => {
    setLoanding(true);
    const response = await api.get<ProdutoInventario>(
      `Inventario/getProdutoInventario/${produto}/${user.filial}`,
    );

    const { erro, warning } = response.data;

    if (warning === 'N' && erro === 'N') {
      setTrocouProduto(true);
      const { codprod, descricao, qtunitcx } = response.data;

      setEndereco({ ...endereco, codprod, descricao, qtunitcx });
      setMostrarDescricao(true);
      setLoanding(false);
      document.getElementById('lastro')?.focus();
    } else {
      createMessage({
        type: 'error',
        message: 'Produto informado não foi encontrado.',
      });
      setLoanding(false);
      document.getElementById('produto')?.focus();
    }
  }, [endereco, produto, user.filial]);

  const chamaBuscaProduto = useCallback(
    (retorno: boolean, tipoEndereco: string, trocarProduto: boolean) => {
      if (retorno) {
        if (tipoEndereco === 'AE' && !trocarProduto) {
          setBuscaProduto(false);
          zerarAereo();
        } else if (tipoEndereco === 'AP' && !trocarProduto) {
          setBuscaProduto(false);
          zerarPicking();
        } else {
          setBuscaProduto(false);
          trocaProdutoAereo();
        }
      } else {
        setBuscaProduto(false);
        createMessage({
          type: 'info',
          message: 'Operação abortada pelo usuário.',
        });
        formRefProd.current?.setFieldValue('produto', null);
        document.getElementById('produto')?.focus();
      }
    },
    [zerarAereo, zerarPicking, trocaProdutoAereo],
  );

  const handleGetProduct = useCallback(
    async (data: object) => {
      try {
        formRefProd.current?.setErrors({});

        const schema = Yup.object().shape({
          produto: Yup.string().required('Código obrigatório.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (produto === 0 && endereco.tipoender === 'AP') {
          // mater os dados do endereço e zerar a quantidade
          setBuscaProduto(true);
        } else if (produto === 0 && endereco.tipoender === 'AE') {
          // tiro o produto atual e coloco 0 e zero a quantidade
          setBuscaProduto(true);
        } else if (
          (endereco.codprod === produto && endereco.tipoender === 'AP') ||
          (endereco.ean === produto && endereco.tipoender === 'AP') ||
          (endereco.dun === produto && endereco.tipoender === 'AP') ||
          endereco.tipoender === 'AE'
        ) {
          if (
            endereco.codprod === produto ||
            endereco.ean === produto ||
            endereco.dun === produto
          ) {
            setMostrarDescricao(true);
            document.getElementById('lastro')?.focus();
          } else {
            setBuscaProduto(true);
          }
        } else {
          createMessage({
            type: 'error',
            message: 'Endereço de picking. Não foi possível alterar o produto.',
          });
          formRefProd.current?.setFieldValue('produto', null);
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRefProd.current?.setErrors(errors);

          setLoanding(false);
          return;
        }

        createMessage({
          type: 'error',
          message: 'Erro na busca do produto.',
        });

        formRefProd.current?.setFieldValue('produto', null);
        setLoanding(false);
      }
    },
    [endereco, produto],
  );

  const focusCampo = useCallback(
    (event) => {
      if (event.target.id === 'lastro' && event.key === 'Enter') {
        document.getElementById('camada')?.focus();
      }
      if (trocouProduto) {
        if (event.target.id === 'camada' && event.key === 'Enter') {
          document.getElementById('dtvalidade')?.focus();
        }
        if (event.target.id === 'dtvalidade' && event.key === 'Enter') {
          document.getElementById('qtcx')?.focus();
        }
      } else if (!trocouProduto) {
        if (event.target.id === 'camada' && event.key === 'Enter') {
          document.getElementById('qtcx')?.focus();
        }
      }
      if (event.target.id === 'qtcx' && event.key === 'Enter') {
        document.getElementById('qtun')?.focus();
      }
      if (event.target.id === 'qtun' && event.key === 'Enter') {
        document.getElementById('total')?.focus();
      }
      if (event.target.id === 'total' && event.key === 'Enter') {
        document.getElementById('enviar')?.focus();
      }
    },
    [trocouProduto],
  );

  const handleCalcTotal = useCallback(() => {
    setTotal(
      lastro * camada * endereco.qtunitcx +
        (Number(un) + Number(cx) * endereco.qtunitcx),
    );
  }, [endereco.qtunitcx, lastro, camada, cx, un]);

  const handleSubmitForm = useCallback(
    async (data: SubmitForm) => {
      if (window.document.activeElement?.tagName === 'BUTTON') {
        if (!trocouProduto || (trocouProduto && date)) {
          setLoanding(true);

          if (
            (endereco.tipoender === 'AP' || endereco.tipoender === 'AE') &&
            produto !== 0 &&
            total === 0
          ) {
            createMessage({
              type: 'error',
              message: 'Não é possível salvar o item sem quantidade.',
            });
            setLoanding(false);
            document.getElementById('lastro')?.focus();
          } else {
            const dataVal = `${date}T00:00:00`;
            const dataFormatada = formataValidade(dataVal);

            const {
              numinvent,
              inventos,
              codendereco,
              codprod,
              contagem,
              qtunitcx,
            } = endereco;

            data.codendereco = codendereco;
            data.status = endereco.status;
            data.matdig = user.code;
            data.inventos = inventos;
            data.numinvent = numinvent;
            data.codprod = codprod;
            data.contagem = contagem;
            data.qtunitcx = qtunitcx;
            if (trocouProduto) {
              data.datavalidade = dataFormatada;
              data.alteravalidade = true;
            }

            try {
              const salvou = await api.post(
                'Inventario/gravaProdutoInventario',
                data,
              );

              if (salvou.data) {
                const excludeEndereco = endAtual.enderecoOrig.findIndex(
                  (end) => end.codendereco === endereco.codendereco,
                );

                if (excludeEndereco >= 0) {
                  const filteredEndereco = endAtual.enderecoOrig.filter(
                    (end) => end.codendereco !== endereco.codendereco,
                  );

                  if (filteredEndereco.length > 0) {
                    history.push('endereco-inventario', filteredEndereco);
                  } else {
                    const response = await api.get<OsInventario[]>(
                      `Inventario/getProxOs/${user.code}/${endereco.codendereco}/${endereco.contagem}`,
                    );

                    const encontrouEndereco = response.data;

                    if (encontrouEndereco !== null) {
                      history.push('endereco-inventario', encontrouEndereco);
                    } else {
                      history.push('/inventario');
                    }
                  }
                }
              } else {
                createMessage({
                  type: 'error',
                  message: 'Erro ao salvar conferência. Tente novamente.',
                });
                setLoanding(false);
              }
            } catch (err) {
              if (err.message === 'Network Error') {
                createMessage({
                  type: 'error',
                  message: 'Erro de internet ao salvar a conferência.',
                });
                setLoanding(false);
                return;
              }

              createMessage({
                type: 'error',
                message: `Erro: ${err.message}`,
              });
              setLoanding(false);
            }
          }
        } else {
          createMessage({
            type: 'alert',
            message: `Data de validade obrigatória na troca de produto no endereço.`,
          });

          document.getElementById('dtvalidade')?.focus();
        }
      }
    },
    [
      history,
      produto,
      total,
      user.code,
      endereco,
      endAtual.enderecoOrig,
      trocouProduto,
      date,
    ],
  );

  return (
    <>
      <NavBar
        numInvent={endereco?.numinvent}
        caminho="/inventario/endereco-inventario"
        params={endAtual.enderecoOrig}
      />
      <Container>
        {!loading ? (
          <>
            <Form ref={formRefProd} onSubmit={handleGetProduct}>
              <Input
                icon={FiSearch}
                type="number"
                id="produto"
                name="produto"
                description="EAN/DUN/CODPROD"
                onChange={handleInputChange}
              />
            </Form>
            {buscaProduto ? (
              <>
                {endereco.tipoender === 'AE' ? (
                  <>
                    {produto !== 0 ? (
                      <Dialog
                        title="ATENÇÃO!!!"
                        message="Você está prestes a trocar o produto do endereço. Confirma a operação?"
                        tipoEndereco="AE"
                        trocarProduto
                        executar={chamaBuscaProduto}
                      />
                    ) : (
                      <Dialog
                        title="ATENÇÃO!!!"
                        message="Você está prestes a zerar o endereço. Confirma a operação?"
                        tipoEndereco="AE"
                        executar={chamaBuscaProduto}
                      />
                    )}
                  </>
                ) : (
                  <Dialog
                    title="ATENÇÃO!!!"
                    message="Você está prestes a zerar o endereço. Confirma a operação?"
                    tipoEndereco="AP"
                    executar={chamaBuscaProduto}
                  />
                )}
              </>
            ) : (
              <Form ref={formRef} onSubmit={handleSubmitForm}>
                {!mostrarDescricao ? (
                  <textarea
                    name="descricao"
                    rows={3}
                    placeholder="DESCRIÇÃO/EMBALAGEM"
                    disabled
                  />
                ) : (
                  <textarea
                    id="descricao"
                    name="descricao"
                    rows={3}
                    value={endereco.descricao}
                    disabled
                  />
                )}
                <Content>
                  {!mostrarDescricao ? (
                    <Input
                      percWidth={31}
                      name="qtunitcx"
                      type="number"
                      description="Qt.Unit.Cx"
                      disabled
                    />
                  ) : (
                    <Input
                      percWidth={31}
                      name="qtunitcx"
                      type="number"
                      defaultValue={endereco.qtunitcx}
                      description="Qt.Unit.Cx"
                      disabled
                    />
                  )}
                  <p />
                  <Input
                    percWidth={31}
                    id="lastro"
                    name="lastro"
                    type="number"
                    description="Lastro"
                    onChange={(e) => setLastro(Number(e.target.value))}
                    onKeyPress={(e) => focusCampo(e)}
                    onKeyUp={handleCalcTotal}
                  />
                  <p>X</p>
                  <Input
                    percWidth={31}
                    id="camada"
                    name="camada"
                    type="number"
                    description="Camada"
                    onChange={(e) => setCamada(Number(e.target.value))}
                    onKeyPress={(e) => focusCampo(e)}
                    onKeyUp={handleCalcTotal}
                  />
                  {trocouProduto ? (
                    <Input
                      icon={FiCalendar}
                      id="dtvalidade"
                      name="dtvalidade"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      description="Data de validade"
                    />
                  ) : (
                    <Input
                      icon={FiCalendar}
                      id="dtvalidade"
                      name="dtvalidade"
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      description="Data de validade"
                      disabled
                    />
                  )}
                  <Content>
                    <Input
                      percWidth={30}
                      id="qtcx"
                      name="qtcx"
                      type="number"
                      description="Qt.Cx"
                      onChange={(e) => setCx(Number(e.target.value))}
                      onKeyPress={(e) => focusCampo(e)}
                      onKeyUp={handleCalcTotal}
                    />
                    <p>+</p>
                    <Input
                      percWidth={30}
                      id="qtun"
                      name="qtun"
                      type="number"
                      description="Qt.Un"
                      onChange={(e) => setUn(Number(e.target.value))}
                      onKeyPress={(e) => focusCampo(e)}
                      onKeyUp={handleCalcTotal}
                    />
                    <p>=</p>
                    <Input
                      percWidth={29.8}
                      id="total"
                      name="total"
                      type="number"
                      description="Total"
                      value={total}
                      onKeyPress={(e) => focusCampo(e)}
                      readOnly
                    />
                  </Content>
                  {!mostrarDescricao ? (
                    <button id="button" type="submit" disabled>
                      CONFIRMAR
                    </button>
                  ) : (
                    <button id="enviar" type="submit">
                      CONFIRMAR
                    </button>
                  )}
                </Content>
              </Form>
            )}
          </>
        ) : (
          <ReactLoading
            className="loading"
            type="spokes"
            width="100px"
            color="#c22e2c"
          />
        )}
      </Container>
    </>
  );
};

export default ConferenciaWms;
