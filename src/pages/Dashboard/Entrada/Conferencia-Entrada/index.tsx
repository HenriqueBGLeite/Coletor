import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { createMessage } from '../../../../components/Toast';
import api from '../../../../services/api';
import NavBar from '../../../../components/NavBar';
import Dialog from '../../../../components/Dialog';

import { Content, Button, Loanding } from './styles';

interface DataInfoBonus {
  numbonus: number;
  placa: string;
  fornecedor: string;
}

const BonusAberto: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const paramBonus = history.location.state;
  const [bonusAberto, setBonusAberto] = useState<DataInfoBonus[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [bonusSelecionado, setBonusSelecionado] = useState<DataInfoBonus>(
    {} as DataInfoBonus,
  );

  useEffect(() => {
    setLoading(true);
    async function loadDiverg(): Promise<void> {
      const response = await api.get<DataInfoBonus[]>(
        `Entrada/BuscaCabBonus/${paramBonus}/${user.filial}`,
      );

      if (response.data.length > 0) {
        setBonusAberto(response.data);
        setLoading(false);
      } else {
        createMessage({
          type: 'info',
          message: 'Nenhum bônus em aberto foi encontrado.',
        });

        history.push('/entrada');
      }
    }

    loadDiverg();
  }, [paramBonus, user.filial, history]);

  const confirmarBonus = useCallback(
    (retorno: boolean) => {
      if (retorno) {
        history.push('/entrada/equipe-bonus', bonusSelecionado?.numbonus);
      } else {
        createMessage({
          type: 'info',
          message: 'Processo abortado pelo usuário.',
        });
        setBonusSelecionado({} as DataInfoBonus);
        setMostrarDialog(false);
      }
      setMostrarDialog(false);
    },
    [history, bonusSelecionado],
  );
  return (
    <>
      <NavBar caminho="/entrada" />
      <Loanding>
        {!loading ? (
          <Content>
            <DataTable
              header="Bônus em aberto"
              value={bonusAberto}
              selectionMode="single"
              selection={bonusSelecionado}
              onSelectionChange={(e) => setBonusSelecionado(e.value)}
              scrollable
              paginator
              rows={6}
              scrollHeight="500px"
              style={{ width: '100%' }}
            >
              <Column
                field="numbonus"
                header="Bônus"
                style={{ width: '75px' }}
              />
              <Column field="placa" header="Placa" style={{ width: '90px' }} />
              <Column
                field="fornecedor"
                header="Fornecedor"
                style={{ width: '335px' }}
              />
            </DataTable>
            {mostrarDialog ? (
              <Dialog
                title="Confirmar Bônus"
                message={`Deseja realmente iniciar a conferência do bônus: ${bonusSelecionado?.numbonus}?`}
                executar={confirmarBonus}
              />
            ) : (
              <Button>
                {bonusSelecionado && bonusSelecionado.numbonus ? (
                  <button type="button" onClick={() => setMostrarDialog(true)}>
                    Confirmar Bônus
                  </button>
                ) : (
                  <button type="button" disabled>
                    Confirmar Bônus
                  </button>
                )}
              </Button>
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

export default BonusAberto;
