import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import ReactLoading from 'react-loading';
import * as Yup from 'yup';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import api from '../../../../../services/api';

import { createMessage } from '../../../../../components/Toast';
import getValidationErrors from '../../../../../utils/getValidationErros';
import NavBar from '../../../../../components/NavBar';
import Input from '../../../../../components/Input';

import {
  Container,
  Content,
  Button,
  Loading,
  ContainerConf,
  ContentConf,
} from './styles';

interface ConfirmadoEnderecado {
  status?: string;
  numbonus: number;
  codprod: number;
  descricao: string;
  qt: number;
  qtavaria: number;
  dtvalidade: string;
}

interface ProdutoConf {
  codprod: number;
  descricao: string;
  qtunit: number;
  qtunitcx: number;
}

interface DTOConferencia {
  numbonus: number;
  codprod: number;
  qtconf: number;
  qtavaria: number;
  dtvalidade: string;
  codfuncconf: number;
}

const ConferenciaBonus: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const numbonus = history.location.state as number;
  const [confirmado, setConfirmado] = useState<ConfirmadoEnderecado[]>([]);
  const [enderecado, setEnderecado] = useState<ConfirmadoEnderecado[]>([]);
  const [produtoConf, setProdutoConf] = useState<ProdutoConf>(
    {} as ProdutoConf,
  );
  const formRefProd = useRef<FormHandles>(null);
  const formRef = useRef<FormHandles>(null);
  const [dtValidade, setDtValidade] = useState('');
  const [qtAvaria, setQtAvaria] = useState(0);
  const [lastro, setLastro] = useState(0);
  const [camada, setCamada] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get<ConfirmadoEnderecado[]>(
        `Entrada/BonusConfirmadoEnderecado/${numbonus}/C`,
      )
      .then((response) => {
        const listaConfirmados = response.data;

        listaConfirmados.map((conf) => {
          const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
          const date = new Date(conf.dtvalidade);

          conf.dtvalidade = date.toLocaleDateString('pt-br', options);
          return conf;
        });

        setConfirmado(listaConfirmados);
        setLoading(false);
        document.getElementById('produto')?.focus();
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: err,
        });
      });

    api
      .get<ConfirmadoEnderecado[]>(
        `Entrada/BonusConfirmadoEnderecado/${numbonus}/E`,
      )
      .then((response) => {
        const listaEnderecados = response.data;

        listaEnderecados.map((end) => {
          const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
          const date = new Date(end.dtvalidade);

          end.dtvalidade = date.toLocaleDateString('pt-br', options);
          return end;
        });

        setEnderecado(listaEnderecados);
        setLoading(false);
        document.getElementById('produto')?.focus();
      })
      .catch((err) => {
        createMessage({
          type: 'error',
          message: err,
        });
      });
  }, [numbonus]);

  const limparTelaConf = useCallback(() => {
    setProdutoConf({} as ProdutoConf);
    formRef.current?.reset();
    formRefProd.current?.reset();
    setTotal(0);
    setDtValidade('');
  }, []);

  const statusConferencia = useCallback((rowData: ConfirmadoEnderecado) => {
    let cor = '';
    let fonte = '';

    if (rowData.status === 'CONCLUIDO') {
      cor = '#00ff00';
    } else if (rowData.status === 'PENDENTE') {
      cor = '#fbff27';
    } else if (rowData.status === 'NÃO INICIADA') {
      cor = '#f40a00';
      fonte = '#fff';
    }

    return (
      <span
        style={{
          padding: '5px 5px',
          borderRadius: '6px',
          fontSize: '10px',
          color: fonte,
          fontWeight: 'bold',
          backgroundColor: cor,
        }}
      >
        {rowData.status}
      </span>
    );
  }, []);

  const buscaProdutoBonus = useCallback(
    async (data) => {
      try {
        formRefProd.current?.setErrors({});

        const schema = Yup.object().shape({
          produto: Yup.string().required('Código obrigatório.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        setLoading(true);

        const response = await api.get<ProdutoConf[]>(
          `Entrada/BuscaProdutoBonus/${numbonus}/${data.produto}`,
        );

        const achouProduto = response.data[0];

        if (achouProduto) {
          setProdutoConf(achouProduto);
          setLoading(false);

          document.getElementById('qtavaria')?.focus();
        } else {
          createMessage({
            type: 'alert',
            message: `Nenhum produto foi encontrado com o código: ${data.produto} no bônus: ${numbonus}.`,
          });

          setLoading(false);
          document.getElementById('produto')?.focus();
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRefProd.current?.setErrors(errors);
          return;
        }

        createMessage({
          type: 'error',
          message: `Erro: ${err.message}`,
        });

        setLoading(false);
        document.getElementById('produto')?.focus();
      }
    },
    [numbonus],
  );

  const calcTotal = useCallback(() => {
    setTotal(lastro * camada);
  }, [lastro, camada]);

  const gravarConferencia = useCallback(
    async (data) => {
      if (window.document.activeElement?.tagName === 'BUTTON') {
        try {
          formRefProd.current?.setErrors({});

          const schema = Yup.object().shape({
            qtavaria: Yup.string().required(
              'Quantidade de avaria obrigatória. ',
            ),
            lastro: Yup.string().required('Lastro obrigatório. '),
            camada: Yup.string().required('Camada obrigatória. '),
            dtvalidade: Yup.string().required('Data de validade obrigatória. '),
          });

          await schema.validate(data, {
            abortEarly: false,
          });

          setLoading(true);

          const dadosConf = {
            numbonus,
            codprod: produtoConf.codprod,
            qtconf: total,
            qtavaria: qtAvaria,
            codfuncconf: user.code,
            dtvalidade: dtValidade,
          } as DTOConferencia;

          const response = await api.post(
            'Entrada/ConfereProdutoBonus',
            dadosConf,
          );

          const salvou = response.data;

          if (salvou) {
            limparTelaConf();
            setLoading(false);
            document.getElementById('produto')?.focus();
          } else {
            createMessage({
              type: 'error',
              message:
                'Não foi possível salvar o registro. Tente novamente mais tarde.',
            });
            setLoading(false);
          }
        } catch (err) {
          if (err instanceof Yup.ValidationError) {
            const errors = getValidationErrors(err);
            let mensagemErro = '';

            if (errors.qtavaria) {
              mensagemErro += errors.qtavaria;
            }
            if (errors.dtvalidade) {
              mensagemErro += errors.dtvalidade;
            }
            if (errors.lastro) {
              mensagemErro += errors.lastro;
            }
            if (errors.camada) {
              mensagemErro += errors.camada;
            }

            createMessage({
              type: 'error',
              message: `Erro(s) encontrado(s): ${mensagemErro}`,
            });

            return;
          }

          createMessage({
            type: 'error',
            message: `Erro: ${err.message}`,
          });

          setLoading(false);
        }
      }
    },
    [
      total,
      dtValidade,
      produtoConf,
      limparTelaConf,
      user.code,
      numbonus,
      qtAvaria,
    ],
  );

  const focusCampo = useCallback((event) => {
    if (event.target.id === 'qtavaria' && event.key === 'Enter') {
      document.getElementById('lastro')?.focus();
    }
    if (event.target.id === 'lastro' && event.key === 'Enter') {
      document.getElementById('camada')?.focus();
    }
    if (event.target.id === 'camada' && event.key === 'Enter') {
      document.getElementById('total')?.focus();
    }
    if (event.target.id === 'total' && event.key === 'Enter') {
      document.getElementById('dtvalidade')?.focus();
    }
  }, []);

  return (
    <>
      <NavBar caminho="/entrada" numBonus={numbonus} />

      <Container>
        {!loading ? (
          <>
            <input id="tab3" type="radio" name="pct" checked />
            <input id="tab2" type="radio" name="pct" checked />
            <input id="tab1" type="radio" name="pct" checked />
            <nav>
              <ul>
                <li className="tab1">
                  <button id="tab1" type="button">
                <label htmlFor="tab1">Conferência</label> {/*eslint-disable-line*/}
                  </button>
                </li>
                <li className="tab2">
                  <button id="tab2" type="button">
                 <label htmlFor="tab2">Confirmados</label> {/*eslint-disable-line*/}
                  </button>
                </li>
                <li className="tab3">
                  <button id="tab3" type="button">
                <label htmlFor="tab3">Endereçados</label> {/*eslint-disable-line*/}
                  </button>
                </li>
              </ul>
            </nav>
            <section>
              <div className="tab1">
                <ContainerConf>
                  <Form ref={formRefProd} onSubmit={buscaProdutoBonus}>
                    <Input
                      icon={FiSearch}
                      type="number"
                      id="produto"
                      name="produto"
                      value={produtoConf.codprod}
                      description="EAN/DUN/CODPROD"
                    />
                  </Form>
                  <ContentConf>
                    <Form ref={formRef} onSubmit={gravarConferencia}>
                      <textarea
                        id="descricao"
                        name="descricao"
                        placeholder="Descrição/Embalagem do Produto"
                        rows={3}
                        defaultValue={produtoConf.descricao}
                        disabled
                      />
                      <ContentConf>
                        <Input
                          percWidth={31}
                          name="qtunit"
                          type="number"
                          defaultValue={produtoConf.qtunit}
                          description="Qt.Unit"
                          disabled
                        />
                        <p />
                        <Input
                          percWidth={33}
                          name="qtunitcx"
                          type="number"
                          defaultValue={produtoConf.qtunitcx}
                          description="Qt.Unit.Cx"
                          disabled
                        />
                        <p />
                        <Input
                          percWidth={33.3}
                          id="qtavaria"
                          name="qtavaria"
                          type="number"
                          onChange={(e) => setQtAvaria(Number(e.target.value))}
                          onKeyPress={(e) => focusCampo(e)}
                          description="Qt.Avaria"
                        />
                        <ContentConf>
                          <Input
                            percWidth={30}
                            id="lastro"
                            name="lastro"
                            type="number"
                            description="Lastro"
                            onChange={(e) => setLastro(Number(e.target.value))}
                            onKeyPress={(e) => focusCampo(e)}
                            onKeyUp={calcTotal}
                          />
                          <p>*</p>
                          <Input
                            percWidth={30}
                            id="camada"
                            name="camada"
                            type="number"
                            description="Camada"
                            onChange={(e) => setCamada(Number(e.target.value))}
                            onKeyPress={(e) => focusCampo(e)}
                            onKeyUp={calcTotal}
                          />
                          <p>=</p>
                          <Input
                            percWidth={30.8}
                            id="total"
                            name="total"
                            type="number"
                            description="Total"
                            value={total}
                            onChange={(e) => setTotal(Number(e.target.value))}
                            onKeyPress={(e) => focusCampo(e)}
                          />
                        </ContentConf>
                        <Input
                          id="dtvalidade"
                          name="dtvalidade"
                          type="date"
                          value={dtValidade}
                          onChange={(e) => setDtValidade(e.target.value)}
                          placeholder="Data de validade"
                        />
                        <div id="detalhe">
                          <button
                            type="button"
                            onClick={() => console.log('Extrato')}
                          >
                            EXTRATO
                          </button>
                          <button type="submit">GRAVAR</button>
                        </div>
                      </ContentConf>
                    </Form>
                  </ContentConf>
                </ContainerConf>
              </div>
              <Content className="tab2">
                <DataTable
                  header="Conferências já confirmadas"
                  value={confirmado}
                  scrollable
                  paginator
                  rows={5}
                  scrollHeight="420px"
                  style={{ width: '100%' }}
                >
                  <Column
                    header="Status"
                    style={{ width: '110px' }}
                    body={statusConferencia}
                  />
                  <Column
                    field="numbonus"
                    header="Bônus"
                    style={{ width: '70px' }}
                  />
                  <Column
                    field="codprod"
                    header="Prod"
                    style={{ width: '70px' }}
                  />
                  <Column
                    field="descricao"
                    header="Descrição"
                    style={{ width: '360px' }}
                  />
                  <Column
                    field="qtentrada"
                    header="Qtd"
                    style={{ width: '60px' }}
                  />
                  <Column
                    field="qtavaria"
                    header="Avaria"
                    style={{ width: '65px' }}
                  />
                  <Column
                    field="dtvalidade"
                    header="Validade"
                    style={{ width: '100px' }}
                  />
                </DataTable>
                <Button>
                  {confirmado.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => console.log('Endereçar confirmados')}
                    >
                      Endereçar
                    </button>
                  ) : (
                    <button type="button" disabled>
                      Endereçar
                    </button>
                  )}
                </Button>
              </Content>
              <Content className="tab3">
                <DataTable
                  header="Conferências já endereçadas"
                  value={enderecado}
                  scrollable
                  paginator
                  rows={7}
                  scrollHeight="420px"
                  style={{ width: '100%' }}
                >
                  <Column
                    field="numbonus"
                    header="Bônus"
                    style={{ width: '70px' }}
                  />
                  <Column
                    field="codprod"
                    header="Prod"
                    style={{ width: '70px' }}
                  />
                  <Column
                    field="descricao"
                    header="Descrição"
                    style={{ width: '350px' }}
                  />
                  <Column
                    field="qtentrada"
                    header="Qtd"
                    style={{ width: '60px' }}
                  />
                  <Column
                    field="qtavaria"
                    header="Avaria"
                    style={{ width: '65px' }}
                  />
                  <Column
                    field="dtvalidade"
                    header="Validade"
                    style={{ width: '100px' }}
                  />
                </DataTable>
              </Content>
            </section>
          </>
        ) : (
          <Loading>
            <ReactLoading
              className="loading"
              type="spokes"
              width="100px"
              color="#c22e2c"
            />
          </Loading>
        )}
      </Container>
    </>
  );
};

export default ConferenciaBonus;
