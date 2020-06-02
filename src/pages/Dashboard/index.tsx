import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { FiTruck, FiShoppingCart, FiList, FiEdit, FiBox } from 'react-icons/fi';

import api from '../../services/api';

import NavBar from '../../components/NavBar';
import { Container, Content, Loanding } from './style';

const Dashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const validaTelaSeguinte = useCallback(async () => {
    const { usaWms } = user;
    setLoading(true);

    if (usaWms === 'S') {
      try {
        const response = await api.get(
          `Inventario/getProxEndereco/${user.code}`,
        );

        const proxEndereco = response.data;

        if (proxEndereco === '-1') {
          setLoading(false);
          history.push('inventario');
        } else {
          setLoading(false);
          history.push('endereco-inventario', [proxEndereco]);
        }
      } catch (err) {
        setLoading(false);
      }
    } else {
      setLoading(false);
      console.log('Filial não usa WMS. Tela de conferencia MRURAL.');
    }
  }, [user, history]);

  return (
    <>
      <NavBar />
      <Container>
        <Loanding>
          {!loading ? (
            <Content>
              <button type="button" onClick={() => history.push('#')} disabled>
                Conferência Entrada
                <FiTruck />
              </button>
              <button type="button" onClick={() => history.push('#')} disabled>
                Conferência Saída
                <FiShoppingCart />
              </button>
              <button type="button" onClick={validaTelaSeguinte}>
                Inventário
                <FiBox />
              </button>
              <button
                type="button"
                onClick={() => history.push('consult-products')}
                disabled
              >
                Alterar Dados do Produto
                <FiEdit />
              </button>
              <button type="button" onClick={() => history.push('#')} disabled>
                Listar Endereço
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
