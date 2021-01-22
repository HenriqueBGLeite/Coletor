import React, { useEffect, useState, useCallback, useRef } from 'react';
import ReactLoading from 'react-loading';
import { FiLock, FiTruck, FiLayers, FiInbox } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import { createMessage } from '../../../../../../components/Toast';
import { useAuth } from '../../../../../../hooks/auth';
import quebraOs from '../../../../../../utils/quebraOs';

import api from '../../../../../../services/api';

import Input from '../../../../../../components/Input';
import NavBar from '../../../../../../components/NavBar';

import { Container, Content, ContentOs17, Button, Loanding } from './styles';

interface Props {
  boxOrig: number;
  numcar: number;
  qtPend: number;
  numeroPalete: number;
}

interface DataForm {
  numos: number | undefined;
  numpalete: number;
  numped: number;
  numcar: number;
  numbox: number;
  tipoos: number;
  dtconf: string;
  codfuncconf: number;
  pendencia: number;
  numvol: number;
  codbarra: string;
  qtospendente: number;
}

interface DataProduto {
  codprod: number;
  conferido: string;
  ean: string;
  dun: string;
  qtunitcx: number;
  numvol: number;
  reconferido: string;
}

interface DataFormOs17 {
  codprod: number;
  qtunitcx: number;
  qt: number;
}

