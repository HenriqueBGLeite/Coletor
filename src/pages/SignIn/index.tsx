import React, { useState, useCallback, useRef } from 'react';
import ReactLoading from 'react-loading';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import { FiUser, FiLock, FiHome } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';
import getValidationErrors from '../../utils/getValidationErros';

import { createMessage } from '../../components/Toast';

import logoImg from '../../assets/logo.svg';
import Input from '../../components/Input';
import Select from '../../components/Select';

import { Container, Content, AnimationContainer, Loanding } from './styles';

interface SignInFormData {
  code: number;
  password: string;
  base: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { signIn } = useAuth();

  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      setLoading(true);
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          code: Yup.string().required('Código obrigatório.'),
          password: Yup.string().required('Senha obrigatória.'),
          base: Yup.string().required('Base obrigatória.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await signIn({
          code: data.code,
          password: data.password,
          base: data.base,
        });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          setLoading(false);
          return;
        }

        createMessage({
          type: 'error',
          message: 'Erro ao realizar o login. Verifique suas credenciais.',
        });

        setLoading(false);
        formRef.current?.setFieldValue('password', null);
      }
    },
    [signIn],
  );

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="Projeto Coletor" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Entre com seus dados</h1>
            <Input
              percWidth={100}
              name="code"
              icon={FiUser}
              type="number"
              placeholder="Código de usuário"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
              percWidth={100}
            />
            <Select name="base" icon={FiHome} percWidth={100}>
              <option value="EPOCA">Época</option>
              <option value="MRURAL">Minas Rural</option>
              <option value="TESTE-EPOCA">Época Teste</option>
            </Select>

            <Loanding>
              {!loading ? (
                <button type="submit">Entrar</button>
              ) : (
                <ReactLoading
                  className="loading"
                  type="spokes"
                  width="100px"
                  color="#c22e2c"
                />
              )}
            </Loanding>
          </Form>
        </AnimationContainer>
      </Content>
    </Container>
  );
};

export default SignIn;
