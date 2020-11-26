import React, { createContext, useCallback, useState, useContext } from 'react';
import api from '../services/api';

interface AuthState {
  token: string;
  usuario: object;
}

interface SignInCredentials {
  code: number;
  password: string;
  base: string;
}

interface AuthContextData {
  usuario: {
    filial: number;
    code: number;
    base: string;
    nome: string;
    usaWms: string;
    acessoSistema: string;
    acessoEntrada: string;
    acessoConferirBonusEntrada: string;
    acessoConferirBonusDevolucao: string;
    acessoConferirUma: string;
    acessoConferirCaixaPlastica: string;
    acessoSaida: string;
    acessoConferirOs: string;
    acessoPaletizarCarga: string;
    acessoAuditarCarregamento: string;
    acessoArmazenagem: string;
    acessoOperadorTranspalete: string;
    acessoOperadorEmpilhadeira: string;
    acessoRepositorMercadoria: string;
    acessoDadosProduto: string;
    acessoListarEnderecos: string;
    acessoInventario: string;
  };
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState(() => {
    const token = localStorage.getItem('@EpocaColetor:token');
    const usuario = localStorage.getItem('@EpocaColetor:user');

    if (token && usuario) {
      return { token, usuario: JSON.parse(usuario) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ code, password, base }) => {
    try {
      const response = await api.post('Login/getUsuario/', {
        code,
        password,
        base,
      });

      const { erro, warning, mensagemErroWarning } = response.data;

      if (erro === 'N' && warning === 'N') {
        const usuario = response.data;
        const { token } = usuario;

        localStorage.setItem('@EpocaColetor:token', token);
        localStorage.setItem('@EpocaColetor:base', base);
        localStorage.setItem('@EpocaColetor:user', JSON.stringify(usuario));

        setData({ token, usuario });
      } else {
        throw new Error(mensagemErroWarning);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@EpocaColetor:token');
    localStorage.removeItem('@EpocaColetor:user');

    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ usuario: data.usuario, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export { AuthProvider, useAuth };
