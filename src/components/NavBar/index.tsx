import React from 'react';
import { useHistory } from 'react-router-dom';
import { FiHome, FiLogOut } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';

import { Container } from './style';

const NavBar: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const { signOut } = useAuth();

  return (
    <Container>
      <button type="button" onClick={() => history.push('/dashboard')}>
        <FiHome />
        Menu
      </button>
      <p>
        {user.CODIGO} - {user.NOME} F{user.FILIAL}
      </p>
      <button type="button" onClick={signOut}>
        <FiLogOut />
        Sair
      </button>
    </Container>
  );
};

export default NavBar;
