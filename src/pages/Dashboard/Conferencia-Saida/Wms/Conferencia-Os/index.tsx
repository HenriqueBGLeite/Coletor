import React, { useState, useCallback, useRef } from 'react';
import ReactLoading from 'react-loading';
import { FiLock, FiTruck, FiLayers, FiInbox } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { createMessage } from '../../../../../components/Toast';
import quebraOs from '../../../../../utils/quebraOs';

import api from '../../../../../services/api';

import Input from '../../../../../components/Input';
import NavBar from '../../../../../components/NavBar';

import { Container, Content, Button, Loanding } from './styles';

interface DataForm {
  numos: number;
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

interface Pendencia {
  pendencia: number;
}

const ConferenciaOs: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const boxOrig = history.location.state;
  const formRef = useRef<FormHandles>(null);
  const [numos, setNumOs] = useState<string | null>();
  const [dun, setDun] = useState<string | null>();
  const [dataForm, setDataForm] = useState<DataForm>({} as DataForm);
  const [loading, setLoading] = useState(false);
  const [mostrarProduto, setMostrarProduto] = useState(false);

  const validaOs = useCallback(async () => {
    setLoading(true);
    try {
      const { numos: numOs, numvol: numVol } = quebraOs(numos as string);

      const response = await api.get<DataForm[]>(
        `ConferenciaSaida/CabecalhoOs/${numOs}/${numVol}`,
      );

      const cabOs = response.data[0];
      if (cabOs) {
        if (boxOrig === cabOs.numbox) {
          if (cabOs.codfuncconf && cabOs.dtconf) {
            createMessage({
              type: 'alert',
              message: `O.S: ${cabOs.numos} Volume: ${cabOs.numvol} já finalizada. Conferente: ${cabOs.codfuncconf} - ${user.nome}`,
            });
            setLoading(false);
          } else if (cabOs.tipoos === 20 || cabOs.tipoos === 17) {
            setMostrarProduto(true);
            setDataForm(cabOs);
            setLoading(false);
            setNumOs(undefined);
            document.getElementById('codbarra')?.focus();
          } else {
            const dataUpdateOs13 = {
              numos: cabOs.numos,
              numvol: cabOs.numvol,
              codFuncConf: user.code,
            };

            const updateOs13 = await api.put(
              'ConferenciaSaida/ConfereVolumeCheckout',
              dataUpdateOs13,
            );

            const sucessoConferencia = updateOs13.data;

            if (sucessoConferencia) {
              createMessage({
                type: 'success',
                message: `Conferência da O.S: ${numOs} Volume: ${numVol} realizada.`,
              });
            } else {
              createMessage({
                type: 'error',
                message: `Erro ao finalizar a O.S: ${numOs}. Por favor tente mais tarde.`,
              });
            }
            setDataForm({} as DataForm);
            setLoading(false);
          }
        } else {
          createMessage({
            type: 'error',
            message: `O.S: ${numOs} pertence ao box: ${cabOs.numbox}.`,
          });
          setMostrarProduto(false);
          setDataForm({} as DataForm);
          formRef.current?.setFieldValue('numos', null);
          setLoading(false);
        }
      } else {
        createMessage({
          type: 'error',
          message: `Nenhuma O.S. foi encontrada com esse número: ${numOs}.`,
        });
        setMostrarProduto(false);
        setDataForm({} as DataForm);
        formRef.current?.setFieldValue('numos', null);
        setLoading(false);
      }
    } catch (err) {
      createMessage({
        type: 'error',
        message: err,
      });

      setLoading(false);
    }
  }, [numos, boxOrig, user]);

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
      const responseProduto = await api.get<DataProduto[]>(
        `ConferenciaSaida/ProdutoOsVolume/${dun}/${dataForm.numos}/${dataForm.numvol}/${user.filial}`,
      );

      const dataProduto = responseProduto.data[0];

