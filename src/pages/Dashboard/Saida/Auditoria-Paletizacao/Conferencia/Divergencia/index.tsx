import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import api from '../../../../../../services/api';
import NavBar from '../../../../../../components/NavBar';
import { createMessage } from '../../../../../../components/Toast';

import { Loanding } from './styles';

interface DataOs {
  numcar: number;
  numos: number;
  pendencia: number;
  proxTela: string;
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

const DivergenciaReconferencia: React.FC = () => {
  const history = useHistory();
  const dataOs = history.location.state as DataOs;
  const [pendencia, setPendencia] = useState<DataDivergencia[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    async function loadDiverg(): Promise<void> {
      try {
        const response = await api.get<DataDivergencia[]>(
          `AuditoriaPaletiza/DivergenciaCarregamento/${dataOs.numos}/${dataOs.proxTela}`,
        );

        setPendencia(response.data);
        setLoading(false);
      } catch (err) {
        createMessage({
          type: 'error',
          message: `Erro: ${err.message}`,
        });
        setLoading(false);
      }
    }

    loadDiverg();
  }, [dataOs]);

  return (
    <>
      <NavBar
        caminho="/auditoria-paletizacao/conferencia"
        numCarregamento={dataOs.numcar}
        params={dataOs}
      />
      <Loanding>
        {!loading ? (
          <DataTable
            header={`O.S pendentes da carga: ${dataOs.numcar}`}
            value={pendencia}
            scrollable
            paginator
            rows={5}
            scrollHeight="500px"
            style={{ width: '100%' }}
          >
            <Column field="letra" header="Cli" style={{ width: '55px' }} />
            <Column field="numpalete" header="Pal" style={{ width: '45px' }} />
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

export default DivergenciaReconferencia;
