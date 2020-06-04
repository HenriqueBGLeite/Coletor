import React from 'react';
import { useHistory } from 'react-router-dom';
import { FiHome, FiLogOut } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';

import { Container } from './style';

interface NavBarProps {
  numInvent?: number;
}

const NavBar: React.FC<NavBarProps> = (props) => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const { signOut } = useAuth();
  const { numInvent } = props;

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
      <button type="button" onClick={signOut}>
        <FiLogOut />
        Sair
      </button>
    </Container>
  );
};

export default NavBar;
