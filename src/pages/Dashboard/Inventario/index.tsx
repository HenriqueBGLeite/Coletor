import React, { useState, useCallback, useRef } from 'react';
import { GoSearch } from 'react-icons/go';
import { useHistory } from 'react-router-dom';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { createMessage } from '../../../components/Toast';
import api from '../../../services/api';
import getValidationErrors from '../../../utils/getValidationErros';

import NavBar from '../../../components/NavBar';
import Input from '../../../components/Input';

import { Container, Content } from './style';

const Inventario: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [endereco, setEndereco] = useState('');
  const history = useHistory();

  const handleEndereco = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          endereco: Yup.string().required('Código obrigatório.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.get(
          `Inventario/getDadosEndereco/${endereco}`,
        );
        const proxEndereco = response.data;
        const { erro, warning } = proxEndereco;

        if (erro === 'N' && warning === 'N') {
          history.push('endereco-inventario', proxEndereco);
        } else {
          createMessage({
            type: 'alert',
            message: 'Código de endereço inválido.',
          });

          formRef.current?.setFieldValue('endereco', null);
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        createMessage({
          type: 'error',
          message: 'Erro na busca do endereço.',
        });

        formRef.current?.setFieldValue('endereco', null);
      }
    },
    [endereco, history],
  );
  return (
    <>
      <NavBar />
      <Container>
        <Content>
          <h1>Onde estou?</h1>
          <Form ref={formRef} onSubmit={handleEndereco}>
            <Input
              percWidth={100}
              icon={GoSearch}
              name="endereco"
              type="number"
              placeholder="Cod.Endereço"
              onChange={(e) => setEndereco(e.target.value)}
            />
          </Form>
        </Content>
      </Container>
    </>
  );
};

export default Inventario;