      if (dataProduto) {
        if (dataProduto.conferido === 'S') {
          createMessage({
            type: 'alert',
            message: `Produto: ${dataProduto.codprod} e volume: ${dataProduto.numvol} já conferido.`,
          });
          setLoading(false);
        } else {
          const dataUpdateOs20 = {
            numos: dataForm.numos,
            numvol: dataForm.numvol,
            codFuncConf: user.code,
            codprod: dataProduto.codprod,
            numbox: boxOrig,
            qtconf: dataProduto.qtunitcx,
          };

          const updateOs20 = await api.put(
            'ConferenciaSaida/ConfereVolumeCaixaFechada',
            dataUpdateOs20,
          );

          const sucessoConferencia = updateOs20.data;

          if (sucessoConferencia) {
            const pendenciaOs = await api.get<Pendencia[]>(
              `ConferenciaSaida/buscaQtOsPendente/${dataForm.numos}/${dataForm.numbox}`,
            );

            const retornoPendenciaOs = pendenciaOs.data[0].pendencia;

            if (retornoPendenciaOs > 0) {
              createMessage({
                type: 'success',
                message: `Conferência da O.S: ${dataForm.numos} Volume: ${dataForm.numvol} realizada.`,
              });
            } else {
              const finalizaOs = await api.put(
                `ConferenciaSaida/FinalizaConferenciaOs/${dataForm.numos}`,
              );

              const finalizouOs = finalizaOs.data;

              if (finalizouOs) {
                createMessage({
                  type: 'success',
                  message: `Conferência da O.S: ${dataForm.numos} finalizada!`,
                });
              } else {
                createMessage({
                  type: 'error',
                  message: `Erro ao finalizar a O.S: ${dataForm.numos}. Por favor tente mais tarde.`,
                });
              }
            }
          } else {
            createMessage({
              type: 'error',
              message: `Erro ao conferir a O.S: ${dataForm.numos}. Por favor tente mais tarde.`,
            });
          }
          setDataForm({} as DataForm);
          setMostrarProduto(false);
          setLoading(false);
        }
      } else {
        createMessage({
          type: 'error',
          message: `Cód.Barra ${dun} não pertence a O.S: ${dataForm.numos} volume: ${dataForm.numvol}. Confira pelo código de barra master!`,
        });
        setDataForm({} as DataForm);
        setMostrarProduto(false);
        setLoading(false);
      }
    } catch (err) {
      createMessage({
        type: 'error',
        message: 'Nenhum produto encontrado.',
      });
      setLoading(false);
    }
  }, [dataForm, dun, user, boxOrig]);

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
    const dataOs = { numos: dataForm.numos, numbox: dataForm.numbox };
    history.push(`/conferencia-saida/divergencia`, dataOs);
  }, [history, dataForm]);

  const telaOsPendente = useCallback(() => {
    const dataOs = { numcar: dataForm.numcar, numbox: dataForm.numbox };
    history.push(`/conferencia-saida/os-pendente`, dataOs);
  }, [history, dataForm]);

  return (
    <>
      <NavBar caminho="/conferencia-saida" />
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
                  name="numvol"
                  type="number"
                  description="Vol"
                  defaultValue={dataForm.numvol}
                  disabled
                />
                {mostrarProduto ? (
                  <Input
                    icon={FiLock}
                    id="codbarra"
                    name="codbarra"
                    type="number"
                    description="PRODUTO"
                    onChange={(e) => setDun(e.target.value)}
                    onKeyPress={chamaValidaProduto}
                  />
                ) : (
                  <> </>
                )}
              </Form>
              {dataForm.numos ? (
                <Button>
                  <button type="button" onClick={telaDivergencia}>
                    Divergência
                  </button>
                  <button type="button" onClick={telaOsPendente}>
                    O.S. Pendente
                  </button>
                </Button>
              ) : (
                <Button>
                  <button type="button" disabled>
                    Divergência
                  </button>
                  <button type="button" disabled>
                    O.S. Pendente
                  </button>
                </Button>
              )}
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
