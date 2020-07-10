import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { createMessage } from '../../../../../../components/Toast';
import api from '../../../../../../services/api';
import NavBar from '../../../../../../components/NavBar';

import { Content, Button, Loanding } from './styles';

interface DataOs {
  numos: number;
  numbox: number;
}

interface DataDivergencia {
  numos: number;
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
  const [divergencia, setDivergencia] = useState<DataDivergencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<DataDivergencia>(
    {} as DataDivergencia,
  );

  useEffect(() => {
    setLoading(true);
    async function loadDiverg(): Promise<void> {
      const response = await api.get<DataDivergencia[]>(
        `ConferenciaSaida/DivergenciaOs/${dataOs.numos}`,
      );

      setDivergencia(response.data);
      setLoading(false);
    }

    loadDiverg();
  }, [dataOs.numos]);

  const reconferirProduto = useCallback(async () => {
    if (produtoSelecionado.codprod) {
      setLoading(true);
      const response = await api.put(
        `ConferenciaSaida/ReabreConferenciaProduto/${produtoSelecionado.numos}/${produtoSelecionado.codprod}`,
      );

      if (response.data) {
        createMessage({
          type: 'success',
          message: `Conferência da O.S: ${produtoSelecionado.numos} produto: ${produtoSelecionado.codprod} reaberta com sucesso!`,
        });
        history.push('/conferencia-saida/conferencia-os', dataOs.numbox);
      } else {
        createMessage({
          type: 'error',
          message: `Erro ao tentar reabrir conferência da O.S: ${produtoSelecionado.numos} produto: ${produtoSelecionado.codprod}.`,
        });
        setLoading(false);
      }
    } else {
      createMessage({
        type: 'error',
        message: 'Nenhum produto selecionado.',
      });
    }
  }, [produtoSelecionado, history, dataOs]);

  const reconferirOs = useCallback(async () => {
    setLoading(true);
    const response = await api.put(
      `ConferenciaSaida/ReabreConferenciaOs/${dataOs.numos}`,
    );

    if (response.data) {
      createMessage({
        type: 'success',
        message: `Conferência da O.S: ${dataOs.numos} reaberta com sucesso!`,
      });
      history.push('/conferencia-saida/conferencia-os', dataOs.numbox);
    } else {
      createMessage({
        type: 'error',
        message: `Erro ao tentar reabrir conferência da O.S: ${dataOs.numos}.`,
      });
      setLoading(false);
    }
  }, [history, dataOs]);

  return (
    <>
      <NavBar
        caminho="/conferencia-saida/conferencia-os"
        params={dataOs.numbox}
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
              <Column field="numos" header="O.S" style={{ width: '90px' }} />
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
                style={{ width: '120px' }}
              />
              <Column
                field="separador"
                header="Separador"
                style={{ width: '200px' }}
              />
            </DataTable>
            <Button>
              <button type="button" onClick={reconferirProduto}>
                Reconferir Prod.
              </button>
              <button type="button" onClick={reconferirOs}>
                Reconferir O.S.
              </button>
            </Button>
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
