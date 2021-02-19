import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FiSearch, FiCalendar } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import ReactLoading from 'react-loading';
import * as Yup from 'yup';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import api from '../../../../../services/api';
import apiRelatorios from '../../../../../services/relatorios';

import { createMessage } from '../../../../../components/Toast';
import { useAuth } from '../../../../../hooks/auth';
import getValidationErrors from '../../../../../utils/getValidationErros';
import validaSenhaBonus from '../../../../../utils/validaSenhaListagem';
import formataData from '../../../../../utils/formataData';
import Dialog from '../../../../../components/Dialog';
import NavBar from '../../../../../components/NavBar';
import Input from '../../../../../components/Input';

import {
  Container,
  Content,
  Button,
  Loading,
  ContainerConf,
  ContentConf,
} from './styles';

interface ConfirmadoEnderecado {
  status?: string;
  codprod: number;
  descricao: string;
  qt: number;
  qtavaria: number;
  dtvalidade: string;
}

interface ProdutoConf {
  codprod: number;
  descricao: string;
  qtunit: number;
  qtunitcx: number;
  lastro: number;
  camada: number;
  norma: number;
  resto: number;
  qtresto: number;
  diasvalidade: number;
  shelflife: number;
  codauxiliar: number;
  qtnf: number;
  fechado: string;
}

interface DTOConferencia {
  numbonus: number;
  codprod: number;
  qtconf: number;
  qtavaria: number;
  dtvalidade: string;
  codfuncconf: number;
  codauxiliar: number;
  qtnf: number;
}

