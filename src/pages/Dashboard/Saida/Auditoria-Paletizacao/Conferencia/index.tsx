import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FiLock, FiShoppingBag } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import ReactLoading from 'react-loading';

import quebraOs from '../../../../../utils/quebraOs';

import api from '../../../../../services/api';

import { createMessage } from '../../../../../components/Toast';
import NavBar from '../../../../../components/NavBar';
import Input from '../../../../../components/Input';

import { Container, Content, Loading, Button } from './styles';

interface DTOCarga {
  numcar: number;
  pendencia: number;
  proxTela: string;
}

interface DTOCliente {
  letra: string;
  palete: number;
}

interface DataForm {
  numcar: number;
  numbox: number;
  numpalete: number;
  numos: number | undefined;
  numvol: number;
  tipoos: number;
  pertencecarga: string;
  reconferido: string;
  paletizado: string;
  osaberta: number;
}

const Conferencia: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const dadosCarga = history.location.state as DTOCarga;
  const formRef = useRef<FormHandles>(null);
  const [dataForm, setDataForm] = useState<DataForm>({} as DataForm);
  const [proxCli, setProxCli] = useState<DTOCliente>({} as DTOCliente);
  const [numos, setNumOs] = useState<string | null>();
  const [dun, setDun] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    api
      .get<DTOCliente[]>(
        `AuditoriaPaletiza/ProximoCliente/${dadosCarga.numcar}/${dadosCarga.proxTela}`,
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
  }, [dadosCarga]);

  const limpaTela = useCallback(() => {
    formRef.current?.setFieldValue('numos', null);
    formRef.current?.setFieldValue('volume', null);
  }, []);

  const validaOs = useCallback(async () => {
    try {
      const { numos: numOs, numvol: numVol } = quebraOs(numos as string);

      const response = await api.get<DataForm[]>(
        `AuditoriaPaletiza/CabecalhoOs/${dadosCarga.numcar}/${numOs}/${numVol}/${user.filial}`,
      );

      const cabOs = response.data[0];

      if (cabOs) {
        if (cabOs.pertencecarga === 'S') {
          if (cabOs.osaberta === 0) {
            if (cabOs.reconferido === 'N' && cabOs.paletizado === 'N') {
              if (dadosCarga.proxTela === 'P') {
                if (cabOs.numpalete === proxCli.palete) {
                  setDataForm(cabOs);
                  await api
                    .put(
                      `AuditoriaPaletiza/PaletizaVolume/${cabOs.numos}/${cabOs.numvol}/${cabOs.numpalete}/${user.code}`,
                    )
                    .then(() => {
                      limpaTela();
                      setLoading(false);
                    })
                    .catch((err) => {
                      createMessage({
                        type: 'error',
                        message: `Erro: ${err.message}`,
                      });
                      limpaTela();
                      setLoading(false);
                    });
                } else {
                  createMessage({
                    type: 'alert',
                    message: `O.S: ${numOs}/${numVol} não pertence ao palete: ${proxCli.palete}.`,
                  });
                  limpaTela();
                  setLoading(false);
                }
              } else {
                setDataForm(cabOs);
                setLoading(false);
                setNumOs(undefined);
                document.getElementById('codbarra')?.focus();
              }
            } else {
              if (cabOs.reconferido === 'S') {
                createMessage({
                  type: 'alert',
                  message: `O.S: ${numOs}/${numVol} do palete: ${cabOs.numpalete} já foi reconferido.`,
                });
              } else {
                createMessage({
                  type: 'alert',
                  message: `O.S: ${numOs}/${numVol} do palete: ${cabOs.numpalete} já foi paletizada.`,
                });
              }
              limpaTela();
              setLoading(false);
            }
          } else {
            createMessage({
              type: 'alert',
              message: 'Apenas O.S. finalizadas podem ser reconferidas',
            });

            limpaTela();
            setLoading(false);
          }
        } else {
          createMessage({
            type: 'alert',
            message: `O.S: ${numOs}/${numVol} não pertence ao carregamento: ${dadosCarga.numcar}`,
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
    } catch (err) {
      createMessage({
        type: 'error',
        message: `Erro: ${err.message}`,
      });

      limpaTela();
      setLoading(false);
    }
  }, [numos, user, dadosCarga, limpaTela, proxCli]);

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
    console.log('teste');
  }, []);

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
    console.log('divergencia');
  }, []);

  const telaPendencia = useCallback(() => {
    history.push('/auditoria-paletizacao/pendencia', dadosCarga);
  }, [history, dadosCarga]);

  return (
    <>
      <NavBar
        caminho="/auditoria-paletizacao"
        numCarregamento={dadosCarga.numcar}
      />
      <Container>
        <Content>
          <h1>
            CLIENTE: {proxCli.letra} - PALETE: {proxCli.palete}
          </h1>
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
            {dadosCarga.proxTela === 'P' ? (
              <> </>
            ) : (
              <>
                {dun ? (
                  <Input
                    icon={FiShoppingBag}
                    name="codbarra"
                    type="number"
                    description="PRODUTO"
                    defaultValue={dun}
                    onChange={(e) => setDun(Number(e.target.value))}
                    onKeyPress={chamaValidaProduto}
                  />
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
            )}
          </Form>
          <Loading>
            {!loading ? (
              <Button>
                {dataForm.numos || numos ? (
                  <button type="button" onClick={telaDivergencia}>
                    <p>Divergência</p>
                    <p>(0)</p>
                  </button>
                ) : (
                  <button type="button" disabled>
                    <p>Divergência</p>
                    <p>(0)</p>
                  </button>
                )}
                <button type="button" onClick={telaPendencia}>
                  <p>Cli. Pend. Palete</p>
                  <p>({dadosCarga.pendencia})</p>
                </button>
              </Button>
            ) : (
              <ReactLoading
                className="loading"
                type="spokes"
                width="100px"
                color="#c22e2c"
              />
            )}
          </Loading>
        </Content>
      </Container>
    </>
  );
};

export default Conferencia;
