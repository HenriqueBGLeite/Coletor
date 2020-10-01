import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { FiTruck, FiPackage, FiBox, FiLayers } from 'react-icons/fi';

// import NavBar from '@componentes/NavBar';

import { createMessage } from '../../components/Toast';
import api from '../../services/api';
// import apiRelatorio from '../../services/relatorios';
// import formataRelatorio from '../../utils/formataRelatorioPdf';

import NavBar from '../../components/NavBar';

import { Container, Content, Loading } from './style';

interface EnderecoInventario {
  codendereco: number;
  tipoender: string;
  status: string;
  codprod: number;
  ean: number;
  dun: number;
  qtunitcx: number;
  qt: number;
  contagem: number;
  deposito: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
}

const Dashboard: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const validaTelaSeguinteInventario = useCallback(async () => {
    const { usaWms } = user;
    setLoading(true);

    if (usaWms === 'S') {
      try {
        const response = await api.get<EnderecoInventario[]>(
          `Inventario/getProxOs/${user.code}`,
        );

        const enderecoOs = response.data;

        if (enderecoOs === null || enderecoOs.length === 0) {
          setLoading(false);
          history.push('inventario');
        } else {
          setLoading(false);

          history.push('inventario/endereco-inventario', enderecoOs);
        }
      } catch (err) {
        createMessage({
          type: 'error',
          message: `Error: ${err.message}`,
        });
        setLoading(false);
      }
    } else {
      setLoading(false);
      createMessage({
        type: 'info',
        message:
          'Ops... Não foi possível acessar o recurso. Tela em desenvolvimento.',
      });
    }
  }, [user, history]);

  // const convertBase64 = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     const base64 = await apiRelatorio.post(
  //       'relatorio?matricula=9316&nrorel=9005',
  //     );

  //     const relatorio = formataRelatorio(base64.data);

  //     window.open(relatorio);
  //     setLoading(false);
  //   } catch (err) {
  //     createMessage({
  //       type: 'error',
  //       message: `Error: ${err.message}`,
  //     });
  //     setLoading(false);
  //   }
  // }, []);

  return (
    <>
      <NavBar />
      <Container>
        <Loading>
          {!loading ? (
            <Content>
              {user.code === 1219 ? (
                <button type="button" onClick={() => history.push('entrada')}>
                  ENTRADA
                  <FiTruck />
                </button>
              ) : (
                <button type="button" disabled>
                  ENTRADA
                  <FiTruck />
                </button>
              )}
              <button type="button" onClick={() => history.push('saida')}>
                SAÍDA
                <FiBox />
              </button>
              <button type="button" onClick={() => history.push('armazenagem')}>
                ARMAZENAGEM
                <FiLayers />
              </button>
              <button type="button" onClick={validaTelaSeguinteInventario}>
                INVENTÁRIO
                <FiPackage />
              </button>
              {/* <button type="button" onClick={convertBase64}>
                BASE 64
                <FiPackage />
              </button> */}
            </Content>
          ) : (
            <ReactLoading
              className="loading"
              type="spokes"
              width="100px"
              color="#c22e2c"
            />
          )}
        </Loading>
      </Container>
    </>
  );
};

export default Dashboard;