const ConferenciaBonus: React.FC = () => {
  const { usuario } = useAuth();
  const history = useHistory();
  const numbonus = history.location.state as number;
  const [confirmado, setConfirmado] = useState<ConfirmadoEnderecado[]>([]);
  const [enderecado, setEnderecado] = useState<ConfirmadoEnderecado[]>([]);
  const [produtoConf, setProdutoConf] = useState<ProdutoConf>(
    {} as ProdutoConf,
  );
  const formRefProd = useRef<FormHandles>(null);
  const formRef = useRef<FormHandles>(null);
  const [dtValidade, setDtValidade] = useState('');
  const [qtAvaria, setQtAvaria] = useState(0);
  const [lastro, setLastro] = useState(0);
  const [camada, setCamada] = useState(0);
  const [cx, setCx] = useState(0);
  const [un, setUn] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [mostrarDialogEnderecar, setMostrarDialogEnderecar] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get<ConfirmadoEnderecado[]>(
        `Entrada/BonusConfirmadoEnderecado/${numbonus}/C`,
      )
      .then((response) => {
        const listaConfirmados = response.data;

        listaConfirmados.map((conf) => {
          const dataFormatada = formataData(conf.dtvalidade);

          conf.dtvalidade = dataFormatada;
          return conf;
        });

        setConfirmado(listaConfirmados);
        setLoading(false);
        document.getElementById('produto')?.focus();
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: err,
        });
      });

    api
      .get<ConfirmadoEnderecado[]>(
        `Entrada/BonusConfirmadoEnderecado/${numbonus}/E`,
      )
      .then((response) => {
        const listaEnderecados = response.data;

        listaEnderecados.map((end) => {
          const dataFormatada = formataData(end.dtvalidade);

          end.dtvalidade = dataFormatada;
          return end;
        });

        setEnderecado(listaEnderecados);
        setLoading(false);
        document.getElementById('produto')?.focus();
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: err,
        });
      });
  }, [numbonus]);

  const atualizaConfEnd = useCallback(async () => {
    api
      .get<ConfirmadoEnderecado[]>(
        `Entrada/BonusConfirmadoEnderecado/${numbonus}/C`,
      )
      .then((response) => {
        const listaConfirmados = response.data;

        listaConfirmados.map((conf) => {
          const dataFormatada = formataData(conf.dtvalidade);

          conf.dtvalidade = dataFormatada;
          return conf;
        });

        setConfirmado(listaConfirmados);
        setLoading(false);
        document.getElementById('produto')?.focus();
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: err,
        });
      });

    api
      .get<ConfirmadoEnderecado[]>(
        `Entrada/BonusConfirmadoEnderecado/${numbonus}/E`,
      )
      .then((response) => {
        const listaEnderecados = response.data;

        listaEnderecados.map((end) => {
          const dataFormatada = formataData(end.dtvalidade);

          end.dtvalidade = dataFormatada;
          return end;
        });

        setEnderecado(listaEnderecados);
        setLoading(false);
        document.getElementById('produto')?.focus();
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: err,
        });
      });
  }, [numbonus]);

  const limparTelaConf = useCallback(() => {
    setProdutoConf({} as ProdutoConf);
    formRef.current?.reset();
    formRefProd.current?.reset();
    setLastro(0);
    setCamada(0);
    setUn(0);
    setCx(0);
    setTotal(0);
    setDtValidade('');
  }, []);

  const statusConferencia = useCallback((rowData: ConfirmadoEnderecado) => {
    let cor = '';
    let fonte = '';

    if (rowData.status === 'CONCLUIDO') {
      cor = '#C8E6C9';
    } else if (rowData.status === 'PENDENTE') {
      cor = '#FEEDAF';
    } else if (rowData.status === 'NÃO INICIADA') {
      cor = '#FFCDD2';
      fonte = '#fff';
    }

    return (
      <span
        style={{
          padding: '5px 5px',
          borderRadius: '6px',
          fontSize: '10px',
          color: fonte,
          fontWeight: 'bold',
          backgroundColor: cor,
        }}
      >
        {rowData.status}
      </span>
    );
  }, []);

  const buscaProdutoBonus = useCallback(
    async (data) => {
      try {
        formRefProd.current?.setErrors({});

        const schema = Yup.object().shape({
          produto: Yup.string().required('Código obrigatório.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);

        const response = await api.get<ProdutoConf[]>(
          `Entrada/BuscaProdutoBonus/${numbonus}/${data.produto}`,
        );

        const achouProduto = response.data[0];

        if (achouProduto) {
          if (achouProduto.fechado === 'N') {
            setProdutoConf(achouProduto);
            setLoading(false);
            document.getElementById('lastro')?.focus();
          } else {
            createMessage({
              type: 'alert',
              message: `Bônus: ${numbonus} endereçado e finalizado.`,
            });

            setLoading(false);
            document.getElementById('produto')?.focus();
          }
        } else {
          createMessage({
            type: 'alert',
            message: `Nenhum produto foi encontrado com o código: ${data.produto} no bônus: ${numbonus}.`,
          });

          setLoading(false);
          document.getElementById('produto')?.focus();
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRefProd.current?.setErrors(errors);
          return;
        }

        createMessage({
          type: 'error',
          message: `Erro: ${err.message}`,
        });

        setLoading(false);
        document.getElementById('produto')?.focus();
      }
    },
    [numbonus],
  );

  const enviaUmaImpressora = useCallback(
    (dados: [{ codigo: number }]): void => {
      const paramsImpressao = {
        app: 'EPCWMS',
        tipousu: 'U',
        matricula: usuario.code,
        tamanho: 'G',
        nrorel: 9044,
        pCodUma: 0,
      };

      dados.map((codUma) => {
        paramsImpressao.pCodUma = Number(codUma);

        // Envia U.M.A direto na impressora padrão da API
        apiRelatorios
          .get('servdw/REL/relatorio', { params: paramsImpressao })
          .then(async (responseBase64) => {
            const parametrosImpressao = {
              base64: responseBase64.data,
              codUma: Number(codUma),
            };

            await api
              .put('Entrada/ChamaImpressao/', parametrosImpressao)
              .catch((err) => {
                createMessage({
                  type: 'error',
                  message: `Error: ${err.response.data}`,
                });
              });
          })
          .catch((err) => {
            if (
              err.response.data ===
              `Access violation at address 0000000000B6B802 in module 'RDWService.exe'. Read of address 0000000000000019`
            ) {
              createMessage({
                type: 'error',
                message: 'Nenhum registro encontrado para impressão.',
              });
            } else {
              createMessage({
                type: 'error',
                message: `Error Impressão da U.M.A: ${err.response.data}`,
              });
            }
          });
        return codUma;
      });
    },
    [usuario.code],
  );

  const enderecaConfirmados = useCallback(
    async (retorno: boolean) => {
      if (retorno) {
        setMostrarDialogEnderecar(false);
        setLoading(true);

        try {
          const response = await api.put<string>(
            `Entrada/EnderecaBonus/${numbonus}/${usuario.filial}/${usuario.code}`,
          );

          const enderecou = response.data;

          if (enderecou === 'Endeçamento realizado com Sucesso!') {
            const responseUma = await api.get<[{ codigo: number }]>(
              `Entrada/BuscaDadosImpressao/${numbonus}`,
            );

            const achouDados = responseUma.data;

            if (achouDados.length > 0) {
              enviaUmaImpressora(achouDados);

              createMessage({
                type: 'success',
                message: enderecou,
              });
            }

            limparTelaConf();
            await atualizaConfEnd();

            setLoading(false);
          } else {
            createMessage({
              type: 'alert',
              message: enderecou,
            });

            limparTelaConf();
            await atualizaConfEnd();
            setLoading(false);
          }
        } catch (err) {
          createMessage({
            type: 'error',
            message: `Erro Endereça Bônus: ${err.message}`,
          });

          limparTelaConf();
          await atualizaConfEnd();
          setLoading(false);
        }
      } else {
        createMessage({
          type: 'info',
          message: 'Operação abortada pelo usuário.',
        });

        setMostrarDialogEnderecar(false);
      }
    },
    [usuario, numbonus, atualizaConfEnd, limparTelaConf, enviaUmaImpressora],
  );

  const calcTotal = useCallback(() => {
    setTotal(
      lastro * camada * produtoConf.qtunitcx +
        (Number(un) + Number(cx) * produtoConf.qtunitcx),
    );
  }, [lastro, camada, produtoConf, un, cx]);

  // COMENTADO SOLIC. ADILES (AJUSTANDO O CADADSTRO)
  // const validaValidade = useCallback(
  //   (dataValidade: string): boolean => {
  //     // Calculo do shelflife do produto em dias
  //     const validadeInformada = new Date(dataValidade);
  //     const dataRecebimento = new Date();
  //     const diasAceitaValidade =
  //       produtoConf.diasvalidade * (produtoConf.shelflife / 100);

  //     const diferenca = Math.abs(
  //       dataRecebimento.getTime() - validadeInformada.getTime(),
  //     ); // Subtrai uma data pela outra

  //     const diasDiferenca = Math.ceil(diferenca / (1000 * 60 * 60 * 24)); // Divide o total pelo total de milisegundos correspondentes a 1 dia. (1000 milisegundos = 1 segundo).

  //     if (
  //       diasDiferenca >= diasAceitaValidade &&
  //       diasDiferenca <= produtoConf.diasvalidade
  //     ) {
  //       return true;
  //     }

  //     return false;
  //   },
  //   [produtoConf],
  // );

  const gravarConferencia = useCallback(
    async (data) => {
      if (window.document.activeElement?.tagName === 'BUTTON') {
        try {
          formRefProd.current?.setErrors({});

          let schema;

          if (lastro > 0 || camada > 0) {
            schema = Yup.object().shape({
              lastro: Yup.string().required('Lastro obrigatório. '),
              camada: Yup.string().required('Camada obrigatória. '),
              dtvalidade: Yup.string().required(
                'Data de validade obrigatória. ',
              ),
            });
          } else {
            schema = Yup.object().shape({
              dtvalidade: Yup.string().required(
                'Data de validade obrigatória. ',
              ),
            });
          }

          await schema.validate(data, {
            abortEarly: false,
          });

          if (
            ((lastro > 0 || camada > 0) &&
              total / produtoConf.qtunitcx <= produtoConf.norma) ||
            (total !== 0 &&
              total < produtoConf.norma * produtoConf.qtunitcx &&
              total === produtoConf.qtresto)
          ) {
            const dataVal = `${dtValidade}T00:00:00`;

            const validaDataValidade = true; // validaValidade(dataVal); COMENTADO SOLIC. ADILES (AJUSTANDO O CADADSTRO)

            if (validaDataValidade) {
              setLoading(true);

              const dataFormatada = formataData(dataVal);

              const dadosConf = {
                numbonus,
                codprod: produtoConf.codprod,
                qtconf: total,
                qtavaria: qtAvaria,
                codfuncconf: usuario.code,
                dtvalidade: dataFormatada,
                codauxiliar: produtoConf.codauxiliar,
                qtnf: produtoConf.qtnf,
              } as DTOConferencia;

              const response = await api.post(
                'Entrada/ConfereProdutoBonus',
                dadosConf,
              );

              const salvou = response.data;

              if (salvou) {
                limparTelaConf();
                await enderecaConfirmados(true);
                await atualizaConfEnd();
                setLoading(false);
                document.getElementById('produto')?.focus();
              } else {
                createMessage({
                  type: 'error',
                  message:
                    'Não foi possível salvar o registro. Tente novamente mais tarde.',
                });

                if (lastro > 0 && camada > 0) {
                  formRef.current?.setFieldValue('lastro', produtoConf.lastro);
                  formRef.current?.setFieldValue('camada', produtoConf.camada);
                }
                setLoading(false);
              }
            } else {
              setMostrarDialog(true);
            }
          } else if (total < produtoConf.norma * produtoConf.qtunitcx) {
            if (produtoConf.resto === 0) {
              createMessage({
                type: 'alert',
                message: 'Produto sem resto. Favor conferir pela norma palete.',
              });
              setTotal(0);
              document.getElementById('lastro')?.focus();
              return;
            }

            createMessage({
              type: 'alert',
              message: `Quantidade total: ${total} não bate com o resto do produto.`,
            });
            setTotal(0);
            document.getElementById('qtun')?.focus();
          } else {
            if (total === produtoConf.norma) {
              createMessage({
                type: 'alert',
                message:
                  'Quantidade total igual a norma do produto. Favor conferir pelo lastro e camada.',
              });
            } else {
              createMessage({
                type: 'alert',
                message:
                  'Lastro/Camada informado não confere com o cadastro do produto.',
              });
            }

            setTotal(0);
            setUn(0);
            formRef.current?.setFieldValue('qtun', null);
            setCx(0);
            formRef.current?.setFieldValue('qtcx', null);

            if (lastro > 0 && camada > 0) {
              setLastro(0);
              formRef.current?.setFieldValue('lastro', null);
              setCamada(0);
              formRef.current?.setFieldValue('camada', null);
            }
            document.getElementById('lastro')?.focus();
          }
        } catch (err) {
          if (err instanceof Yup.ValidationError) {
            const errors = getValidationErrors(err);
            let mensagemErro = '';

            if (errors.dtvalidade) {
              mensagemErro += errors.dtvalidade;
            }
            if (errors.lastro) {
              mensagemErro += errors.lastro;
            }
            if (errors.camada) {
              mensagemErro += errors.camada;
            }

            createMessage({
              type: 'error',
              message: `Erro(s) encontrado(s): ${mensagemErro}`,
            });

            return;
          }

          createMessage({
            type: 'error',
            message: `Erro Geral - Gravar conferência: ${err.message}`,
          });

          if (lastro > 0 && camada > 0) {
            formRef.current?.setFieldValue('lastro', produtoConf.lastro);
            formRef.current?.setFieldValue('camada', produtoConf.camada);
          }
          setLoading(false);
        }
      }
    },
    [
      total,
      dtValidade,
      produtoConf,
      limparTelaConf,
      usuario.code,
      numbonus,
      qtAvaria,
      camada,
      lastro,
      atualizaConfEnd,
      enderecaConfirmados,
    ],
  );

  const focusCampo = useCallback((event) => {
    if (event.target.id === 'lastro' && event.key === 'Enter') {
      document.getElementById('camada')?.focus();
    }
    if (event.target.id === 'camada' && event.key === 'Enter') {
      document.getElementById('qtcx')?.focus();
    }
    if (event.target.id === 'qtcx' && event.key === 'Enter') {
      document.getElementById('qtun')?.focus();
    }
    if (event.target.id === 'qtun' && event.key === 'Enter') {
      document.getElementById('total')?.focus();
    }
    if (event.target.id === 'total' && event.key === 'Enter') {
      document.getElementById('dtvalidade')?.focus();
    }
    if (event.target.id === 'dtvalidade' && event.key === 'Enter') {
      document.getElementById('gravar')?.focus();
    }
  }, []);

  const telaExtratoBonus = useCallback(() => {
    history.push('/entrada/extrato-bonus', numbonus);
  }, [numbonus, history]);

  const permiteValidade = useCallback(
    async (retorno: boolean, x, y, senha: string) => {
      const validaSenha = validaSenhaBonus(numbonus);

      if (retorno) {
        if (senha === String(validaSenha)) {
          setMostrarDialog(false);
          try {
            setLoading(true);

            const dataVal = `${dtValidade}T00:00:00`;

            const dataFormatada = formataData(dataVal);

            const dadosConf = {
              numbonus,
              codprod: produtoConf.codprod,
              qtconf: total,
              qtavaria: qtAvaria,
              codfuncconf: usuario.code,
              dtvalidade: dataFormatada,
              codauxiliar: produtoConf.codauxiliar,
              qtnf: produtoConf.qtnf,
            } as DTOConferencia;

            const response = await api.post(
              'Entrada/ConfereProdutoBonus',
              dadosConf,
            );

            const salvou = response.data;

            if (salvou) {
              if (total / produtoConf.qtunitcx === produtoConf.norma) {
                await enderecaConfirmados(true);
              }
              limparTelaConf();
              await atualizaConfEnd();
              setLoading(false);
              document.getElementById('produto')?.focus();
            } else {
              createMessage({
                type: 'error',
                message:
                  'Não foi possível salvar o registro. Tente novamente mais tarde.',
              });

              if (lastro > 0 && camada > 0) {
                formRef.current?.setFieldValue('lastro', produtoConf.lastro);
                formRef.current?.setFieldValue('camada', produtoConf.camada);
              }
              setLoading(false);
            }
          } catch (err) {
            createMessage({
              type: 'error',
              message: `Erro: ${err.message}`,
            });

            limparTelaConf();
            setLoading(false);
            document.getElementById('produto')?.focus();
          }
        } else {
          createMessage({
            type: 'error',
            message: 'Senha inválida, por favor tente novamente.',
          });

          if (lastro > 0 && camada > 0) {
            formRef.current?.setFieldValue('lastro', produtoConf.lastro);
            formRef.current?.setFieldValue('camada', produtoConf.camada);
          }
          setMostrarDialog(false);
        }
      } else {
        createMessage({
          type: 'info',
          message: 'Operação abortada pelo usuário.',
        });

        if (lastro > 0 && camada > 0) {
          formRef.current?.setFieldValue('lastro', produtoConf.lastro);
          formRef.current?.setFieldValue('camada', produtoConf.camada);
        }
        setMostrarDialog(false);
      }
    },
    [
      numbonus,
      dtValidade,
      limparTelaConf,
      qtAvaria,
      produtoConf,
      total,
      camada,
      lastro,
      usuario.code,
      atualizaConfEnd,
      enderecaConfirmados,
    ],
  );

  return (
    <>
      <NavBar caminho="/entrada" numBonus={numbonus} />

      <Container>
        {!loading ? (
          <>
            <input id="tab3" type="radio" name="pct" checked />
            <input id="tab2" type="radio" name="pct" checked />
            <input id="tab1" type="radio" name="pct" checked />
            <nav>
              <ul>
                <li className="tab1">
                  <button id="tab1" type="button">
                <label htmlFor="tab1">Conferência</label> {/*eslint-disable-line*/}
                  </button>
                </li>
                <li className="tab2">
                  <button id="tab2" type="button">
                 <label htmlFor="tab2">Confirmados</label> {/*eslint-disable-line*/}
                  </button>
                </li>
                <li className="tab3">
                  <button id="tab3" type="button">
                <label htmlFor="tab3">Endereçados</label> {/*eslint-disable-line*/}
                  </button>
                </li>
              </ul>
            </nav>
            <section>
              <div className="tab1">
                <ContainerConf>
                  {mostrarDialog ? (
                    <Dialog
                      title={`Bônus: ${numbonus}. Data abaixo do ShelLife do produto: ${produtoConf.codprod}.`}
                      message="Para realizar essa operação, entre com a senha de liberação:"
                      mostraInput
                      executar={permiteValidade}
                    />
                  ) : (
                    <> </>
                  )}
                  {mostrarDialogEnderecar ? (
                    <Dialog
                      title={`Endereçamento do Bônus: ${numbonus}.`}
                      message="Deseja realmente endereçar o bônus?"
                      executar={enderecaConfirmados}
                    />
                  ) : (
                    <> </>
                  )}
                  <Form ref={formRefProd} onSubmit={buscaProdutoBonus}>
                    <Input
                      icon={FiSearch}
                      type="number"
                      id="produto"
                      name="produto"
                      defaultValue={produtoConf.codprod}
                      description="EAN/DUN/CODPROD"
                    />
                  </Form>
                  <ContentConf>
                    <Form ref={formRef} onSubmit={gravarConferencia}>
                      <textarea
                        id="descricao"
                        name="descricao"
                        placeholder="Descrição/Embalagem do Produto"
                        rows={3}
                        defaultValue={produtoConf.descricao}
                        disabled
                      />
                      <ContentConf>
                        <Input
                          percWidth={31}
                          name="qtunit"
                          type="number"
                          defaultValue={produtoConf.qtunit}
                          description="Qt.Unit"
                          disabled
                        />
                        <p />
                        <Input
                          percWidth={33}
                          name="qtunitcx"
                          type="number"
                          defaultValue={produtoConf.qtunitcx}
                          description="Qt.Unit.Cx"
                          disabled
                        />
                        <p />
                        <Input
                          percWidth={33.3}
                          id="qtavaria"
                          name="qtavaria"
                          type="number"
                          defaultValue={qtAvaria}
                          onChange={(e) => setQtAvaria(Number(e.target.value))}
                          onKeyPress={(e) => focusCampo(e)}
                          description="Qt.Avaria"
                        />
                        <ContentConf>
                          <Input
                            percWidth={47.9}
                            id="lastro"
                            name="lastro"
                            type="number"
                            description="Lastro"
                            onChange={(e) => setLastro(Number(e.target.value))}
                            onKeyPress={(e) => focusCampo(e)}
                            onKeyUp={calcTotal}
                          />
                          <p>*</p>
                          <Input
                            percWidth={47.9}
                            id="camada"
                            name="camada"
                            type="number"
                            description="Camada"
                            onChange={(e) => setCamada(Number(e.target.value))}
                            onKeyPress={(e) => focusCampo(e)}
                            onKeyUp={calcTotal}
                          />
                          <ContentConf>
                            <Input
                              percWidth={29}
                              id="qtcx"
                              name="qtcx"
                              type="number"
                              description="Qt.Cx"
                              onChange={(e) => setCx(Number(e.target.value))}
                              onKeyPress={(e) => focusCampo(e)}
                              onKeyUp={calcTotal}
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
                              onKeyUp={calcTotal}
                            />
                            <p>=</p>
                            <Input
                              percWidth={30.5}
                              id="total"
                              name="total"
                              type="number"
                              description="Total"
                              value={total}
                              onKeyPress={(e) => focusCampo(e)}
                              readOnly
                            />
                          </ContentConf>
                        </ContentConf>
                        <Input
                          icon={FiCalendar}
                          id="dtvalidade"
                          name="dtvalidade"
                          type="date"
                          value={dtValidade}
                          onChange={(e) => setDtValidade(e.target.value)}
                          onKeyPress={(e) => focusCampo(e)}
                          description="Data de validade"
                        />
                        <div id="detalhe">
                          <button type="button" onClick={telaExtratoBonus}>
                            ITENS DO BÔNUS
                          </button>
                          <button id="gravar" type="submit">
                            GRAVAR
                          </button>
                        </div>
                      </ContentConf>
                    </Form>
                  </ContentConf>
                </ContainerConf>
              </div>
              <Content className="tab2">
                <DataTable
                  header="Conferências já confirmadas"
                  value={confirmado}
                  scrollable
                  paginator
                  rows={5}
                  scrollHeight="420px"
                  style={{ width: '100%' }}
                >
                  <Column
                    header="Status"
                    style={{ width: '110px' }}
                    body={statusConferencia}
                  />
                  <Column
                    field="codprod"
                    header="Prod"
                    style={{ width: '70px' }}
                  />
                  <Column
                    field="descricao"
                    header="Descrição"
                    style={{ width: '360px' }}
                  />
                  <Column
                    field="qtentrada"
                    header="Qtd"
                    style={{ width: '60px' }}
                  />
                  <Column
                    field="qtavaria"
                    header="Avaria"
                    style={{ width: '65px' }}
                  />
                  <Column
                    field="dtvalidade"
                    header="Validade"
                    style={{ width: '100px' }}
                  />
                </DataTable>
                <Button>
                  {confirmado.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setMostrarDialogEnderecar(true)}
                    >
                      Endereçar
                    </button>
                  ) : (
                    <button type="button" disabled>
                      Endereçar
                    </button>
                  )}
                </Button>
              </Content>
              <Content className="tab3">
                <DataTable
                  header="Conferências já endereçadas"
                  value={enderecado}
                  scrollable
                  paginator
                  rows={8}
                  scrollHeight="420px"
                  style={{ width: '100%' }}
                >
                  <Column
                    field="codprod"
                    header="Prod"
                    style={{ width: '70px' }}
                  />
                  <Column
                    field="descricao"
                    header="Descrição"
                    style={{ width: '350px' }}
                  />
                  <Column
                    field="qtentrada"
                    header="Qtd"
                    style={{ width: '60px' }}
                  />
                  <Column
                    field="qtavaria"
                    header="Avaria"
                    style={{ width: '65px' }}
                  />
                  <Column
                    field="dtvalidade"
                    header="Validade"
                    style={{ width: '100px' }}
                  />
                </DataTable>
              </Content>
            </section>
          </>
        ) : (
          <Loading>
            <ReactLoading
              className="loading"
              type="spokes"
              width="100px"
              color="#c22e2c"
            />
          </Loading>
        )}
      </Container>
    </>
  );
};

export default ConferenciaBonus;
