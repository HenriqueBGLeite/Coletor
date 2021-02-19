import React, { useEffect, useState, useCallback, useRef } from 'react';
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

interface BaseLista {
  value: string;
  label: string;
}

const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const base = localStorage.getItem('@EpocaColetor:base');
  const { signIn } = useAuth();
  const [baseLista, setBaseLista] = useState<BaseLista[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBaseLista([
      {
        value: 'EPOCA',
        label: 'EPOCA',
      },
      {
        value: 'MRURAL',
        label: 'MINAS RURAL',
      },
      {
        value: 'EPOCATST',
        label: 'EPOCA TESTE',
      },
    ]);
  }, []);

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
      document.getElementById('entrar')?.focus();
    }
  }, []);

  return (
    <Container>
      <Content>
        <AnimationContainer>
          <p>Versão: 17.02.21.01</p>
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
              {baseLista
                .filter((ba) => ba.value === String(base))
                .map((ba) => (
                  <option key={ba.value} value={ba.value}>
                    {ba.label}
                  </option>
                ))}
              {baseLista
                .filter((ba) => ba.value !== String(base))
                .map((ba) => (
                  <option key={ba.value} value={ba.value}>
                    {ba.label}
                  </option>
                ))}
            </Select>

            <Loanding>
              {!loading ? (
                <button id="entrar" type="submit">
                  Entrar
                </button>
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
