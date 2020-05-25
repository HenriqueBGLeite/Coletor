import React from 'react';
import { useHistory } from 'react-router-dom';
import { FiTruck, FiShoppingCart, FiList, FiEdit, FiBox } from 'react-icons/fi';

import NavBar from '../../components/NavBar';
import { Container, Content } from './style';

const Dashboard: React.FC = () => {
  const history = useHistory();
  return (
    <>
      <NavBar />
      <Container>
        <Content>
          <button type="button" onClick={() => history.push('#')} disabled>
            Conferência Entrada
            <FiTruck />
          </button>
          <button type="button" onClick={() => history.push('#')} disabled>
            Conferência Saída
            <FiShoppingCart />
          </button>
          <button
            type="button"
            onClick={() => history.push('/consult-products')}
          >
            Alterar Dados do Produto
            <FiEdit />
          </button>
          <button type="button" onClick={() => history.push('#')} disabled>
            Listar Endereço
            <FiList />
          </button>
          <button type="button" onClick={() => history.push('#')} disabled>
            Inventário
            <FiBox />
          </button>
        </Content>
      </Container>
    </>
  );
};

export default Dashboard;
