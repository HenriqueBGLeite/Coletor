import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { FiCheckSquare, FiBox, FiLayers } from 'react-icons/fi';

import { useAuth } from '../../../hooks/auth';
import NavBar from '../../../components/NavBar';
import { createMessage } from '../../../components/Toast';
import { Container, Loanding, Content, MensagemAcesso } from './style';

const Saida: React.FC = () => {
  const { usuario } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const validaTelaSeguinteConferencia = useCallback(async () => {
    setLoading(true);

    if (usuario.usaWms === 'S') {
      history.push('conferencia-saida');
    } else {
      setLoading(false);
      createMessage({
        type: 'info',
        message:
          'Ops... Não foi possível acessar o recurso. Tela em desenvolvimento.',
      });
    }
  }, [usuario, history]);

  const validaTelaSeguinte = useCallback(
    async (proxTela: string) => {
      setLoading(true);

      if (usuario.usaWms === 'S') {
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
    [usuario, history],
  );

  return (
    <>
      <NavBar caminho="dashboard" />
      <Container>
        <Loanding>
          {!loading ? (
            <Content>
              {usuario.acessoConferirOs === 'S' ? (
                <button type="button" onClick={validaTelaSeguinteConferencia}>
                  CONFERÊNCIA
                  <FiBox />
                </button>
              ) : (
                <> </>
              )}
              {usuario.acessoPaletizarCarga === 'S' ? (
                <button type="button" onClick={() => validaTelaSeguinte('P')}>
                  PALETIZAÇÃO (F25)
                  <FiLayers />
                </button>
              ) : (
                <> </>
              )}
              {usuario.acessoAuditarCarregamento === 'S' ? (
                <button type="button" onClick={() => validaTelaSeguinte('A')}>
                  AUDITORIA
                  <FiCheckSquare />
                </button>
              ) : (
                <> </>
              )}
              {usuario.acessoConferirOs === 'N' &&
              usuario.acessoPaletizarCarga === 'N' &&
              usuario.acessoAuditarCarregamento === 'N' ? (
                <MensagemAcesso>
                  <h1>Usuário não possui nenhum acesso</h1>
                </MensagemAcesso>
              ) : (
                <> </>
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

export default Saida;
