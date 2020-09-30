import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { FiCheckSquare, FiBox, FiLayers } from 'react-icons/fi';

import NavBar from '../../../components/NavBar';
import { createMessage } from '../../../components/Toast';
import { Container, Loanding, Content } from './style';

const Saida: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const validaTelaSeguinteConferencia = useCallback(async () => {
    const { usaWms } = user;
    setLoading(true);

    if (usaWms === 'S') {
      history.push('conferencia-saida');
    } else {
      setLoading(false);
      createMessage({
        type: 'info',
        message:
          'Ops... Não foi possível acessar o recurso. Tela em desenvolvimento.',
      });
    }
  }, [user, history]);

  const validaTelaSeguinte = useCallback(
    async (proxTela: string) => {
      const { usaWms } = user;
      setLoading(true);

      if (usaWms === 'S') {
        history.push('/auditoria-paletizacao', proxTela);
      } else {
        setLoading(false);
        createMessage({
          type: 'info',
          message:
            'Ops... Não foi possível acessar o recurso. Tela em desenvolvimento.',
        });
      }
    },
    [user, history],
  );

  return (
    <>
      <NavBar caminho="dashboard" />
      <Container>
        <Loanding>
          {!loading ? (
            <Content>
              <button type="button" onClick={validaTelaSeguinteConferencia}>
                CONFERÊNCIA
                <FiBox />
              </button>
              <button type="button" onClick={() => validaTelaSeguinte('P')}>
                PALETIZAÇÃO (F25)
                <FiLayers />
              </button>
              <button type="button" onClick={() => validaTelaSeguinte('A')}>
                AUDITORIA
                <FiCheckSquare />
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

export default Saida;