const ConferenciaOs: React.FC = () => {
  const { usuario } = useAuth();
  const history = useHistory();
  const dataConf = history.location.state as Props;
  const formRef = useRef<FormHandles>(null);
  const [numos, setNumOs] = useState<string | null>();
  const [dun, setDun] = useState<string | null>();
  const [numcar, setNumCar] = useState(0);
  const [dataForm, setDataForm] = useState<DataForm>({} as DataForm);
  const [dataFormOs17, setDataFormOs17] = useState<DataFormOs17>(
    {} as DataFormOs17,
  );
  const [lastro, setLastro] = useState(0);
  const [camada, setCamada] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mostrarDadosOs17, setMostrarDadosOs17] = useState(false);
  const [mostrarProduto, setMostrarProduto] = useState(false);
  const [qtdDivergenciaOs, setQtDivergenciaOs] = useState(0);
  const [qtOsPend, setQtOsPend] = useState(0);

  useEffect(() => {
    if (dataConf.numcar) {
      setNumCar(dataConf.numcar);
      setQtOsPend(dataConf.qtPend);
    }
  }, [dataConf]);

  const limparTela = useCallback(() => {
    setDataForm({} as DataForm);
    setDataFormOs17({} as DataFormOs17);
    setQtOsPend(0);
    setQtDivergenciaOs(0);
    setLastro(0);
    setCamada(0);
    setTotal(0);
    setMostrarProduto(false);
    setMostrarDadosOs17(false);
    formRef.current?.setFieldValue('numos', null);
    formRef.current?.setFieldValue('codbarra', null);
  }, []);

  const alimentaDivergenciaPendecia = useCallback(
    (numCarPesquisa: number, numOsPesquisa: number): void => {
      api
        .get(
          `ConferenciaSaida/BuscaPendDiverg/${numCarPesquisa}/${numOsPesquisa}`,
        )
        .then((response) => {
          const dataPendenciaDiverg = response.data;
          if (numCarPesquisa === 0) {
            setQtOsPend(0);
          } else {
            setQtOsPend(dataPendenciaDiverg.pendencia);
          }
          setQtDivergenciaOs(dataPendenciaDiverg.divergencia);
        })
        .catch((err) => {
          createMessage({
            type: 'error',
            message: err,
          });
        });
    },
    [],
  );

  const validaOs = useCallback(async () => {
    setLoading(true);
    try {
      const { numos: numOs, numvol: numVol } = quebraOs(numos as string);

      const response = await api.get<DataForm[]>(
        `ConferenciaSaida/CabecalhoOs/${numOs}/${numVol}`,
      );

      const cabOs = response.data[0];

      if (cabOs) {
        if (numos && numos?.length < 14 && cabOs.tipoos !== 17) {
          createMessage({
            type: 'alert',
            message: 'Por favor, conferir a O.S. pela etiqueta.',
          });
          limparTela();
          setLoading(false);
          return;
        }

        if (dataConf.boxOrig === cabOs.numbox) {
          if (dataConf.numeroPalete === cabOs.numpalete) {
            if (cabOs.codfuncconf && cabOs.dtconf) {
              createMessage({
                type: 'alert',
                message: `O.S: ${cabOs.numos} Volume: ${cabOs.numvol} já finalizada. Conferente: ${cabOs.codfuncconf}`,
              });

              setNumOs(String(cabOs.numos));

              setNumCar(cabOs.numcar);
              setDataForm(cabOs);

              // Alimenta Divergência e Pendência
              alimentaDivergenciaPendecia(
                Number(cabOs.numcar),
                Number(cabOs.numos),
              );

              cabOs.numos = undefined;

              formRef.current?.setFieldValue('numos', null);
              setLoading(false);
            } else if (cabOs.tipoos === 20 || cabOs.tipoos === 17) {
              // Alimenta Divergência e Pendência
              alimentaDivergenciaPendecia(
                Number(cabOs.numcar),
                Number(cabOs.numos),
              );

              setMostrarProduto(true);
              setNumCar(cabOs.numcar);
              setDataForm(cabOs);
              setLoading(false);
              setNumOs(undefined);
              document.getElementById('codbarra')?.focus();
            } else {
              const dataUpdateOs13 = {
                numos: cabOs.numos,
                tipoos: cabOs.tipoos,
                numvol: cabOs.numvol,
                codFuncConf: usuario.code,
              };

              const updateOs13 = await api.put(
                'ConferenciaSaida/ConfereVolumeCheckout',
                dataUpdateOs13,
              );

              const sucessoConferencia = updateOs13.data;

              if (!sucessoConferencia) {
                createMessage({
                  type: 'error',
                  message: `Erro ao finalizar a O.S: ${numOs}. Por favor tente mais tarde.`,
                });
              }
              limparTela();
              setLoading(false);
            }
          } else {
            createMessage({
              type: 'error',
              message: `O.S: ${numOs} pertence ao palete: ${cabOs.numpalete}.`,
            });
            limparTela();
            setLoading(false);
          }
        } else {
          createMessage({
            type: 'error',
            message: `O.S: ${numOs} pertence ao box: ${cabOs.numbox}.`,
          });
          limparTela();
          setLoading(false);
        }
      } else {
        createMessage({
          type: 'error',
          message: `Nenhuma O.S. foi encontrada com esse número: ${numOs}.`,
        });
        limparTela();
        setLoading(false);
      }
    } catch (err) {
      createMessage({
        type: 'error',
        message: `Error: ${err.message}`,
      });

      setLoading(false);
    }
  }, [
    numos,
    dataConf.boxOrig,
    dataConf.numeroPalete,
    usuario,
    limparTela,
    alimentaDivergenciaPendecia,
  ]);

  const chamaValidaOs = useCallback(
    async (event) => {
      if (event.key === 'Enter') {
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
    try {
      let dataProduto = {} as DataProduto;

      if (dataForm.tipoos === 20) {
        const responseProduto = await api.get<DataProduto[]>(
          `ConferenciaSaida/ProdutoOsVolume/${dun}/${dataForm.numos}/${dataForm.numvol}/${usuario.filial}`,
        );

        dataProduto = responseProduto.data[0] as DataProduto;
      } else {
        const responseProduto = await api.get<DataProduto[]>(
          `ConferenciaSaida/ProdutoOs/${dun}/${dataForm.numos}/${usuario.filial}`,
        );

        dataProduto = responseProduto.data[0] as DataProduto;
      }
      if (dataProduto) {
        if (dataProduto.conferido === 'S') {
          createMessage({
            type: 'alert',
            message: `Produto: ${dataProduto.codprod} e volume: ${dataProduto.numvol} já conferido.`,
          });
          setLoading(false);
        } else if (dataForm.tipoos === 20) {
          const dataUpdateOs = {
            numos: dataForm.numos,
            tipoos: dataForm.tipoos,
            numvol: dataForm.numvol,
            codFuncConf: usuario.code,
            codprod: dataProduto.codprod,
            numbox: dataConf.boxOrig,
            qtconf: dataProduto.qtunitcx,
          };

          const updateOs = await api.put(
            'ConferenciaSaida/ConfereVolumeCaixaFechada',
            dataUpdateOs,
          );

          const sucessoConferencia = updateOs.data;

          if (sucessoConferencia) {
            limparTela();
            setLoading(false);
          } else {
            createMessage({
              type: 'error',
              message: `Erro ao conferir a O.S: ${dataForm.numos}. Por favor tente mais tarde.`,
            });
          }
          limparTela();
          setLoading(false);
        } else {
          setDataFormOs17({
            ...dataFormOs17,
            codprod: dataProduto.codprod,
            qtunitcx: dataProduto.qtunitcx,
          });

          setMostrarDadosOs17(true);
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
        document.getElementById('codbarra')?.focus();
      }
    } catch (err) {
      createMessage({
        type: 'error',
        message: 'Nenhum produto encontrado.',
      });
      setLoading(false);
    }
  }, [dataForm, dun, usuario, dataConf.boxOrig, limparTela, dataFormOs17]);

  const validaProdutoOs17 = useCallback(async () => {
    setLoading(true);

    try {
      const dataUpdateOs = {
        numos: dataForm.numos,
        tipoos: dataForm.tipoos,
        numvol: dataForm.numvol,
        codFuncConf: usuario.code,
        codprod: dataFormOs17.codprod,
        numbox: dataConf.boxOrig,
        qtconf: dataFormOs17.qt,
      };

      const updateOs = await api.put(
        'ConferenciaSaida/ConfereVolumeCaixaFechada',
        dataUpdateOs,
      );

      const sucessoConferencia = updateOs.data;

      if (sucessoConferencia) {
        limparTela();
        setLoading(false);
      } else {
        createMessage({
          type: 'error',
          message: `Erro ao conferir a O.S: ${dataForm.numos}. Por favor tente mais tarde.`,
        });
      }
      limparTela();
      setLoading(false);
    } catch (err) {
      createMessage({
        type: 'error',
        message: `Erro: ${err.message}`,
      });
      limparTela();
      setLoading(false);
    }
  }, [dataConf.boxOrig, dataForm, limparTela, usuario.code, dataFormOs17]);

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
    let dataOs;

    if (dataForm.numos === undefined) {
      dataOs = {
        numos,
        boxOrig: dataForm.numbox,
        numcar,
        qtPend: qtOsPend,
        numeroPalete: dataConf.numeroPalete,
      };
    } else {
      dataOs = {
        numos: dataForm.numos,
        boxOrig: dataForm.numbox,
        numcar,
        qtPend: qtOsPend,
        numeroPalete: dataConf.numeroPalete,
      };
    }

    history.push(`/conferencia-saida/divergencia`, dataOs);
  }, [history, dataForm, numcar, qtOsPend, dataConf.numeroPalete, numos]);

  const telaOsPendente = useCallback(() => {
    const dataOs = {
      numcar,
      boxOrig: dataConf.boxOrig,
      qtPend: qtOsPend,
      numeroPalete: dataConf.numeroPalete,
    } as Props;
    history.push(`/conferencia-saida/os-pendente`, dataOs);
  }, [history, dataConf, numcar, qtOsPend]);

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
      <NavBar
        caminho="/conferencia-saida/confirma-palete"
        numCarregamento={numcar}
        params={dataConf.boxOrig}
      />
      <Container>
        <Loanding>
          {!loading ? (
            <Content>
              <Form ref={formRef} onSubmit={validaOs}>
                <Input
                  focus
                  icon={FiLock}
                  name="numos"
                  type="number"
                  description="NÚMERO DA O.S."
                  defaultValue={dataForm.numos}
                  onChange={(e) => setNumOs(e.target.value)}
                  onKeyPress={chamaValidaOs}
                />
                <Input
                  percWidth={49}
                  icon={FiTruck}
                  name="numcar"
                  type="number"
                  description="Carga"
                  defaultValue={dataForm.numcar}
                  disabled
                />
                <Input
                  percWidth={25}
                  icon={FiLayers}
                  name="numpalete"
                  type="number"
                  description="Pal"
                  defaultValue={dataForm.numpalete}
                  disabled
                />
                <Input
                  percWidth={25}
                  icon={FiInbox}
                  marginRight={3}
                  name="numvol"
                  type="number"
                  description="Vol"
                  defaultValue={dataForm.numvol}
                  disabled
                />
                {mostrarProduto ? (
                  <>
                    <Input
                      icon={FiLock}
                      id="codbarra"
                      name="codbarra"
                      type="number"
                      description="PRODUTO"
                      defaultValue={dataFormOs17.codprod}
                      onChange={(e) => setDun(e.target.value)}
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
                          onChange={(e) => setLastro(Number(e.target.value))}
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
                          onChange={(e) => setCamada(Number(e.target.value))}
                          onBlur={(e) => setCamada(Number(e.target.value))}
                          onKeyPress={(e) => focusCampo(e)}
                          onKeyUp={handleCalcTotal}
                        />
                        <p>=</p>
                        <Input
                          percWidth={29}
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
                  <> </>
                )}
              </Form>

              <Button>
                {(dataForm.numos || numos) && qtdDivergenciaOs > 0 ? (
                  <button type="button" onClick={telaDivergencia}>
                    <p>Divergência</p>
                    <p>({qtdDivergenciaOs})</p>
                  </button>
                ) : (
                  <button type="button" disabled>
                    <p>Divergência</p>
                    <p>({qtdDivergenciaOs})</p>
                  </button>
                )}
                <button
                  type="button"
                  onClick={telaOsPendente}
                  disabled={numcar === 0}
                >
                  <p>O.S. Pendente</p>
                  <p>({qtOsPend})</p>
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
        </Loanding>
      </Container>
    </>
  );
};

export default ConferenciaOs;
