import React, { useState, useRef, useCallback } from 'react';
import { FiLock, FiShoppingBag } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import ReactLoading from 'react-loading';

import quebraOs from '../../../../utils/quebraOs';

import api from '../../../../services/api';

import { createMessage } from '../../../../components/Toast';
import NavBar from '../../../../components/NavBar';
import Input from '../../../../components/Input';

import { Container, Content, Loading, Button } from './styles';

interface DTOCarga {
  numcar: number;
  pendencia: number;
}

interface DataForm {
  numcar: number;
  numbox: number;
  numpalete: number;
  numos: number | undefined;
  numvol: number;
  tipoos: number;
  pertencecarga: string;
  reconferido: string;
  osaberta: number;
}

const ReconferenciaOs: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const dadosCarga = history.location.state as DTOCarga;
  const formRef = useRef<FormHandles>(null);
  const [dataForm, setDataForm] = useState<DataForm>({} as DataForm);
  const [numos, setNumOs] = useState<string | null>();
  const [dun, setDun] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

  const validaOs = useCallback(async () => {
    setLoading(true);
    try {
      const { numos: numOs, numvol: numVol } = quebraOs(numos as string);

      const response = await api.get<DataForm[]>(
        `Reconferencia/CabecalhoOs/${dadosCarga.numcar}/${numOs}/${numVol}/${user.filial}`,
      );

      const cabOs = response.data[0];

      if (cabOs) {
        setDun(undefined);
        if (cabOs.pertencecarga === 'S') {
          if (cabOs.osaberta === 0) {
            if (cabOs.reconferido === 'N') {
              setDataForm(cabOs);
              setLoading(false);
              setNumOs(undefined);
              setDun(cabOs.numvol);
              document.getElementById('codbarra')?.focus();
            } else {
              createMessage({
                type: 'alert',
                message: `O.S: ${numOs}/${numVol} do palete: ${cabOs.numpalete} já foi reconferido.`,
              });

              setLoading(false);
            }
          } else {
            createMessage({
              type: 'alert',
              message: 'Apenas O.S. finalizadas podem ser reconferidas',
            });

            setLoading(false);
          }
        } else {
          createMessage({
            type: 'alert',
            message: `O.S: ${numOs}/${numVol} não pertence ao carregamento: ${dadosCarga.numcar}`,
          });

          setLoading(false);
        }
      } else {
        createMessage({
          type: 'error',
          message: `Nenhum registro foi localizado para O.S: ${numOs}.`,
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
  }, [numos, user, dadosCarga]);

  const chamaValidaOs = useCallback(
    async (event) => {
      if (event.key === 'Enter') {
        setLoading(true);
        if (numos) {
          validaOs();
        } else {
          createMessage({
            type: 'error',
            message: 'Informe o número da O.S.',
          });
          setLoading(false);
        }
      }
    },
    [validaOs, numos],
  );

  const telaDivergencia = useCallback(() => {
    console.log('divergencia');
  }, []);

  const telaPendencia = useCallback(() => {
    console.log('pendente');
  }, []);

  return (
    <>
      <NavBar caminho="/reconferencia" numCarregamento={dadosCarga.numcar} />
      <Container>
        <Loading>
          {!loading ? (
            <Content>
              <Form ref={formRef} onSubmit={validaOs}>
                <Input
                  focus
                  icon={FiLock}
                  name="numos"
                  type="number"
                  description="NÚMERO DA O.S."
                  defaultValue={dataForm.numos}
                  onChange={(e) => setNumOs(e.target.value)}
                  onKeyPress={chamaValidaOs}
                />
                <Input
                  icon={FiShoppingBag}
                  name="codbarra"
                  type="number"
                  description="PRODUTO"
                  defaultValue={dun}
                  disabled
                />
              </Form>
              <Button>
                {dataForm.numos || numos ? (
                  <button type="button" onClick={telaDivergencia}>
                    <p>Divergência</p>
                    <p>({dadosCarga.pendencia})</p>
                  </button>
                ) : (
                  <button type="button" disabled>
                    <p>Divergência</p>
                    <p>({dadosCarga.pendencia})</p>
                  </button>
                )}
                <button type="button" onClick={telaPendencia}>
                  <p>Cli. Pend. Palete</p>
                  <p>({0})</p>
                </button>
              </Button>
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

export default ReconferenciaOs;
