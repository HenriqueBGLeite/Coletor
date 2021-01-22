import React, { useState, useCallback, useRef } from 'react';
import ReactLoading from 'react-loading';
import { FiBox } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import api from '../../../../../../services/api';
import quebraOs from '../../../../../../utils/quebraOs';

import { createMessage } from '../../../../../../components/Toast';
import getValidationErrors from '../../../../../../utils/getValidationErros';

import Input from '../../../../../../components/Input';
import NavBar from '../../../../../../components/NavBar';

import { Container, Content, Loanding } from './styles';

interface Props {
  boxOrig: number;
  numcar: number;
  numeroPalete: number;
}

const ConfirmaPalete: React.FC = () => {
  const history = useHistory();
  const boxOrig = history.location.state as Props;
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const [numos, setNumOs] = useState('');

  const validaPalete = useCallback(
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

        const { numos: numOs } = quebraOs(numos as string);

        const response = await api.get<
          [{ numcar: number; numpalete: number; numbox: number }]
        >(`ConferenciaSaida/RetornaPaleteOs/${numOs}`);

        const informacaoOs = response.data[0];

        if (informacaoOs !== undefined) {
          if (
            (informacaoOs.numcar > 0 && informacaoOs.numpalete > 0) ||
            informacaoOs.numcar === 0
          ) {
            if (informacaoOs.numbox === Number(boxOrig)) {
              const dataOs = {
                boxOrig: Number(boxOrig),
                numcar: 0,
                numeroPalete: informacaoOs.numpalete,
              } as Props;

              history.push('/conferencia-saida/conferencia-os', dataOs);
            } else {
              createMessage({
                type: 'error',
                message: `O.S. ${numOs} pertence ao box: ${informacaoOs.numbox}.`,
              });

              setLoading(false);
              formRef.current?.setFieldValue('numos', null);
            }
          } else {
            createMessage({
              type: 'error',
              message: 'O.S. não encontrada ou não possui palete.',
            });

            setLoading(false);
            formRef.current?.setFieldValue('numos', null);
          }
        } else {
          createMessage({
            type: 'error',
            message: 'O.S. não encontrada ou não possui palete.',
          });

          setLoading(false);
          formRef.current?.setFieldValue('numos', null);
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        createMessage({
          type: 'error',
          message: err,
        });

        setLoading(false);
        formRef.current?.setFieldValue('numos', null);
      }
    },
    [history, boxOrig, numos],
  );

  return (
    <>
      <NavBar caminho="/conferencia-saida" />
      <Container>
        <Loanding>
          {!loading ? (
            <Content>
              <h1>Informe uma O.S.</h1>
              <Form ref={formRef} onSubmit={validaPalete}>
                <Input
                  focus
                  icon={FiBox}
                  name="numos"
                  type="number"
                  description="Número da O.S."
                  onChange={(e) => setNumOs(e.target.value)}
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
        </Loanding>
      </Container>
    </>
  );
};

export default ConfirmaPalete;
