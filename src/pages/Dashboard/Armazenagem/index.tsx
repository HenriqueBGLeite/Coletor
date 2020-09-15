import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { FiRefreshCcw, FiShoppingCart, FiRepeat } from 'react-icons/fi';
import api from '../../../services/api';

import NavBar from '../../../components/NavBar';
import { createMessage } from '../../../components/Toast';
import { Container, Loanding, Content } from './style';

interface DTOResposta {
  codbox: number;
  numbonus: number;
  codendereco: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
}

const Armazenagem: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const convocacaoAtiva = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<DTOResposta[]>(
        `Armazenagem/BuscarProxBox/${user.code}`,
      );

      if (response.data.length > 0) {
        history.push('/armazenagem/transpalete', response.data[0]);
      } else {
        createMessage({
          type: 'alert',
          message: 'Nenhum bônus confirmado foi encontrado.',
        });
        setLoading(false);
      }
    } catch (err) {
      createMessage({
        type: 'error',
        message: `Erro: ${err.message}`,
      });
      setLoading(false);
    }
  }, [history, user.code]);

  return (
    <>
      <NavBar caminho="dashboard" />
      <Container>
        <Loanding>
          {!loading ? (
            <Content>
              {user.acessoArmazenagemTranspalete === 'S' ? (
                <button type="button" onClick={convocacaoAtiva}>
                  OPERADOR TRANSPALETE
                  <FiRepeat />
                </button>
              ) : (
                <button type="button" disabled>
                  OPERADOR TRANSPALETE
                  <FiRepeat />
                </button>
              )}
              {user.acessoArmazenagemEmpilhadeira === 'S' ? (
                <button type="button" onClick={() => null}>
                  OPERADOR EMPILHADEIRA
                  <FiRefreshCcw />
                </button>
              ) : (
                <button type="button" disabled>
                  OPERADOR EMPILHADEIRA
                  <FiRefreshCcw />
                </button>
              )}
              {user.acessoArmazenagemRepositor === 'S' ? (
                <button type="button" onClick={() => null}>
                  REPOSITOR MERCADÓRIA
                  <FiShoppingCart />
                </button>
              ) : (
                <button type="button" disabled>
                  REPOSITOR MERCADÓRIA
                  <FiShoppingCart />
                </button>
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
      </Container>
    </>
  );
};

export default Armazenagem;
