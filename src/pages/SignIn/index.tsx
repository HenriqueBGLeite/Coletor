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
      if (document.activeElement?.tagName === 'BUTTON') {
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
            message: `Erro ao realizar Login. ${err.message}`,
          });

          formRef.current?.setFieldValue('password', null);
          document.getElementById('password')?.focus();
          setLoading(false);
        }
      }
    },
    [signIn],
  );

  const focusCampo = useCallback((event) => {
    if (event.target.id === 'code' && event.key === 'Enter') {
      document.getElementById('password')?.focus();
    }
    if (event.target.id === 'password' && event.key === 'Enter') {
      document.getElementById('base')?.focus();
    }
  }, []);
  return (
    <Container>
      <Content>
        <AnimationContainer>
          <p>Versão: 07.10.20.01</p>
          <img src={logoImg} alt="Projeto Coletor" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input
              focus
              id="code"
              name="code"
              icon={FiUser}
              type="number"
              description="Código de usuário"
              onKeyPress={(e) => focusCampo(e)}
            />
            <Input
              id="password"
              name="password"
              icon={FiLock}
              type="password"
              description="Senha do usuário"
              onKeyPress={(e) => focusCampo(e)}
            />
            <Select id="base" name="base" icon={FiHome}>
              <option value="">Selecione sua base...</option>
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
