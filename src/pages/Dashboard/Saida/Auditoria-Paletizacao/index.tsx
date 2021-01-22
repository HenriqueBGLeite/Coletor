import React, { useState, useCallback, useRef } from 'react';
import { FiTruck } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { createMessage } from '../../../../components/Toast';
import Dialog from '../../../../components/Dialog';
import api from '../../../../services/api';
import getValidationErrors from '../../../../utils/getValidationErros';

import NavBar from '../../../../components/NavBar';
import Input from '../../../../components/Input';

import { Container, Content, Loading } from './styles';

const AuditoriaPaletizacao: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const proxTela = history.location.state as string;
  const [numcar, setNumcar] = useState(0);
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const reabreAuditoria = useCallback(
    async (retorno: boolean) => {
      if (retorno) {
        setLoading(true);

        await api
          .put(`AuditoriaPaletiza/ReabreAuditoriaCarga/${numcar}`)
          .then(async (response) => {
            const reabriu = response.data;

            if (reabriu) {
              const responsePend = await api.get<number>(
                `AuditoriaPaletiza/PendenciasCarga/${numcar}/${proxTela}`,
              );

              const pendCarga = responsePend.data;

              const dataCarga = { numcar, pendencia: pendCarga, proxTela };
              history.push('/auditoria-paletizacao/conferencia', dataCarga);
            }
          })
          .catch((err) => {
            createMessage({
              type: 'error',
              message: `Erro: ${err.message}`,
            });

            formRef.current?.setFieldValue('numcar', null);
            setLoading(false);
          });
      } else {
        setDialog(false);
        document.getElementById('numcar')?.focus();
      }
    },
    [history, numcar, proxTela],
  );

  const validaCarregamento = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          numcar: Yup.string().required('Código obrigatório.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);
        const response = await api.get<string>(
          `AuditoriaPaletiza/ValidaCarregamento/${numcar}`,
        );

        const valido = response.data;

        if (valido === 'S') {
          const responsePend = await api.get<number>(
            `AuditoriaPaletiza/PendenciasCarga/${numcar}/${proxTela}`,
          );

          const pendCarga = responsePend.data;

          if (pendCarga > 0) {
            const dataCarga = { numcar, pendencia: pendCarga, proxTela };
            history.push('/auditoria-paletizacao/conferencia', dataCarga);
          } else {
            setLoading(false);
            setDialog(true);
          }
        } else {
          createMessage({
            type: 'error',
            message: `Carregamento: ${numcar} inválido.`,
          });
          formRef.current?.setFieldValue('numcar', null);
          setLoading(false);
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          return;
        }

        createMessage({
          type: 'error',
          message: `Erro: ${err.message}`,
        });

        formRef.current?.setFieldValue('numcar', null);
        setLoading(false);
      }
    },
    [numcar, history, proxTela],
  );

  return (
    <>
      <NavBar caminho="/saida" />
      <Container>
        <Loading>
          {!loading ? (
            <Content>
              <h1>Nº Carregamento</h1>
              <Form ref={formRef} onSubmit={validaCarregamento}>
                <Input
                  focus
                  icon={FiTruck}
                  id="numcar"
                  name="numcar"
                  type="number"
                  description="Informe o carregamento"
                  onChange={(e) => setNumcar(Number(e.target.value))}
                />
              </Form>
              {dialog ? (
                <Dialog
                  title="Auditoria Carga"
                  message={`Nenhuma pendência foi encontrada para o carregamento: ${numcar}, deseja reabrir a auditoria?`}
                  executar={reabreAuditoria}
                />
              ) : (
                <> </>
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
        </Loading>
      </Container>
    </>
  );
};

export default AuditoriaPaletizacao;
