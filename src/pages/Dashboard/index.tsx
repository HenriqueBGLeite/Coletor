import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { FiTruck, FiShoppingCart, FiList, FiEdit, FiBox } from 'react-icons/fi';

import { createMessage } from '../../components/Toast';
import api from '../../services/api';

import NavBar from '../../components/NavBar';
import { Container, Content, Loanding } from './style';

interface EnderecoInventario {
  codendereco: number;
  tipoender: string;
  status: string;
  codprod: number;
  ean: number;
  dun: number;
  qtunitcx: number;
  qt: number;
  contagem: number;
  deposito: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
}

const Dashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const location = history.location.pathname;

  const validaTelaSeguinte = useCallback(async () => {
    const { usaWms } = user;
    setLoading(true);

    if (usaWms === 'S') {
      try {
        const response = await api.get<EnderecoInventario[]>(
          `Inventario/getProxOs/${user.code}`,
        );

        const enderecoOs = response.data;

        if (enderecoOs === null || enderecoOs.length === 0) {
          setLoading(false);
          history.push('inventario');
        } else {
          setLoading(false);

          history.push(`${location}/endereco-inventario`, enderecoOs);
        }
      } catch (err) {
        setLoading(false);
      }
    } else {
      setLoading(false);
      createMessage({
        type: 'info',
        message:
          'Ops... Não foi possível acessar o recurso. Tela em desenvolvimento.',
      });
    }
  }, [user, history, location]);

  return (
    <>
      <NavBar voltar />
      <Container>
        <Loanding>
          {!loading ? (
            <Content>
              <button type="button" onClick={() => history.push('#')} disabled>
                CONFERÊNCIA ENTRADA
                <FiTruck />
              </button>
              <button type="button" onClick={() => history.push('#')} disabled>
                CONFERÊNCIA SAÍDA
                <FiShoppingCart />
              </button>
              <button type="button" onClick={validaTelaSeguinte}>
                INVENTÁRIO
                <FiBox />
              </button>
              <button
                type="button"
                onClick={() => history.push('consult-products')}
              >
                DADOS PRODUTO
                <FiEdit />
              </button>
              <button type="button" onClick={() => history.push('#')} disabled>
                LISTAR ENDEREÇOS
                <FiList />
              </button>
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
      </Container>
    </>
  );
};

export default Dashboard;
