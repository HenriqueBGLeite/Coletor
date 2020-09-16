import React, { useState, useCallback, useRef } from 'react';
import { FiTruck } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { createMessage } from '../../../components/Toast';
import api from '../../../services/api';
import getValidationErrors from '../../../utils/getValidationErros';

import NavBar from '../../../components/NavBar';
import Input from '../../../components/Input';

import { Container, Content, Loading } from './styles';

interface DTOReconferencia {
  numCar: number;
  pedencia: number;
}

const Reconferencia: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const history = useHistory();
  const [numcar, setNumcar] = useState(0);
  const [loading, setLoading] = useState(false);

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
          `Reconferencia/ValidaCarregamento/${numcar}`,
        );

        const valido = response.data;

        if (valido === 'S') {
          const responsePend = await api.get<number>(
            `Reconferencia/PendenciasCarga/${numcar}`,
          );

          const pendCarga = responsePend.data;

          if (pendCarga > 0) {
            const dataCarga = { numcar, pendencia: pendCarga };
            history.push('/reconferencia/reconferencia-os', dataCarga);
          } else {
            createMessage({
              type: 'alert',
              message: `Nenhuma pendência foi encontrada para o carregamento: ${numcar}`,
            });
            formRef.current?.setFieldValue('numcar', null);
            setLoading(false);
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
    [numcar, history],
  );

  return (
    <>
      <NavBar caminho="dashboard" />
      <Container>
        <Loading>
          {!loading ? (
            <Content>
              <h1>Nº Carregamento</h1>
              <Form ref={formRef} onSubmit={validaCarregamento}>
                <Input
                  focus
                  icon={FiTruck}
                  name="numcar"
                  type="number"
                  description="Informe o carregamento"
                  onChange={(e) => setNumcar(Number(e.target.value))}
                />
              </Form>
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

export default Reconferencia;
