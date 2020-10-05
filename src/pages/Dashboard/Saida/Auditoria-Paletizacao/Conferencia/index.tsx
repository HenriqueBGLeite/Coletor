import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FiLock, FiShoppingBag } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import ReactLoading from 'react-loading';

import quebraOs from '../../../../../utils/quebraOs';

import api from '../../../../../services/api';

import { createMessage } from '../../../../../components/Toast';
import { useAuth } from '../../../../../hooks/auth';
import NavBar from '../../../../../components/NavBar';
import Input from '../../../../../components/Input';

import { Container, Content, Loading, Button, ContentOs17 } from './styles';

interface DTOCarga {
  numcar: number;
  pendencia: number;
  proxTela: string;
  numos?: number;
}

interface DTODivergPend {
  pendencia: number;
  divergencia: number;
}

interface DTOCliente {
  letra: string;
  palete: number;
}

interface DTOCabecalhoOs {
  numCar: number;
  numPalete: number;
  numOs: number;
  numVol: number;
  codFilial: number;
  codFunc: number;
  tipoConferencia: string;
}

interface DataForm {
  numcar: number;
  numbox: number;
  numpalete: number;
  numos: number | undefined;
  dun: number | undefined;
  numvol: number;
  tipoos: number;
  pertencecarga: string;
  reconferido: string;
  paletizado: string;
  osaberta: number;
  divergencia: number;
  qtospendente: number;
  qtconferida: number;
}

interface DataFormOs17 {
  codprod: number;
  qtunitcx: number;
  qt: number;
}

