import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';
import {
  FiRefreshCcw,
  FiShoppingCart,
  FiRepeat,
  FiEdit,
  FiList,
} from 'react-icons/fi';
import api from '../../../services/api';

import { useAuth } from '../../../hooks/auth';
import NavBar from '../../../components/NavBar';
import { createMessage } from '../../../components/Toast';
import { Container, Loanding, Content, MensagemAcesso } from './style';

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
  const { usuario } = useAuth();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const convocacaoAtiva = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get<DTOResposta[]>(
        `Armazenagem/BuscarProxBox/${usuario.code}`,
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
  }, [history, usuario]);

  const validaTelaSeguinteListagem = useCallback(async () => {
    setLoading(true);

    if (usuario.usaWms === 'S') {
      history.push('listar-enderecos');
    } else {
      setLoading(false);
      createMessage({
        type: 'info',
        message:
          'Ops... Não foi possível acessar o recurso. Tela em desenvolvimento.',
      });
    }
  }, [usuario, history]);

  return (
    <>
      <NavBar caminho="dashboard" />
      <Container>
        <Loanding>
          {!loading ? (
            <Content>
              {usuario.acessoOperadorTranspalete === 'S' ? (
                <button type="button" onClick={convocacaoAtiva}>
                  OPERADOR TRANSPALETE
                  <FiRepeat />
                </button>
              ) : (
                <> </>
              )}
              {usuario.acessoOperadorEmpilhadeira === 'S' ? (
                <button type="button" disabled>
                  OPERADOR EMPILHADEIRA
                  <FiRefreshCcw />
                </button>
              ) : (
                <> </>
              )}
              {usuario.acessoRepositorMercadoria === 'S' ? (
                <button type="button" disabled>
                  REPOSITOR MERCADÓRIA
                  <FiShoppingCart />
                </button>
              ) : (
                <> </>
              )}
              {usuario.acessoDadosProduto === 'S' ? (
                <button
                  type="button"
                  onClick={() => history.push('consultar-produtos')}
                >
                  DADOS PRODUTO
                  <FiEdit />
                </button>
              ) : (
                <> </>
              )}
              {usuario.acessoListarEnderecos === 'S' ? (
                <button type="button" onClick={validaTelaSeguinteListagem}>
                  LISTAR ENDEREÇOS
                  <FiList />
                </button>
              ) : (
                <> </>
              )}
              {usuario.acessoOperadorTranspalete === 'N' &&
              usuario.acessoOperadorEmpilhadeira === 'N' &&
              usuario.acessoRepositorMercadoria === 'N' &&
              usuario.acessoDadosProduto === 'N' &&
              usuario.acessoListarEnderecos === 'N' ? (
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

export default Armazenagem;
