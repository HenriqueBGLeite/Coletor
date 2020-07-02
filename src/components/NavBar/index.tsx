import React from 'react';
import { useHistory } from 'react-router-dom';
import { FiHome, FiLogOut, FiArrowLeft } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';

import { Container } from './style';

interface NavBarProps {
  numInvent?: number;
  caminho?: string;
  params?: object;
  simpleNav?: boolean;
}

const NavBar: React.FC<NavBarProps> = (props) => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const { signOut } = useAuth();
  const { numInvent, caminho, params, simpleNav } = props;
  const validaButtonSair = history.location.pathname;

  return (
    <>
      {simpleNav ? (
        <Container>
          <button
            type="button"
            onClick={() => history.push('/dashboard')}
            disabled
          >
            <FiHome />
            Menu
          </button>
          <div id="info">
            <p>
              {user.code} - {user.nome} F{user.filial}
            </p>
            {numInvent ? <p>INVENTÁRIO {numInvent}</p> : ''}
          </div>
          {validaButtonSair === '/dashboard' ? (
            <button type="button" onClick={signOut}>
              <FiLogOut />
              Sair
            </button>
          ) : (
            <button
              type="button"
              onClick={() => history.push(`${caminho}`, params)}
              disabled
            >
              <FiArrowLeft />
              Voltar
            </button>
          )}
        </Container>
      ) : (
        <Container>
          <button type="button" onClick={() => history.push('/dashboard')}>
            <FiHome />
            Menu
          </button>
          <div id="info">
            <p>
              {user.code} - {user.nome} F{user.filial}
            </p>
            {numInvent ? <p>INVENTÁRIO {numInvent}</p> : ''}
          </div>
          {validaButtonSair === '/dashboard' ? (
            <button type="button" onClick={signOut}>
              <FiLogOut />
              Sair
            </button>
          ) : (
            <button
              type="button"
              onClick={() => history.push(`${caminho}`, params)}
            >
              <FiArrowLeft />
              Voltar
            </button>
          )}
        </Container>
      )}
    </>
  );
};

export default NavBar;
