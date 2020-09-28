import React, { useRef, useCallback, useState, useEffect } from 'react';
import { GoSearch } from 'react-icons/go';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import ReactLoading from 'react-loading';

import api from '../../../../../services/api';

import validaSenhaListagem from '../../../../../utils/validaSenhaListagem';
import { createMessage } from '../../../../../components/Toast';
import getValidationErrors from '../../../../../utils/getValidationErros';
import Dialog from '../../../../../components/Dialog';
import NavBar from '../../../../../components/NavBar';
import Input from '../../../../../components/Input';

import { Container, Content, Loading, Button } from './style';

interface ListaEndereco {
  numreposicao: number;
  codfilial: number;
  codprod: number;
  qt: number;
  descricao: string;
  codendereco: number;
  deposito: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
  ean: number;
  dun: number;
  qtunitcx: number;
}

const ConfirmarEndereco: React.FC = () => {
  const history = useHistory();
  const endOrig = history.location.state as ListaEndereco[];

  const formRef = useRef<FormHandles>(null);
  const [enderecoDigitado, setEnderecoDigitado] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarDialog, setMostrarDialog] = useState(false);

  const [endereco, setEndereco] = useState<ListaEndereco>();
  const [listaEndereco, setListaEndereco] = useState<ListaEndereco[]>([]);

  useEffect(() => {
    setListaEndereco(endOrig);
    setEndereco(listaEndereco[0]);
  }, [endOrig, listaEndereco]);

  const validaProxEndereco = useCallback(async () => {
    if (endereco) {
      setLoading(true);

      const response = await api.put(
        'PesquisaProduto/finalizaConfListagem',
        endereco,
      );

      const finalizouProdLista = response.data;

      if (finalizouProdLista) {
        const excludeEndereco = listaEndereco.findIndex(
          (end) => end.codendereco === endereco.codendereco,
        );

        if (excludeEndereco >= 0) {
          const filteredEndereco = listaEndereco.filter(
            (end) => end.codendereco !== endereco.codendereco,
          );

          if (filteredEndereco.length > 0) {
            formRef.current?.setFieldValue('codEndereco', null);
            history.push('endereco-inventario', filteredEndereco);
          } else {
            history.push('/listar-enderecos');
          }
        }
        setLoading(false);
      } else {
        createMessage({
          type: 'error',
          message: 'Erro ao finalizar a confirmação do produto.',
        });
        setLoading(false);
      }
    }
  }, [endereco, listaEndereco, history]);

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
          validaProxEndereco();
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
    [endereco, enderecoDigitado, validaProxEndereco],
  );

  const cancelarEstocagem = useCallback(
    async (retorno: boolean, x, y, senha: string) => {
      const validaSenha = validaSenhaListagem(listaEndereco[0].numreposicao);

      if (retorno) {
        if (senha === String(validaSenha)) {
          setLoading(true);
          const response = await api.put(
            `PesquisaProduto/cancelarListagem/${endereco?.numreposicao}`,
          );
          const cancelado = response.data;
          if (cancelado) {
            history.push('/listar-enderecos');
          } else {
            createMessage({
              type: 'error',
              message:
                'Erro ao cancelar requisição, tente novamente mais tarde.',
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
    [endereco, history, listaEndereco],
  );

  return (
    <>
      <NavBar caminho="/listar-enderecos" simpleNav />
      <Loading>
        {!loading ? (
          <Container>
            {mostrarDialog ? (
              <Dialog
                title={`Cancelar estocagem da lista: ${endereco?.numreposicao}`}
                message="Para realizar essa operação, entre com a senha de liberação:"
                mostraInput
                executar={cancelarEstocagem}
              />
            ) : (
              <> </>
            )}
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
                type="number"
                name="codEndereco"
                description="Confirme o endereço"
                onChange={(e) => setEnderecoDigitado(e.target.value)}
              />
            </Form>
            <Button>
              <button type="button" onClick={() => setMostrarDialog(true)}>
                Desistir da estocagem
              </button>
            </Button>
          </Container>
        ) : (
          <ReactLoading
            className="loading"
            type="spokes"
            width="100px"
            color="#c22e2c"
          />
        )}
      </Loading>
    </>
  );
};

export default ConfirmarEndereco;
