import React, { useState, useCallback, useRef } from 'react';
import { FiBox } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { createMessage } from '../../../../../components/Toast';
import getValidationErrors from '../../../../../utils/getValidationErros';

import Input from '../../../../../components/Input';
import NavBar from '../../../../../components/NavBar';

import { Container, Content } from './styles';

const ConferenciaSaida: React.FC = () => {
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const [numBox, setNumBox] = useState('');

  const validaBox = useCallback(
    async (box) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          numbox: Yup.string().required('Código obrigatório.'),
        });

        await schema.validate(box, {
          abortEarly: false,
        });

        if (numBox.length === 9) {
          const posicao = [''];

          /* Armazena os valores caso o box tenha mais que dois digitos (sempre 3 casas).
           * Exemplo: se o box for 1500 - retorna 015
           *          se o box for 150  - retorna 001
           *          se o box for 15   - retorna 000
           */
          posicao[0] = numBox.substring(2, 5);
          /* Armazena os valores finais do box (sempre 2 digitos).
           * Exemplo: se o box for 1500 - retorna 00
           *          se o box for 150  - retorna 50
           *          se o box for 15   - retorna 15
           */
          posicao[1] = numBox.substring(7, 9);

          const numeroBox = Number(posicao[0].concat(posicao[1]));

          history.push('/conferencia-saida/confirma-palete', numeroBox);
        } else {
          createMessage({
            type: 'error',
            message: 'O box informado está inválido.',
          });

          formRef.current?.setFieldValue('numbox', null);
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

        formRef.current?.setFieldValue('numbox', null);
      }
    },
    [history, numBox],
  );

  return (
    <>
      <NavBar caminho="/saida" />
      <Container>
        <Content>
          <h1>Informe o box</h1>
          <Form ref={formRef} onSubmit={validaBox}>
            <Input
              focus
              icon={FiBox}
              name="numbox"
              type="number"
              description="Código do Box"
              onChange={(e) => setNumBox(e.target.value)}
            />
          </Form>
        </Content>
      </Container>
    </>
  );
};

export default ConferenciaSaida;
