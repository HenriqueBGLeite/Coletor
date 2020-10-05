import React from 'react';
import { useHistory } from 'react-router-dom';
import { FiHome, FiLogOut, FiArrowLeft } from 'react-icons/fi';

import { useAuth } from '../../hooks/auth';

import { Container } from './style';

interface NavBarProps {
  numInvent?: number;
  numCarregamento?: number;
  numBonus?: number;
  numBox?: number;
  caminho?: string;
  params?: object | number;
  simpleNav?: boolean;
}

const NavBar: React.FC<NavBarProps> = (props) => {
  const history = useHistory();
  const { signOut, usuario } = useAuth();
  const {
    numInvent,
    numCarregamento,
    numBonus,
    numBox,
    caminho,
    params,
    simpleNav,
  } = props;
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
              {usuario.code} - {usuario.nome} F{usuario.filial}
            </p>
            {numInvent ? <p>INVENTÁRIO {numInvent}</p> : ''}
            {numCarregamento ? <p>CARGA: {numCarregamento}</p> : ''}
            {numBonus ? <p>BÔNUS: {numBonus}</p> : ''}
            {numBox ? <p>BOX: {numBox}</p> : ''}
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
              {usuario.code} - {usuario.nome} F{usuario.filial}
            </p>
            {numInvent ? <p>INVENTÁRIO {numInvent}</p> : ''}
            {numCarregamento ? <p>CARGA: {numCarregamento}</p> : ''}
            {numBonus ? <p>BÔNUS: {numBonus}</p> : ''}
            {numBox ? <p>BOX: {numBox}</p> : ''}
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
