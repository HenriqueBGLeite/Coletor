import React, { useRef, useCallback, useState, useEffect } from 'react';
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
  codendereco: number;
  inventos: number;
  tipoender: string;
  numinvent: number;
  status: string;
  codprod: number;
  descricao: string;
  qt: number;
  contagem: number;
  deposito: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
}

const Endereco: React.FC = () => {
  const history = useHistory();
  const endOrig = useHistory<EnderecoOrig[]>();
  const formRef = useRef<FormHandles>(null);

  const [enderecoDigitado, setEnderecoDigitado] = useState('');
  const [endereco, setEndereco] = useState<EnderecoOrig>();
  const [enderecoOrig, setEnderecoOrig] = useState<EnderecoOrig[]>([]);

  useEffect(() => {
    setEnderecoOrig(endOrig.location.state);
    setEndereco(enderecoOrig[0]);
  }, [endOrig.location.state, enderecoOrig]);

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

        if (endereco?.codendereco !== Number(enderecoDigitado)) {
          formRef.current?.setFieldValue('codEndereco', null);

          createMessage({
            type: 'alert',
            message: 'Código informado não confere com o esperado.',
          });
        } else {
          history.push('conferencia-invetario', endereco);
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
    [endereco, history, enderecoDigitado],
  );

  return (
    <>
      <NavBar numInvent={endereco?.numinvent} />

      <Container>
        <Content>
          <legend>Dados Endereço</legend>
          <div>
            <strong>
              <p>Rua</p>
              <p>{endereco?.rua}</p>
            </strong>
            <strong>
              <p>Prédio</p>
              <p>{endereco?.predio}</p>
            </strong>
            <strong>
              <p>Nível</p>
              <p>{endereco?.nivel}</p>
            </strong>
            <strong>
              <p>Apto</p>
              <p>{endereco?.apto}</p>
            </strong>
          </div>
        </Content>

        <Form ref={formRef} onSubmit={handleValidateAddress}>
          <Input
            focus
            icon={GoSearch}
            percWidth={100}
            type="number"
            name="codEndereco"
            placeholder="Confirme o endereço"
            onChange={(e) => setEnderecoDigitado(e.target.value)}
          />
        </Form>
      </Container>
    </>
  );
};

export default Endereco;
