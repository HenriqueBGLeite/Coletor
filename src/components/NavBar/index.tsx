import React from 'react';
import { useHistory } from 'react-router-dom';
import { FiHome, FiLogOut, FiArrowLeft } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';

import { Container } from './style';

interface NavBarProps {
  numInvent?: number;
  voltar?: boolean;
}

const NavBar: React.FC<NavBarProps> = (props) => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const { signOut } = useAuth();
  const { numInvent, voltar } = props;
  const validaButtonSair = history.location.pathname;

  return (
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
      {voltar && validaButtonSair === '/dashboard' ? (
        <button type="button" onClick={signOut}>
          <FiLogOut />
          Sair
        </button>
      ) : (
        <button type="button" onClick={() => history.push('/dashboard')}>
          <FiArrowLeft />
          Voltar
        </button>
      )}
    </Container>
  );
};

export default NavBar;
