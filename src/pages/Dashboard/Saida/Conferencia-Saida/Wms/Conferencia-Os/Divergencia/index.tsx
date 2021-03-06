import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { createMessage } from '../../../../../../../components/Toast';
import api from '../../../../../../../services/api';
import NavBar from '../../../../../../../components/NavBar';
import Dialog from '../../../../../../../components/Dialog';

import { Content, Button, Loanding } from './styles';

interface DataOs {
  numcar: number;
  numos: number;
  numbox: number;
  qtPend: number;
  numeroPalete: number;
}

interface DataOsRetorno {
  boxOrig: number;
  numcar: number;
  qtPend: number;
}

interface DataDivergencia {
  letra: string;
  numpalete: number;
  numos: number;
  numvol: number;
  codprod: number;
  descricao: string;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
  tipoos: string;
  separador: string;
}

const Divergencia: React.FC = () => {
  const history = useHistory();
  const dataOs = history.location.state as DataOs;
  const dataOsRetorno = history.location.state as DataOsRetorno;
  const [divergencia, setDivergencia] = useState<DataDivergencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarDialogProd, setMostrarDialogProd] = useState(false);
  const [mostrarDialogOs, setMostrarDialogOs] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<DataDivergencia>(
    {} as DataDivergencia,
  );

  useEffect(() => {
    setLoading(true);
    async function loadDiverg(): Promise<void> {
      try {
        const response = await api.get<DataDivergencia[]>(
          `ConferenciaSaida/DivergenciaOs/${dataOs.numos}`,
        );

        setDivergencia(response.data);
        setLoading(false);
      } catch (err) {
        createMessage({
          type: 'error',
          message: `Error: ${err.message}`,
        });
        setLoading(false);
      }
    }

    loadDiverg();
  }, [dataOs.numos]);

  const reconferirProduto = useCallback(
    async (retorno: boolean) => {
      if (produtoSelecionado?.codprod) {
        if (retorno) {
          setLoading(true);
          const response = await api.put(
            `ConferenciaSaida/ReabreConferenciaProduto/${produtoSelecionado.numos}/${produtoSelecionado.codprod}`,
          );

          if (response.data) {
            history.push('/conferencia-saida/conferencia-os', dataOsRetorno);
          } else {
            createMessage({
              type: 'error',
              message: `Erro ao tentar reabrir conferência da O.S: ${produtoSelecionado.numos} produto: ${produtoSelecionado.codprod}.`,
            });
            setLoading(false);
            setMostrarDialogProd(false);
          }
        } else {
          createMessage({
            type: 'info',
            message: 'Operação cancelada pelo usuário.',
          });
          setMostrarDialogProd(false);
        }
      } else {
        createMessage({
          type: 'error',
          message: 'Operação cancelada. Nenhum produto selecionado.',
        });
        setMostrarDialogProd(false);
      }
    },
    [produtoSelecionado, history, dataOsRetorno],
  );

  const reconferirOs = useCallback(
    async (retorno: boolean) => {
      setLoading(true);
      if (retorno) {
        const response = await api.put(
          `ConferenciaSaida/ReabreConferenciaOs/${dataOs.numos}`,
        );

        if (response.data) {
          history.push('/conferencia-saida/conferencia-os', dataOsRetorno);
        } else {
          createMessage({
            type: 'error',
            message: `Erro ao tentar reabrir conferência da O.S: ${dataOs.numos}. Verifique se a O.S. já está concluída.`,
          });
          setMostrarDialogOs(false);
          setLoading(false);
        }
      } else {
        createMessage({
          type: 'info',
          message: 'Operação cancelada pelo usuário.',
        });
        setLoading(false);
        setMostrarDialogOs(false);
      }
    },
    [history, dataOs, dataOsRetorno],
  );

  return (
    <>
      <NavBar
        caminho="/conferencia-saida/conferencia-os"
        numCarregamento={dataOs.numcar}
        params={dataOsRetorno}
      />
      <Loanding>
        {!loading ? (
          <Content>
            <DataTable
              header={`Divergência da O.S: ${dataOs.numos}`}
              value={divergencia}
              selectionMode="single"
              selection={produtoSelecionado}
              onSelectionChange={(e) => setProdutoSelecionado(e.value)}
              scrollable
              paginator
              rows={5}
              scrollHeight="500px"
              style={{ width: '100%' }}
            >
              <Column field="letra" header="Cli" style={{ width: '55px' }} />
              <Column
                field="numpalete"
                header="Pal"
                style={{ width: '45px' }}
              />
              <Column field="numos" header="O.S" style={{ width: '90px' }} />
              <Column field="numvol" header="Vol" style={{ width: '45px' }} />
              <Column field="codprod" header="Prod" style={{ width: '60px' }} />
              <Column
                field="descricao"
                header="Descrição"
                style={{ width: '200px' }}
              />
              <Column field="rua" header="Rua" style={{ width: '45px' }} />
              <Column field="predio" header="Pré" style={{ width: '50px' }} />
              <Column field="nivel" header="Nív" style={{ width: '45px' }} />
              <Column field="apto" header="Apto" style={{ width: '54px' }} />
              <Column
                field="tipoos"
                header="Tipo O.S"
                style={{ width: '160px' }}
              />
              <Column
                field="separador"
                header="Separador"
                style={{ width: '200px' }}
              />
            </DataTable>
            {mostrarDialogProd ? (
              <>
                {!produtoSelecionado?.codprod ? (
                  <Dialog
                    title="Reconferir Produto"
                    message="Deseja realmente reabrir a contagem do produto: 0"
                    executar={reconferirProduto}
                  />
                ) : (
                  <Dialog
                    title="Reconferir Produto"
                    message={`Deseja realmente reabrir a contagem do produto: ${produtoSelecionado?.codprod}`}
                    executar={reconferirProduto}
                  />
                )}
              </>
            ) : (
              <Button>
                <button
                  type="button"
                  onClick={() => setMostrarDialogProd(true)}
                >
                  Reconferir Prod.
                </button>
                <button type="button" onClick={() => setMostrarDialogOs(true)}>
                  Reconferir O.S.
                </button>
              </Button>
            )}
            {mostrarDialogOs ? (
              <Dialog
                title="Reconferir O.S."
                message={`Deseja realmente reabrir a conferência da O.S: ${dataOs.numos}`}
                executar={reconferirOs}
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

export default Divergencia;
