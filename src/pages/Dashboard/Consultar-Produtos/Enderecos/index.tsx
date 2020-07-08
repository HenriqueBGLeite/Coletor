import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import NavBar from '../../../../components/NavBar';

import api from '../../../../services/api';

import { Loanding } from './style';

interface DataProduct {
  codfilial: number;
  codprod: number;
}

interface Enderecos {
  codEndereco: number;
  tipoEndereco: string;
  deposito: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
  qt: number;
  warning: string;
  error: string;
  mensagemErroWarning: string;
}

const Enderecos: React.FC = () => {
  const history = useHistory();
  const produto = history.location.state as DataProduct;
  const [loading, setLoading] = useState(false);
  const [enderecos, setEnderecos] = useState<Enderecos[]>([]);

  useEffect(() => {
    setLoading(true);
    async function loadProducts(): Promise<void> {
      const response = await api.get<Enderecos[]>(
        `PesquisaProduto/getEnderecoProduto/${produto.codprod}/${produto.codfilial}`,
      );
      setEnderecos(response.data);
      setLoading(false);
    }

    loadProducts();
  }, [produto]);

  return (
    <>
      <NavBar caminho="/consultar-produtos" params={produto} />
      <Loanding>
        {!loading ? (
          <DataTable
            header={`Endereços do produto: ${produto.codprod}`}
            value={enderecos}
            scrollable
            paginator
            rows={9}
            scrollHeight="500px"
            style={{ width: '100%' }}
          >
            <Column field="deposito" header="Dep" style={{ width: '40px' }} />
            <Column field="rua" header="Rua" style={{ width: '40px' }} />
            <Column field="predio" header="Pré" style={{ width: '50px' }} />
            <Column field="nivel" header="Nív" style={{ width: '40px' }} />
            <Column field="apto" header="Apt" style={{ width: '50px' }} />
            <Column field="qt" header="Est" style={{ width: '50px' }} />
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

export default Enderecos;
