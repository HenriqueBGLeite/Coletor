import React, { useRef, useCallback, useState } from 'react';
import { GoSearch } from 'react-icons/go';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { createMessage } from '../../../../../components/Toast';
import getValidationErrors from '../../../../../utils/getValidationErros';
import NavBar from '../../../../../components/NavBar';
import Input from '../../../../../components/Input';

import { Container, Content } from './style';

interface EnderecoOrig {
  codigo: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
}

const Endereco: React.FC = () => {
  const history = useHistory<EnderecoOrig>();
  const formRef = useRef<FormHandles>(null);
  const [endereco, setEndereco] = useState('');
  const enderecoOrig = history.location.state;

  const handleValidateAddress = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          codEndereco: Yup.string().required('Código obrigatório.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (Number(endereco) !== enderecoOrig.codigo) {
          formRef.current?.setFieldValue('codEndereco', null);

          createMessage({
            type: 'alert',
            message: 'Código informado não confere com o esperado.',
          });
        } else {
          history.push('conferencia-invetario');
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

        formRef.current?.setFieldValue('codEndereco', null);
      }
    },
    [endereco, enderecoOrig, history],
  );

  return (
    <>
      <NavBar />

      <Container>
        <Content>
          <legend>Dados Endereço</legend>
          <div>
            <strong>Rua: {enderecoOrig.rua}</strong>
            <strong>Prédio: {enderecoOrig.predio}</strong>
            <strong>Nível: {enderecoOrig.nivel}</strong>
            <strong>Apto: {enderecoOrig.apto}</strong>
          </div>
        </Content>

        <Form ref={formRef} onSubmit={handleValidateAddress}>
          <Input
            icon={GoSearch}
            percWidth={100}
            type="number"
            name="codEndereco"
            placeholder="Confirme o endereço"
            onChange={(e) => setEndereco(e.target.value)}
          />
        </Form>
      </Container>
    </>
  );
};

export default Endereco;
