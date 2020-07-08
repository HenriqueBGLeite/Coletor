import React, { useState, useCallback, useRef } from 'react';
import ReactLoading from 'react-loading';
import { FiLock, FiTruck, FiLayers, FiInbox } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { createMessage } from '../../../../../components/Toast';
import getValidationErrors from '../../../../../utils/getValidationErros';
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
              message: `O.S: ${cabOs.numos} já finalizada. Conferente: ${cabOs.codfuncconf}`,
            });
            setLoading(false);
          } else if (cabOs.tipoos === 20 || cabOs.tipoos === 17) {
            if (cabOs.pendencia > 0) {
              setMostrarProduto(true);
              setDataForm(cabOs);
              setLoading(false);
              setNumOs(undefined);
              document.getElementById('codbarra')?.focus();
            } else {
              createMessage({
                type: 'alert',
                message: `O.S: ${cabOs.numos} já finalizada. Conferente: ${cabOs.codfuncconf}`,
              });
              setDataForm({} as DataForm);
              setLoading(false);
            }
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
                message: `Conferência da O.S: ${numOs} realizada.`,
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
  }, [numos, boxOrig, user.code]);

  const chamaValidaOs = useCallback(
    async (event) => {
      if (event.key === 'Enter') {
        try {
          formRef.current?.setErrors({});

          const schema = Yup.object().shape({
            numos: Yup.string().required('Informe o número da O.S.'),
          });

          await schema.nullable().validate(numos, {
            abortEarly: false,
          });

          validaOs();
        } catch (err) {
          if (err instanceof Yup.ValidationError) {
            const errors = getValidationErrors(err);

            formRef.current?.setErrors(errors);
            setLoading(false);
            return;
          }

          createMessage({
            type: 'error',
            message: err,
          });

          formRef.current?.setFieldValue('numos', null);
          setLoading(false);
        }
      }
    },
    [validaOs, numos],
  );

  const validaProduto = useCallback(async () => {
    setLoading(true);
    try {
      const responseProduto = await api.get(
        `ConferenciaSaida/ProdutoOsVolume/${dun}/${dataForm.numos}/${dataForm.numvol}/${user.filial}`,
      );

      if (responseProduto) {
        createMessage({
          type: 'success',
          message: 'Encontrou produto, será salvo.',
        });
        setLoading(false);
      } else {
        createMessage({
          type: 'error',
          message: 'Nenhum produto encontrado.',
        });
        setLoading(false);
      }
    } catch (err) {
      createMessage({
        type: 'error',
        message: 'Nenhum produto encontrado.',
      });
      setLoading(false);
    }
  }, [dataForm, dun, user]);

  const chamaValidaProduto = useCallback(
    async (event) => {
      if (event.key === 'Enter') {
        try {
          formRef.current?.setErrors({});

          const schema = Yup.object().shape({
            codbarra: Yup.string().required('Favor bipar um produto.'),
          });

          await schema.nullable().validate(dun, {
            abortEarly: false,
          });

          validaProduto();
        } catch (err) {
          if (err instanceof Yup.ValidationError) {
            const errors = getValidationErrors(err);

            formRef.current?.setErrors(errors);
            setLoading(false);
            return;
          }

          createMessage({
            type: 'error',
            message: err,
          });

          formRef.current?.setFieldValue('codbarra', null);
          setLoading(false);
        }
      }
    },
    [validaProduto, dun],
  );

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
                    defaultValue={dataForm.codbarra}
                    onChange={(e) => setDun(e.target.value)}
                    onKeyPress={chamaValidaProduto}
                  />
                ) : (
                  <> </>
                )}
              </Form>

              <Button>
                <button type="button" disabled>
                  Divergência
                </button>
                <button type="button" disabled>
                  O.S. Pendente
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
