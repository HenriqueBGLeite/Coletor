import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import ReactLoading from 'react-loading';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import NavBar from '../../../../components/NavBar';

import api from '../../../../services/api';

import { Loanding } from './style';

interface DataProduct {
  codprod: number;
}

interface Produto {
  codfilial: number;
  qtestger: number;
  qtreserv: number;
  qtbloq: number;
  qtavaria: number;
}

const Estoque: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const produto = history.location.state as DataProduct;
  const [loading, setLoading] = useState(false);
  const [estoqueProd, setEstoqueProd] = useState<Produto[]>([]);

  useEffect(() => {
    setLoading(true);
    async function loadProducts(): Promise<void> {
      const response = await api.get<Produto[]>(
        `PesquisaProduto/getEstoqueProduto/${produto.codprod}/${user.code}`,
      );

      setEstoqueProd(response.data);
      setLoading(false);
    }

    loadProducts();
  }, [produto, user.code]);

  return (
    <>
      <NavBar caminho="/consult-products" params={produto} />
      <Loanding>
        {!loading ? (
          <DataTable
            header={`Estoque do produto: ${produto.codprod}`}
            value={estoqueProd}
            scrollable
            scrollHeight="500px"
            style={{ width: '100%' }}
          >
            <Column
              field="codfilial"
              header="Cód. Filial"
              style={{ width: '55px' }}
            />
            <Column
              field="qtestger"
              header="Quant. Winthor"
              style={{ width: '80px' }}
            />
            <Column
              field="qtreserv"
              header="Reserv"
              style={{ width: '70px' }}
            />
            <Column field="qtbloq" header="Bloq" style={{ width: '55px' }} />
            <Column
              field="qtavaria"
              header="Avaria"
              style={{ width: '65px' }}
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

export default Estoque;
