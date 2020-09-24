import React, { useState, useCallback } from 'react';
import ReactLoading from 'react-loading';
import { useHistory } from 'react-router-dom';
import { FiEdit, FiArchive, FiEdit3 } from 'react-icons/fi';

import NavBar from '../../../components/NavBar';
import { createMessage } from '../../../components/Toast';
import { Container, Loanding, Content } from './style';

const Entrada: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const validaTelaSeguinte = useCallback(
    async (proxTela: string, tipoBonus?: string) => {
      const { usaWms } = user;
      setLoading(true);

      if (usaWms === 'S') {
        if (proxTela === 'B') {
          if (tipoBonus === 'E') {
            history.push('/entrada/conferencia-bonus', 'E');
          } else {
            history.push('/entrada/conferencia-bonus', 'D');
          }
        } else if (proxTela === 'U') {
          history.push('/entrada/conferencia-uma');
        } else {
          history.push('/entrada/caixa-plastica');
        }
      } else {
        setLoading(false);
        createMessage({
          type: 'info',
          message:
            'Ops... Não foi possível acessar o recurso. Tela em desenvolvimento.',
        });
      }
      setLoading(false);
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
              <button
                type="button"
                onClick={() => validaTelaSeguinte('B', 'E')}
              >
                CONF. BÔNUS ENTRADA
                <FiEdit />
              </button>
              <button
                type="button"
                onClick={() => validaTelaSeguinte('B', 'D')}
              >
                CONF. BÔNUS DEVOLUÇÃO
                <FiEdit />
              </button>
              <button
                type="button"
                onClick={() => validaTelaSeguinte('U')}
                disabled
              >
                CONF. U.M.A.
                <FiEdit3 />
              </button>
              <button type="button" onClick={() => validaTelaSeguinte('P')}>
                CONF. CX. PLÁSTICA
                <FiArchive />
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

export default Entrada;
