import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import api from '../../../../../../services/api';
import { formataValor } from '../../../../../../utils/formataValor';
import NavBar from '../../../../../../components/NavBar';

import { Loanding } from './styles';

interface DTOCarga {
  numcar: number;
  pendencia: number;
  proxTela: string;
}

interface DataPendencia {
  letra: string;
  codbox: number;
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
  rota: string;
  pesototal: number;
  pesototalFormatado: string;
}

const OsPendenteReconferencia: React.FC = () => {
  const history = useHistory();
  const dataCarga = history.location.state as DTOCarga;
  const [pendencia, setPendencia] = useState<DataPendencia[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    async function loadDiverg(): Promise<void> {
      const response = await api.get<DataPendencia[]>(
        `AuditoriaPaletiza/PendenciaCarregamento/${dataCarga.numcar}/${dataCarga.proxTela}`,
      );

      const pendencias = response.data;

      pendencias.map((pend) => {
        const totalFormatado = formataValor(pend.pesototal);

        pend.pesototalFormatado = totalFormatado;

        return pend;
      });

      setPendencia(pendencias);
      setLoading(false);
    }

    loadDiverg();
  }, [dataCarga]);

  return (
    <>
      <NavBar
        caminho="/auditoria-paletizacao/conferencia"
        numCarregamento={dataCarga.numcar}
        params={dataCarga}
      />
      <Loanding>
        {!loading ? (
          <DataTable
            header={( //eslint-disable-line
              <>
                <p>Pendências da carga: {dataCarga.numcar}</p>
                <p>
                  Rota: {pendencia[0]?.rota} - Peso:{' '}
                  {pendencia[0]?.pesototalFormatado} Kg
                </p>
              </>
            )} //eslint-disable-line
            value={pendencia}
            scrollable
            paginator
            rows={5}
            scrollHeight="500px"
            style={{ width: '100%' }}
          >
            <Column field="letra" header="Cli" style={{ width: '55px' }} />
            <Column field="codbox" header="Box" style={{ width: '55px' }} />
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

export default OsPendenteReconferencia;
