import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { createMessage } from '../../../../../../components/Toast';
import api from '../../../../../../services/api';
import NavBar from '../../../../../../components/NavBar';
import Dialog from '../../../../../../components/Dialog';

import { Content, Button, Loanding } from './styles';

interface DataExtrato {
  codprod: number;
  descricao: string;
  datavalidade: string;
  qt: number;
  qtavaria: number;
  funcconf: string;
  lastro: number;
  camada: number;
}

const ExtratoBonus: React.FC = () => {
  const history = useHistory();
  const numbonus = history.location.state as number;
  const [extrato, setExtrato] = useState<DataExtrato[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarDialogProd, setMostrarDialogProd] = useState(false);
  const [mostrarDialogBonus, setMostrarDialogBonus] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<DataExtrato>(
    {} as DataExtrato,
  );

  useEffect(() => {
    setLoading(true);
    async function loadDiverg(): Promise<void> {
      const response = await api.get<DataExtrato[]>(
        `Entrada/ExtratoBonus/${numbonus}`,
      );

      const listaProduto = response.data;

      setExtrato(listaProduto);
      setLoading(false);
    }

    loadDiverg();
  }, [numbonus]);

  const reconferirProduto = useCallback(
    async (retorno: boolean) => {
      if (retorno) {
        try {
          setLoading(true);
          const response = await api.put(
            `Entrada/ReabreConfItemBonus${numbonus}/${produtoSelecionado.codprod}`,
          );

          const alterou = response.data;

          if (alterou) {
            history.push('/entrada/conferencia-entrada', numbonus);
          } else {
            createMessage({
              type: 'error',
              message: `Não foi possivel reabrir a conferência do item: ${produtoSelecionado.codprod} do bônus: ${numbonus}.`,
            });

            setLoading(false);
            setMostrarDialogProd(false);
          }
        } catch (err) {
          createMessage({
            type: 'error',
            message: `Erro: ${err.message}`,
          });
          setLoading(false);
          setMostrarDialogProd(false);
        }
      } else {
        createMessage({
          type: 'info',
          message: 'Operação abortada pelo usuário.',
        });

        setProdutoSelecionado({} as DataExtrato);
        setMostrarDialogProd(false);
      }
    },
    [history, numbonus, produtoSelecionado],
  );

  const reconferirBonus = useCallback(
    async (retorno: boolean) => {
      if (retorno) {
        try {
          setLoading(true);
          const response = await api.put(`Entrada/ReabreConfBonus${numbonus}`);

          const reabriu = response.data;

          if (reabriu) {
            history.push('/entrada/conferencia-entrada', numbonus);
          } else {
            createMessage({
              type: 'error',
              message: `Não foi possivel reabrir a conferência do bônus: ${numbonus}.`,
            });
            setMostrarDialogBonus(false);
            setLoading(false);
          }
        } catch (err) {
          createMessage({
            type: 'error',
            message: `Erro: ${err.message}`,
          });
          setMostrarDialogBonus(false);
          setLoading(false);
        }
      } else {
        createMessage({
          type: 'info',
          message: 'Operação abortada pelo usuário.',
        });

        setMostrarDialogBonus(false);
      }
    },
    [history, numbonus],
  );

  return (
    <>
      <NavBar
        caminho="/entrada/conferencia-entrada"
        numBonus={numbonus}
        params={numbonus}
      />
      <Loanding>
        {!loading ? (
          <Content>
            <DataTable
              header="Itens do Bônus"
              value={extrato}
              selectionMode="single"
              selection={produtoSelecionado}
              onSelectionChange={(e) => setProdutoSelecionado(e.value)}
              scrollable
              paginator
              rows={7}
              scrollHeight="500px"
              style={{ width: '100%' }}
            >
              <Column field="codprod" header="Prod" style={{ width: '70px' }} />
              <Column
                field="descricao"
                header="Descrição"
                style={{ width: '360px' }}
              />
              <Column
                field="lastro"
                header="Lastro"
                style={{ width: '65px' }}
              />
              <Column
                field="camada"
                header="Camada"
                style={{ width: '75px' }}
              />
              <Column field="qt" header="Qtd" style={{ width: '60px' }} />
              <Column
                field="qtavaria"
                header="Avaria"
                style={{ width: '65px' }}
              />
              <Column
                field="datavalidade"
                header="Validade"
                style={{ width: '100px' }}
              />

              <Column
                field="funcconf"
                header="Conferente"
                style={{ width: '360px' }}
              />
            </DataTable>
            {mostrarDialogProd ? (
              <Dialog
                title="Reconferir Produto"
                message={`Deseja realmente reabrir a conferência do produto: ${produtoSelecionado?.codprod}`}
                executar={reconferirProduto}
              />
            ) : (
              <Button>
                {produtoSelecionado && produtoSelecionado.codprod ? (
                  <button
                    type="button"
                    onClick={() => setMostrarDialogProd(true)}
                  >
                    Reconferir Prod.
                  </button>
                ) : (
                  <button type="button" disabled>
                    Reconferir Prod.
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setMostrarDialogBonus(true)}
                >
                  Reconferir Bônus
                </button>
              </Button>
            )}
            {mostrarDialogBonus ? (
              <Dialog
                title="Reconferir Bônus"
                message={`Deseja realmente reabrir a conferência do bônus: ${numbonus}`}
                executar={reconferirBonus}
              />
            ) : (
              <> </>
            )}
          </Content>
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

export default ExtratoBonus;
