import React, { useState, useCallback } from 'react';
import ReactLoading from 'react-loading';
import { useHistory } from 'react-router-dom';
import { FiEdit, FiArchive, FiEdit3 } from 'react-icons/fi';

import { useAuth } from '../../../hooks/auth';
import NavBar from '../../../components/NavBar';
import { createMessage } from '../../../components/Toast';
import { Container, Loanding, Content, MensagemAcesso } from './style';

const Entrada: React.FC = () => {
  const { usuario } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const validaTelaSeguinte = useCallback(
    async (proxTela: string, tipoBonus?: string) => {
      setLoading(true);

      if (usuario.usaWms === 'S') {
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
    [usuario, history],
  );

  return (
    <>
      <NavBar caminho="dashboard" />
      <Container>
        <Loanding>
          {!loading ? (
            <Content>
              {usuario.acessoConferirBonusEntrada === 'S' ? (
                <button
                  type="button"
                  onClick={() => validaTelaSeguinte('B', 'E')}
                >
                  CONF. BÔNUS ENTRADA
                  <FiEdit />
                </button>
              ) : (
                <> </>
              )}
              {usuario.acessoConferirBonusDevolucao === 'S' ? (
                <button
                  type="button"
                  onClick={() => validaTelaSeguinte('B', 'D')}
                >
                  CONF. BÔNUS DEVOLUÇÃO
                  <FiEdit />
                </button>
              ) : (
                <> </>
              )}
              {usuario.acessoConferirUma === 'S' ? (
                <button type="button" onClick={() => validaTelaSeguinte('U')}>
                  CONF. U.M.A.
                  <FiEdit3 />
                </button>
              ) : (
                <> </>
              )}
              {usuario.acessoConferirCaixaPlastica === 'S' ? (
                <button type="button" onClick={() => validaTelaSeguinte('P')}>
                  CONF. CX. PLÁSTICA
                  <FiArchive />
                </button>
              ) : (
                <> </>
              )}
              {usuario.acessoConferirBonusEntrada === 'N' &&
              usuario.acessoConferirBonusDevolucao === 'N' &&
              usuario.acessoConferirUma === 'N' &&
              usuario.acessoConferirCaixaPlastica === 'N' ? (
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

export default Entrada;