const Conferencia: React.FC = () => {
  const { usuario } = useAuth();
  const history = useHistory();
  const dadosCarga = history.location.state as DTOCarga;
  const formRef = useRef<FormHandles>(null);
  const [dataForm, setDataForm] = useState<DataForm>({} as DataForm);
  const [proxCli, setProxCli] = useState<DTOCliente>({} as DTOCliente);
  const [numos, setNumOs] = useState<string | null>();
  const [dun, setDun] = useState<number | undefined>();
  const [divergencia, setDivergencia] = useState(0);
  const [pendencia, setPendencia] = useState<number | undefined>();
  const [mostrarDadosOs17, setMostrarDadosOs17] = useState(false);
  const [dataFormOs17, setDataFormOs17] = useState<DataFormOs17>(
    {} as DataFormOs17,
  );
  const [lastro, setLastro] = useState(0);
  const [camada, setCamada] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    if (dadosCarga.proxTela === 'P') {
      setPendencia(dadosCarga.pendencia);

      api
        .get<DTOCliente[]>(
          `AuditoriaPaletiza/ProximoCliente/${dadosCarga.numcar}/${usuario.code}`,
        )
        .then((response) => {
          setProxCli(response.data[0]);
          setLoading(false);
        })
        .catch((err) => {
          createMessage({
            type: 'error',
            message: `Erro: ${err.message}`,
          });

          setLoading(false);
        });
    } else {
      setPendencia(dadosCarga.pendencia);
      setLoading(false);
    }
  }, [dadosCarga, usuario.code]);

  const limpaTela = useCallback(() => {
    setDataForm({} as DataForm);
    setDataFormOs17({} as DataFormOs17);
    setMostrarDadosOs17(false);
    setDun(undefined);
    setNumOs(undefined);
    setTotal(0);
    setDivergencia(0);
    formRef.current?.setFieldValue('numos', null);
    formRef.current?.setFieldValue('codbarra', null);
    formRef.current?.setFieldValue('volume', null);
  }, []);

  const atualizaCliPalete = useCallback(async () => {
    api
      .get<DTOCliente[]>(
        `AuditoriaPaletiza/ProximoCliente/${dadosCarga.numcar}/${usuario.code}`,
      )
      .then((response) => {
        setProxCli(response.data[0]);
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: `Erro: ${err.message}`,
        });

        setLoading(false);
      });
  }, [dadosCarga, usuario]);

  const validaOs = useCallback(async () => {
    setLoading(true);

    try {
      const { numos: numOs, numvol: numVol } = quebraOs(numos as string);

      const dataCab = {
        numCar: dadosCarga.numcar,
        numPalete: proxCli.palete,
        numOs,
        numVol,
        codFilial: usuario.filial,
        codFunc: usuario.code,
        tipoConferencia: dadosCarga.proxTela,
      } as DTOCabecalhoOs;

      if (dadosCarga.proxTela === 'P') {
        const response = await api.put<string>(
          'AuditoriaPaletiza/PaletizaVolume',
          dataCab,
        );

        const paletizou = response.data;

        if (paletizou === 'S') {
          const atualizaDivergPend = await api.get<DTODivergPend[]>(
            `AuditoriaPaletiza/AtualizaDivergPend/${dadosCarga.numcar}/${numOs}/${dadosCarga.proxTela}`,
          );

          const resultado = atualizaDivergPend.data[0];

          if (resultado.pendencia > 0) {
            await atualizaCliPalete();
            setPendencia(resultado.pendencia);
            limpaTela();
            setLoading(false);
          } else {
            createMessage({
              type: 'success',
              message: `Carga: ${dadosCarga.numcar} totalmente paletizada.`,
            });

            history.push('/saida');
          }
        } else if (paletizou === 'O.S. já foi paletizada.') {
          const atualizaDivergPend = await api.get<DTODivergPend[]>(
            `AuditoriaPaletiza/AtualizaDivergPend/${dadosCarga.numcar}/${numOs}/${dadosCarga.proxTela}`,
          );

          const resultado = atualizaDivergPend.data[0];

          if (resultado.pendencia > 0) {
            setNumOs(String(numOs) as string | undefined);
            setDivergencia(resultado.divergencia);
            setPendencia(resultado.pendencia);

            createMessage({
              type: 'alert',
              message: `Retorno: ${paletizou}`,
            });

            formRef.current?.setFieldValue('numos', null);
            setLoading(false);
          } else {
            createMessage({
              type: 'success',
              message: `Carga: ${dadosCarga.numcar} totalmente paletizada.`,
            });

            history.push('/saida');
          }
        } else {
          createMessage({
            type: 'alert',
            message: `Retorno: ${paletizou}`,
          });

          limpaTela();
          setLoading(false);
        }
      } else {
        const response = await api.put<DataForm[]>(
          'AuditoriaPaletiza/CabecalhoOs',
          dataCab,
        );

        const cabOs = response.data[0];

        if (cabOs) {
          if (cabOs.pertencecarga === 'S') {
            if (cabOs.osaberta === 0) {
              if (dadosCarga.proxTela === 'A' && cabOs.reconferido === 'N') {
                if (cabOs.tipoos === 13) {
                  const responseAudita = await api.put(
                    `AuditoriaPaletiza/AuditaVolumeOs/${cabOs.numos}/${cabOs.numvol}/${usuario.code}`,
                  );
                  const gravou = responseAudita.data;

                  if (gravou) {
                    const atualizaDivergPend = await api.get<DTODivergPend[]>(
                      `AuditoriaPaletiza/AtualizaDivergPend/${dadosCarga.numcar}/${cabOs.numos}/${dadosCarga.proxTela}`,
                    );

                    const resultado = atualizaDivergPend.data[0];

                    if (resultado.pendencia > 0) {
                      setPendencia(resultado.pendencia);
                      limpaTela();
                      setLoading(false);
                    } else {
                      createMessage({
                        type: 'success',
                        message: `Carga: ${dadosCarga.numcar} totalmente reconferida.`,
                      });

                      history.push('/saida');
                    }
                  } else {
                    createMessage({
                      type: 'error',
                      message:
                        'Ocorreu um ao erro ao tentar gravar o registro, por favor tente mais tarde.',
                    });
                  }
                } else {
                  if (cabOs.tipoos === 17) {
                    setMostrarDadosOs17(true);
                  }
                  setDataForm(cabOs);
                  setDivergencia(cabOs.divergencia);
                  setPendencia(cabOs.qtospendente);
                  setLoading(false);
                  setNumOs(undefined);
                  document.getElementById('codbarra')?.focus();
                }
              } else {
                createMessage({
                  type: 'alert',
                  message: `O.S: ${numOs}/${numVol} do palete: ${cabOs.numpalete} já foi reconferido.`,
                });

                setDataForm(cabOs);
                setDivergencia(cabOs.divergencia);
                setPendencia(cabOs.qtospendente);
                setNumOs(String(cabOs.numos));

                cabOs.numos = undefined;

                formRef.current?.setFieldValue('numos', null);
                setLoading(false);
              }
            } else {
              createMessage({
                type: 'alert',
                message: 'Apenas O.S. finalizadas podem ser reconferidas.',
              });

              limpaTela();
              setLoading(false);
            }
          } else {
            createMessage({
              type: 'alert',
              message: `O.S: ${numOs}/${numVol} não pertence ao carregamento: ${dadosCarga.numcar}.`,
            });

            limpaTela();
            setLoading(false);
          }
        } else {
          createMessage({
            type: 'error',
            message: `Nenhum registro foi localizado para O.S: ${numOs}.`,
          });

          limpaTela();
          setLoading(false);
        }
      }
    } catch (err) {
      createMessage({
        type: 'error',
        message: `Erro: ${err.message}.`,
      });

      limpaTela();
      setLoading(false);
    }
  }, [
    numos,
    dadosCarga,
    usuario,
    proxCli,
    limpaTela,
    history,
    atualizaCliPalete,
  ]);

  const chamaValidaOs = useCallback(
    async (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        setLoading(true);
        if (numos) {
          validaOs();
        } else {
          createMessage({
            type: 'error',
            message: 'Informe o número da O.S.',
          });
          setLoading(false);
        }
      }
    },
    [validaOs, numos],
  );

  const validaProduto = useCallback(async () => {
    if (dun === dataForm.dun) {
      if (dataForm.tipoos === 20) {
        try {
          const response = await api.put(
            `AuditoriaPaletiza/AuditaVolumeOs/${dataForm.numos}/${dataForm.numvol}/${usuario.code}`,
          );
          const gravou = response.data;

          if (gravou) {
            const atualizaDivergPend = await api.get<DTODivergPend[]>(
              `AuditoriaPaletiza/AtualizaDivergPend/${dadosCarga.numcar}/${dataForm.numos}/${dadosCarga.proxTela}`,
            );

            const resultado = atualizaDivergPend.data[0];

            if (resultado.pendencia > 0) {
              setPendencia(resultado.pendencia);
              limpaTela();
              setLoading(false);
            } else {
              createMessage({
                type: 'success',
                message: `Carga: ${dadosCarga.numcar} totalmente reconferida.`,
              });

              history.push('/saida');
            }
          } else {
            createMessage({
              type: 'error',
              message:
                'Ocorreu um ao erro ao tentar gravar o registro, por favor tente mais tarde.',
            });
          }
        } catch (err) {
          createMessage({
            type: 'error',
            message: `Erro: ${err.response.data}`,
          });

          limpaTela();
          setLoading(false);
        }
      } else {
        setLoading(false);
        setNumOs(undefined);
        document.getElementById('lastro')?.focus();
      }
    } else {
      createMessage({
        type: 'error',
        message: `Cód.Barra ${dun} não pertence a O.S: ${dataForm.numos} volume: ${dataForm.numvol}. Confira pelo código de barra master!`,
      });

      setLoading(false);
      setNumOs(undefined);
      formRef.current?.setFieldValue('codbarra', null);
      document.getElementById('codbarra')?.focus();
    }
  }, [dataForm, usuario, limpaTela, dun, dadosCarga, history]);

  const validaProdutoOs17 = useCallback(async () => {
    if (dataForm.qtconferida === total) {
      try {
        const response = await api.put(
          `AuditoriaPaletiza/AuditaVolumeOs/${dataForm.numos}/${dataForm.numvol}/${usuario.code}`,
        );
        const gravou = response.data;

        if (gravou) {
          const atualizaDivergPend = await api.get<DTODivergPend[]>(
            `AuditoriaPaletiza/AtualizaDivergPend/${dadosCarga.numcar}/${dataForm.numos}/${dadosCarga.proxTela}`,
          );

          const resultado = atualizaDivergPend.data[0];

          if (resultado.pendencia > 0) {
            setPendencia(resultado.pendencia);
            limpaTela();
            setLoading(false);
          } else {
            createMessage({
              type: 'success',
              message: `Carga: ${dadosCarga.numcar} totalmente recoferida.`,
            });

            history.push('/saida');
          }
        } else {
          createMessage({
            type: 'error',
            message:
              'Ocorreu um ao erro ao tentar gravar o registro, por favor tente mais tarde.',
          });
        }
      } catch (err) {
        createMessage({
          type: 'error',
          message: `Erro: ${err.response.data}`,
        });

        limpaTela();
        setLoading(false);
      }
    } else {
      createMessage({
        type: 'error',
        message: `Não foi possível realizar a conferência. Quantidade difere da 1ª conferência.`,
      });

      limpaTela();
      setLoading(false);
      document.getElementById('numos')?.focus();
    }
  }, [dataForm, usuario, limpaTela, dadosCarga, history, total]);

  const chamaValidaProduto = useCallback(
    async (event) => {
      if (event.key === 'Enter') {
        setLoading(true);
        if (dun) {
          validaProduto();
        } else {
          createMessage({
            type: 'error',
            message: 'Informe um produto.',
          });
          setLoading(false);
        }
      }
    },
    [validaProduto, dun],
  );

  const telaDivergencia = useCallback(() => {
    const data = {
      numcar: dadosCarga.numcar,
      pendencia,
      numos,
      proxTela: dadosCarga.proxTela,
    };
    history.push('/auditoria-paletizacao/divergencia', data);
  }, [numos, pendencia, history, dadosCarga]);

  const telaPendencia = useCallback(() => {
    const data = {
      numcar: dadosCarga.numcar,
      pendencia,
      proxTela: dadosCarga.proxTela,
    };
    history.push('/auditoria-paletizacao/pendencia', data);
  }, [history, dadosCarga, pendencia]);

  const alimentaQtConfOs17 = useCallback(() => {
    setDataFormOs17({ ...dataFormOs17, qt: total * dataFormOs17.qtunitcx });
  }, [dataFormOs17, total]);

  const focusCampo = useCallback((event) => {
    if (event.target.id === 'lastro' && event.key === 'Enter') {
      document.getElementById('camada')?.focus();
    }
    if (event.target.id === 'camada' && event.key === 'Enter') {
      document.getElementById('total')?.focus();
    }
    if (event.target.id === 'total' && event.key === 'Enter') {
      document.getElementById('gravar')?.focus();
    }
  }, []);

  const handleCalcTotal = useCallback(() => {
    setTotal(lastro * camada);
  }, [lastro, camada]);

  return (
    <>
      <NavBar caminho="/saida" numCarregamento={dadosCarga.numcar} />
      <Container>
        <Loading>
          {!loading ? (
            <Content>
              {dadosCarga.proxTela === 'P' ? (
                <h1>
                  CLIENTE: {proxCli.letra} - PALETE: {proxCli.palete}
                </h1>
              ) : (
                <> </>
              )}

              <Form ref={formRef} onSubmit={validaOs}>
                <Input
                  focus
                  id="numos"
                  icon={FiLock}
                  name="numos"
                  type="number"
                  description="NÚMERO DA O.S."
                  defaultValue={dataForm.numos}
                  onChange={(e) => setNumOs(e.target.value)}
                  onKeyPress={chamaValidaOs}
                />
                {dadosCarga.proxTela === 'A' ? (
                  <>
                    {dataForm.numos ? (
                      <>
                        <Input
                          id="codbarra"
                          icon={FiShoppingBag}
                          name="codbarra"
                          type="number"
                          description="PRODUTO"
                          defaultValue={dun}
                          onChange={(e) => setDun(Number(e.target.value))}
                          onKeyPress={chamaValidaProduto}
                        />
                        {mostrarDadosOs17 ? (
                          <ContentOs17>
                            <Input
                              percWidth={30}
                              id="lastro"
                              name="lastro"
                              type="number"
                              description="Lastro"
                              onChange={(e) => setLastro(Number(e.target.value))} //eslint-disable-line
                              onBlur={(e) => setLastro(Number(e.target.value))}
                              onKeyPress={(e) => focusCampo(e)}
                              onKeyUp={handleCalcTotal}
                            />
                            <p>*</p>
                            <Input
                              percWidth={30}
                              id="camada"
                              name="camada"
                              type="number"
                              description="Camada"
                              onChange={(e) => setCamada(Number(e.target.value))} //eslint-disable-line
                              onBlur={(e) => setCamada(Number(e.target.value))}
                              onKeyPress={(e) => focusCampo(e)}
                              onKeyUp={handleCalcTotal}
                            />
                            <p>=</p>
                            <Input
                              percWidth={30}
                              id="total"
                              name="total"
                              type="number"
                              description="Total"
                              value={total}
                              onChange={(e) => setTotal(Number(e.target.value))}
                              onBlur={(e) => setTotal(Number(e.target.value))}
                              onKeyPress={(e) => focusCampo(e)}
                              onKeyUp={alimentaQtConfOs17}
                            />
                            <button
                              id="gravar"
                              type="button"
                              onClick={validaProdutoOs17}
                            >
                              GRAVAR
                            </button>
                          </ContentOs17>
                        ) : (
                          <> </>
                        )}
                      </>
                    ) : (
                      <Input
                        icon={FiShoppingBag}
                        name="codbarra"
                        type="number"
                        description="PRODUTO"
                        disabled
                      />
                    )}
                  </>
                ) : (
                  <> </>
                )}
              </Form>
              <Button>
                {(dataForm.numos || numos) && divergencia > 0 ? (
                  <button type="button" onClick={telaDivergencia}>
                    <p>Divergência O.S.</p>
                    <p>({divergencia})</p>
                  </button>
                ) : (
                  <button type="button" disabled>
                    <p>Divergência O.S.</p>
                    <p>(0)</p>
                  </button>
                )}
                <button type="button" onClick={telaPendencia}>
                  <p>Pendência Carga</p>
                  <p>({pendencia})</p>
                </button>
              </Button>
            </Content>
          ) : (
            <ReactLoading
              className="loading"
              type="spokes"
              width="100px"
              color="#c22e2c"
            />
          )}
        </Loading>
      </Container>
    </>
  );
};

export default Conferencia;
