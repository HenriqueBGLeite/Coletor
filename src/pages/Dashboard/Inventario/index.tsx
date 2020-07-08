import React, { useState, useCallback, useRef } from 'react';
import { FiMapPin } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { createMessage } from '../../../components/Toast';
import api from '../../../services/api';
import getValidationErrors from '../../../utils/getValidationErros';

import NavBar from '../../../components/NavBar';
import Input from '../../../components/Input';

import { Container, Content } from './styles';

interface OsInventario {
  codendereco: number;
  inventos: number;
  tipoender: string;
  numinvent: number;
  status: string;
  codprod: number;
  ean: number;
  dun: number;
  qtunitcx: number;
  descricao: string;
  qt: number;
  contagem: number;
  deposito: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
}

const Inventario: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const [endereco, setEndereco] = useState('');
  const history = useHistory();
  const location = history.location.pathname;

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

        const response = await api.get<OsInventario[]>(
          `Inventario/getProxOs/${user.code}/${endereco}`,
        );

        const encontrouEndereco = response.data;

        if (encontrouEndereco !== null) {
          history.push(`${location}/endereco-inventario`, encontrouEndereco);
        } else {
          createMessage({
            type: 'alert',
            message: 'Nenhuma O.S. encontrada.',
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
    [endereco, user.code, history, location],
  );

  return (
    <>
      <NavBar caminho="/" />
      <Container>
        <Content>
          <h1>Onde estou?</h1>
          <Form ref={formRef} onSubmit={handleEndereco}>
            <Input
              focus
              icon={FiMapPin}
              name="endereco"
              type="number"
              description="Cód.Endereço"
              onChange={(e) => setEndereco(e.target.value)}
            />
          </Form>
        </Content>
      </Container>
    </>
  );
};

export default Inventario;
