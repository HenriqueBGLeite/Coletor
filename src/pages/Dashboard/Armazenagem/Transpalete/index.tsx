import React, { useRef, useCallback, useState, useEffect } from 'react';
import { GoSearch } from 'react-icons/go';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import ReactLoading from 'react-loading';

import api from '../../../../services/api';

import validaSenhaListagem from '../../../../utils/validaSenhaListagem';
import { createMessage } from '../../../../components/Toast';
import { useAuth } from '../../../../hooks/auth';
import getValidationErrors from '../../../../utils/getValidationErros';
import Dialog from '../../../../components/Dialog';
import NavBar from '../../../../components/NavBar';
import Input from '../../../../components/Input';

import { Container, ContainerUma, Content, Loanding, Button } from './style';

interface DTOEndereco {
  codbox: number;
  numbonus: number;
  codendereco: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
}

interface PendBox {
  pendencia: number;
}

const ConfirmarEnderecoTranspalete: React.FC = () => {
  const { usuario } = useAuth();
  const history = useHistory();
  const endOrig = history.location.state as DTOEndereco;

  const formRef = useRef<FormHandles>(null);
  const formRefUma = useRef<FormHandles>(null);
  const [umaDigitada, setUmaDigitada] = useState('');
  const [enderecoDigitado, setEnderecoDigitado] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarDialog, setMostrarDialog] = useState(false);

  const [endereco, setEndereco] = useState<DTOEndereco>();

  useEffect(() => {
    setEndereco(endOrig);
  }, [endOrig]);

  const validaUma = useCallback(
    async (data) => {
      try {
        formRefUma.current?.setErrors({});

        const schema = Yup.object().shape({
          codUma: Yup.string().required('Código obrigatório.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);
        const response = await api.get<DTOEndereco[]>(
          `Armazenagem/BuscarProxOsTranspalete/${umaDigitada}/${endereco?.numbonus}`,
        );

        if (response.data.length > 0) {
          const dataUma = response.data[0];

          if (dataUma.codbox === endereco?.codbox) {
            setEndereco(response.data[0]);
            setLoading(false);
          } else {
            createMessage({
              type: 'alert',
              message: `U.M.A. pertence ao box: ${dataUma.codbox}. Você está trabalhando no box: ${endereco?.codbox}.`,
            });
            setLoading(false);
          }
        } else {
          createMessage({
            type: 'alert',
            message:
              'Nenhum registro encontrado para essa U.M.A. ou já conferida.',
          });
          setLoading(false);
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRefUma.current?.setErrors(errors);

          return;
        }

        createMessage({
          type: 'error',
          message: `Erro: ${err.message}`,
        });

        formRefUma.current?.setFieldValue('codUma', null);
        setLoading(false);
      }
    },
    [umaDigitada, endereco],
  );

  const validaEndereco = useCallback(
    async (data) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          codEndereco: Yup.string().required('Código obrigatório.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);
        const response = await api.put<boolean>(
          `Armazenagem/RegistraEndOrig/${umaDigitada}/${enderecoDigitado}/${usuario.code}`,
        );

        const mesmaRua = response.data;

        if (mesmaRua) {
          const responsePend = await api.get<PendBox[]>(
            `Armazenagem/BuscaPendenciaBox/${endereco?.numbonus}`,
          );

          const pendenciaBox = responsePend.data[0].pendencia;

          if (pendenciaBox === 0) {
            const responseBox = await api.get<DTOEndereco[]>(
              `Armazenagem/BuscarProxBox/${usuario.code}`,
            );

            if (responseBox.data.length > 0) {
              setEndereco(responseBox.data[0]);
              createMessage({
                type: 'success',
                message: `Finalizado processo no box: ${endOrig.codbox}. Usuário redirecionado para o box: ${responseBox.data[0].codbox}`,
              });
            } else {
              history.push('/armazenagem');
              createMessage({
                type: 'alert',
                message: 'Nenhum bônus confirmado foi encontrado.',
              });
            }
          } else {
            formRef.current?.reset();
            formRefUma.current?.reset();
            setEndereco(endOrig);
            setLoading(false);
          }
        } else {
          createMessage({
            type: 'alert',
            message: `Verifique se está na rua correta para deixar a U.M.A. Rua correta: (${endereco?.rua}).`,
          });
          formRef.current?.setFieldValue('codEndereco', null);
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

        formRef.current?.setFieldValue('codEndereco', null);
        setLoading(false);
      }
    },
    [usuario.code, umaDigitada, enderecoDigitado, endOrig, endereco, history],
  );

  const cancelarOpTranspalete = useCallback(
    async (retorno: boolean, x, y, senha: string) => {
      const validaSenha = validaSenhaListagem(endereco?.numbonus as number);

      if (retorno) {
        if (senha === String(validaSenha)) {
          setLoading(true);
          const response = await api.put(
            `Armazenagem/CancelarOpTranspalete/${endereco?.numbonus}`,
          );

          const cancelado = response.data;

          if (cancelado) {
            history.push('/armazenagem');
          } else {
            createMessage({
              type: 'error',
              message:
                'Erro ao cancelar mov. horizontal, tente novamente mais tarde.',
            });
            setLoading(false);
          }
        } else {
          createMessage({
            type: 'alert',
            message: 'Senha incorreta. Processo abortado.',
          });
          setMostrarDialog(false);
        }
      } else {
        setMostrarDialog(false);
      }
    },
    [endereco, history],
  );

  return (
    <>
      <NavBar caminho="/armazenagem" numBox={endereco?.codbox} simpleNav />
      <Loanding>
        {!loading ? (
          <Container>
            {mostrarDialog ? (
              <Dialog
                title={`Cancelar mov. horizontal, bônus: ${endereco?.numbonus}?`}
                message="Para realizar essa operação, entre com a senha de liberação:"
                mostraInput
                executar={cancelarOpTranspalete}
              />
            ) : (
              <> </>
            )}
            {endereco && endereco.codendereco ? (
              <>
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
                <Form ref={formRef} onSubmit={validaEndereco}>
                  <Input
                    focus
                    icon={GoSearch}
                    type="number"
                    name="codEndereco"
                    description="Código do endereço"
                    onChange={(e) => setEnderecoDigitado(e.target.value)}
                  />
                </Form>
                <Button>
                  <button type="button" onClick={() => setMostrarDialog(true)}>
                    Abandonar mov. horizontal
                  </button>
                </Button>
              </>
            ) : (
              <ContainerUma>
                <Form ref={formRefUma} onSubmit={validaUma}>
                  <Input
                    focus
                    icon={GoSearch}
                    type="number"
                    name="codUma"
                    description="Código U.M.A"
                    onChange={(e) => setUmaDigitada(e.target.value)}
                  />
                </Form>
              </ContainerUma>
            )}
          </Container>
        ) : (
          <ReactLoading
            className="loading"
            type="spokes"
            width="100px"
            color="#c22e2c"
          />
        )}
      </Loanding>
    </>
  );
};

export default ConfirmarEnderecoTranspalete;
