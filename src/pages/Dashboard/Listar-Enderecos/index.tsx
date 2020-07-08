import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { FiSearch } from 'react-icons/fi';
import ReactLoading from 'react-loading';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { createMessage } from '../../../components/Toast';
import validaSenhaListagem from '../../../utils/validaSenhaListagem';

import Dialog from '../../../components/Dialog';
import NavBar from '../../../components/NavBar';
import Input from '../../../components/Input';

import api from '../../../services/api';

import { Container, Content, Loanding, Button } from './styles';

interface ProdutoPicking {
  numreposicao: number;
  codfilial: number;
  codfunc: number;
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
  erro: string;
  warning: string;
  mensagemErroWarning: string;
}

const ListarEnderecos: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const formRef = useRef<FormHandles>(null);
  const [inputProduto, setInputProduto] = useState(0);
  const [listaProdutos, setListaProdutos] = useState<ProdutoPicking[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarDialog, setMostrarDialog] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      api
        .get<ProdutoPicking[]>(
          `PesquisaProduto/getListaReposicaoAberta/${user.code}`,
        )
        .then((response) => {
          setListaProdutos(response.data);
          setLoading(false);
        });
    } catch (err) {
      createMessage({
        type: 'error',
        message: 'Não foi possivel estabelece conexão com o banco de dados.',
      });
      history.push('/');
    }
  }, [user.code, history]);

  const buscarPicking = useCallback(
    async (codprod) => {
      setLoading(true);
      try {
        const schema = Yup.object().shape({
          codprod: Yup.string().required('Código obrigatório.'),
        });

        await schema.validate(codprod, {
          abortEarly: false,
        });

        const response = await api.get<ProdutoPicking>(
          `PesquisaProduto/getEnderecoProdutoPicking/${inputProduto}/${user.filial}`,
        );

        const pickingProduto = response.data;

        if (pickingProduto.erro === 'N' && pickingProduto.warning === 'N') {
          const produtoRepetido = listaProdutos.find(
            (prod) => prod.codprod === pickingProduto.codprod,
          );

          if (produtoRepetido) {
            listaProdutos.map((prod) => {
              if (prod.codprod === produtoRepetido.codprod) {
                const newQt = prod.qt + pickingProduto.qt;
                prod.qt = newQt;
                return prod;
              }
              return prod;
            });
            formRef.current?.reset();
            setLoading(false);
          } else {
            setListaProdutos([...listaProdutos, pickingProduto]);
            formRef.current?.reset();
            setLoading(false);
          }
        } else {
          createMessage({
            type: 'error',
            message: pickingProduto.mensagemErroWarning,
          });
          formRef.current?.reset();
          setLoading(false);
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          createMessage({
            type: 'error',
            message: 'É necessário bipar um produto para realizar a pesquisa.',
          });
          setLoading(false);
        } else {
          createMessage({
            type: 'error',
            message: `Código informado inválido. Por favor, verifique se o código informado esta correto. ${inputProduto}`,
          });

          formRef.current?.reset();
          setLoading(false);
        }
      }
    },
    [user.filial, listaProdutos, inputProduto],
  );

  const limparListagem = useCallback(
    async (retorno: boolean, x, y, senha: string) => {
      const validaSenha = validaSenhaListagem(listaProdutos[0].numreposicao);

      if (retorno && listaProdutos[0].numreposicao !== 0) {
        if (senha === String(validaSenha)) {
          setLoading(true);

          const response = await api.put(
            `PesquisaProduto/cancelarListagem/${listaProdutos[0].numreposicao}`,
          );

          const cancelado = response.data;

          if (cancelado) {
            setMostrarDialog(false);
            setListaProdutos([]);
            setLoading(false);
            document.getElementById('codprod')?.focus();
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
      } else if (retorno && listaProdutos[0].numreposicao === 0) {
        setMostrarDialog(false);
        setListaProdutos([]);
        document.getElementById('codprod')?.focus();
      } else {
        setMostrarDialog(false);
      }
    },
    [listaProdutos],
  );

  const confimarEnderecos = useCallback(async () => {
    setLoading(true);

    const existeRequisicao = listaProdutos[0].numreposicao;

    if (existeRequisicao === 0) {
      const responseRequisicao = await api.get<number>(
        'PesquisaProduto/proximaRequisicao',
      );

      const numRequisicao = responseRequisicao.data;

      if (numRequisicao !== 0) {
        listaProdutos.map((lista) => {
          lista.numreposicao = numRequisicao;
          lista.codfunc = user.code;
          return lista;
        });

        const response = await api.post(
          'PesquisaProduto/gravaListaEndereco/',
          listaProdutos,
        );

        const enderecoOrdenado = response.data;
        if (enderecoOrdenado) {
          history.push(
            'listar-enderecos/endereco-inventario',
            enderecoOrdenado,
          );
        } else {
          createMessage({
            type: 'error',
            message: 'Erro ao gravar listagem.',
          });
          setLoading(false);
        }
      }
    } else {
      history.push('listar-enderecos/endereco-inventario', listaProdutos);
    }
  }, [history, listaProdutos, user.code]);

  return (
    <>
      {listaProdutos.length > 0 ? (
        <NavBar caminho="dashboard" simpleNav />
      ) : (
        <NavBar caminho="dashboard" />
      )}
      <Container>
        <Form ref={formRef} onSubmit={buscarPicking}>
          <Input
            focus
            icon={FiSearch}
            id="codprod"
            name="codprod"
            type="number"
            description="EAN/DUN/CODPROD"
            onChange={(e) => setInputProduto(Number(e.target.value))}
          />
        </Form>
        <Loanding>
          {!loading ? (
            <>
              {mostrarDialog && listaProdutos[0].numreposicao !== 0 ? (
                <Dialog
                  title={`Limpar lista: ${listaProdutos[0].numreposicao}`}
                  message="Para realizar essa operação, entre com a senha de liberação:"
                  mostraInput
                  executar={limparListagem}
                />
              ) : (
                <>
                  {mostrarDialog && listaProdutos[0].numreposicao === 0 ? (
                    <Dialog
                      title="Limpar lista"
                      message="Você está prestes a limpar a lista. Confirma a operação?"
                      executar={limparListagem}
                    />
                  ) : (
                    <Content>
                      <DataTable
                        header="Picking dos produtos"
                        value={listaProdutos}
                        scrollable
                        paginator
                        rows={4}
                        scrollHeight="500px"
                        style={{ width: '100%' }}
                      >
                        <Column
                          field="rua"
                          header="Rua"
                          style={{ width: '50px' }}
                        />
                        <Column
                          field="predio"
                          header="Préd"
                          style={{ width: '55px' }}
                        />
                        <Column
                          field="nivel"
                          header="Nív"
                          style={{ width: '45px' }}
                        />
                        <Column
                          field="apto"
                          header="Apto"
                          style={{ width: '55px' }}
                        />
                        <Column
                          field="codprod"
                          header="Prod"
                          style={{ width: '55px' }}
                        />
                        <Column
                          field="descricao"
                          header="Descrição"
                          style={{ width: '260px' }}
                        />
                        <Column
                          field="qt"
                          header="Qtd"
                          style={{ width: '55px' }}
                        />
                      </DataTable>
                      {listaProdutos.length > 0 ? (
                        <Button>
                          <button
                            type="button"
                            onClick={() => setMostrarDialog(true)}
                          >
                            Limpar listagem
                          </button>
                          <button type="button" onClick={confimarEnderecos}>
                            Confirmar estocagem
                          </button>
                        </Button>
                      ) : (
                        <Button>
                          <button
                            type="button"
                            onClick={() => setMostrarDialog(true)}
                            disabled
                          >
                            Limpar listagem
                          </button>
                          <button type="button" disabled>
                            Confirmar estocagem
                          </button>
                        </Button>
                      )}
                    </Content>
                  )}
                </>
              )}
            </>
          ) : (
            <ReactLoading
              className="loading"
              type="spokes"
              width="100px"
              color="#c22e2c"
            />
          )}
        </Loanding>
      </Container>
    </>
  );
};

export default ListarEnderecos;
