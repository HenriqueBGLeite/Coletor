import React, { useState, useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import ReactLoading from 'react-loading';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { createMessage } from '../../../../components/Toast';
import { useAuth } from '../../../../hooks/auth';
import api from '../../../../services/api';
import getValidationErrors from '../../../../utils/getValidationErros';
import quebraOs from '../../../../utils/quebraOs';

import NavBar from '../../../../components/NavBar';
import Input from '../../../../components/Input';

import { Container, Content, Loading } from './styles';

const CaixaPlastica: React.FC = () => {
  const { usuario } = useAuth();
  const formRef = useRef<FormHandles>(null);
  const [numos, setNumos] = useState<string | null>();
  const [loading, setLoading] = useState(false);

  const validaOsCxPlastica = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          numos: Yup.string().required('Código obrigatório.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);

        const { numos: numOs, numvol: numVol } = quebraOs(numos as string);

        const response = await api.put(
          `Entrada/ConfereCxPlastica/${numOs}/${numVol}/${usuario.code}`,
        );

        const conferiu = response.data;

        if (conferiu === 'S') {
          formRef.current?.setFieldValue('numos', null);
          setLoading(false);
        } else {
          createMessage({
            type: 'error',
            message: conferiu,
          });

          formRef.current?.setFieldValue('numos', null);
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

        formRef.current?.setFieldValue('numos', null);
        setLoading(false);
      }
    },
    [numos, usuario],
  );

  return (
    <>
      <NavBar caminho="/entrada" />
      <Container>
        <Loading>
          {!loading ? (
            <Content>
              <h1>Conf. Caixa Plástica</h1>
              <Form ref={formRef} onSubmit={validaOsCxPlastica}>
                <Input
                  focus
                  icon={FiLock}
                  name="numos"
                  type="number"
                  description="NÚMERO DA O.S."
                  onChange={(e) => setNumos(e.target.value)}
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

export default CaixaPlastica;
