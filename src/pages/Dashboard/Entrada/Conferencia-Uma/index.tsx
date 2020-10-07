import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FiSearch, FiCalendar } from 'react-icons/fi';
import ReactLoading from 'react-loading';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import api from '../../../../services/api';

import NavBar from '../../../../components/NavBar';
import Input from '../../../../components/Input';
import { createMessage } from '../../../../components/Toast';
import { useAuth } from '../../../../hooks/auth';
import formataData from '../../../../utils/formataData';

import {
  Container,
  ContainerConf,
  Content,
  ContentConf,
  Loanding,
  Button,
} from './styles';

interface DTOUma {
  numbonus: number;
  codigouma: number;
  codprod: number;
  ean: number;
  dun: number;
  qt: number;
  dtvalidade: string;
  dataconf: string;
  codfuncconf: number;
}

const ConferenciaUma: React.FC = () => {
  const { usuario } = useAuth();
  const [codigouma, setCodigoUma] = useState(0);
  const formRef = useRef<FormHandles>(null);
  const [dataUma, setDataUma] = useState<DTOUma>({} as DTOUma);
  const [codbarra, setCodBarra] = useState(0);
  const [dtValidade, setDtValidade] = useState('');
  const [lastro, setLastro] = useState(0);
  const [camada, setCamada] = useState(0);
  const [cx, setCx] = useState(0);
  const [un, setUn] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.getElementById('uma')?.focus();
  }, []);

  const limparTela = useCallback(() => {
    setDataUma({} as DTOUma);
    formRef.current?.reset();
    document.getElementById('uma')?.focus();
  }, []);

  const validaUma = useCallback(
    async (event) => {
      if (event.key === 'Enter') {
        if (codigouma > 0) {
          try {
            setLoading(true);

            const response = await api.get<DTOUma[]>(
              `Entrada/BuscaUma/${codigouma}`,
            );

            if (response.data.length > 0) {
              const achouUma = response.data[0];

              if (achouUma.codfuncconf) {
                createMessage({
                  type: 'alert',
                  message: `U.M.A. já conferida. Conferente: ${achouUma.codfuncconf}`,
                });

                limparTela();
                setLoading(false);
                document.getElementById('uma')?.focus();
                return;
              }

              setDataUma(achouUma);
              setLoading(false);
              document.getElementById('codbarra')?.focus();
            } else {
              createMessage({
                type: 'alert',
                message: `Nenhum registro encontrado com o código: ${codigouma}`,
              });

              limparTela();
              setLoading(false);
              document.getElementById('uma')?.focus();
            }
          } catch (err) {
            createMessage({
              type: 'error',
              message: `Erro: ${err.message}`,
            });

            limparTela();
            setLoading(false);
            document.getElementById('codbarra')?.focus();
          }
        } else {
          createMessage({
            type: 'alert',
            message: 'Código da U.M.A. obrigatório.',
          });
        }
      }
    },
    [codigouma, limparTela],
  );

  const validaProduto = useCallback(
    async (event) => {
      if (event.key === 'Enter') {
        if (codbarra > 0) {
          if (codbarra === dataUma.ean || codbarra === dataUma.dun) {
            formRef.current?.setFieldValue('codbarra', dataUma.codprod);
            document.getElementById('codbox')?.focus();
          } else {
            createMessage({
              type: 'alert',
              message: `O código: ${codbarra} não pertence à U.M.A: ${codigouma}`,
            });

            formRef.current?.setFieldValue('codbarra', null);
            setLoading(false);
          }
        } else {
          createMessage({
            type: 'alert',
            message: 'Código do produto obrigatório.',
          });
        }
      }
    },
    [codbarra, codigouma, dataUma],
  );

  const focusCampo = useCallback((event) => {
    if (event.target.id === 'codbox' && event.key === 'Enter') {
      document.getElementById('lastro')?.focus();
    }
    if (event.target.id === 'lastro' && event.key === 'Enter') {
      document.getElementById('camada')?.focus();
    }
    if (event.target.id === 'camada' && event.key === 'Enter') {
      document.getElementById('qtcx')?.focus();
    }
    if (event.target.id === 'qtcx' && event.key === 'Enter') {
      document.getElementById('qtun')?.focus();
    }
    if (event.target.id === 'qtun' && event.key === 'Enter') {
      document.getElementById('total')?.focus();
    }
    if (event.target.id === 'total' && event.key === 'Enter') {
      document.getElementById('dtvalidade')?.focus();
    }
    if (event.target.id === 'dtvalidade' && event.key === 'Enter') {
      document.getElementById('gravar')?.focus();
    }
  }, []);

  const calcTotal = useCallback(() => {
    setTotal(lastro * camada * 12 + (Number(un) + Number(cx) * 12));
  }, [lastro, camada, un, cx]);

  const gravaConfUma = useCallback(async () => {
    if (window.document.activeElement?.tagName === 'BUTTON') {
      if (total === dataUma.qt) {
        const dataVal = `${dtValidade}T00:00:00`;

        const dataInformadaFormatada = formataData(dataVal);
        const dataUmaFormatada = formataData(dataUma.dtvalidade);

        if (dataInformadaFormatada === dataUmaFormatada) {
          setLoading(true);

          const response = await api.post(
            `Entrada/ConfereUma/${dataUma.numbonus}/${codigouma}/${dataUma.codprod}/${total}/${dataInformadaFormatada}/${usuario.code}`,
          );

          const salvouConferencia = response.data;

          if (salvouConferencia) {
            limparTela();
            setLoading(false);
            document.getElementById('uma')?.focus();
          } else {
            createMessage({
              type: 'error',
              message:
                'Erro ao salvar conferência. Por favor, tente mais tarde.',
            });

            setLoading(false);
          }
        } else {
          createMessage({
            type: 'alert',
            message: 'Data de validade não confere com a informada na U.M.A.',
          });
        }
      } else {
        createMessage({
          type: 'alert',
          message: 'Quantidade total não confere com a quantidade da U.M.A.',
        });
      }
    }
  }, [total, dataUma, dtValidade, codigouma, usuario.code, limparTela]);

  return (
    <>
      <NavBar caminho="/entrada" numBonus={dataUma.numbonus} />
      <Container>
        <Loanding>
          {!loading ? (
            <Content>
              <Form ref={formRef} onSubmit={gravaConfUma}>
                <Input
                  icon={FiSearch}
                  id="uma"
                  name="uma"
                  type="number"
                  description="CÓDIGO U.M.A."
                  defaultValue={dataUma.codigouma}
                  onChange={(e) => setCodigoUma(Number(e.target.value))}
                  onKeyPress={validaUma}
                />
                <Input
                  icon={FiSearch}
                  id="codbarra"
                  name="codbarra"
                  type="number"
                  description="EAN/DUN/CODPROD"
                  onChange={(e) => setCodBarra(Number(e.target.value))}
                  onKeyPress={validaProduto}
                />
                <ContainerConf>
                  <ContentConf>
                    <Input
                      percWidth={26.5}
                      id="codbox"
                      name="codbox"
                      type="number"
                      description="Box"
                      onKeyPress={(e) => focusCampo(e)}
                    />
                    <p />
                    <Input
                      percWidth={34}
                      id="lastro"
                      name="lastro"
                      type="number"
                      description="Lastro"
                      onChange={(e) => setLastro(Number(e.target.value))}
                      onKeyPress={(e) => focusCampo(e)}
                      onKeyUp={calcTotal}
                    />
                    <p>*</p>
                    <Input
                      percWidth={34}
                      id="camada"
                      name="camada"
                      type="number"
                      description="Camada"
                      onChange={(e) => setCamada(Number(e.target.value))}
                      onKeyPress={(e) => focusCampo(e)}
                      onKeyUp={calcTotal}
                    />
                    <ContentConf>
                      <Input
                        percWidth={29}
                        id="qtcx"
                        name="qtcx"
                        type="number"
                        description="Qt.Cx"
                        onChange={(e) => setCx(Number(e.target.value))}
                        onKeyPress={(e) => focusCampo(e)}
                        onKeyUp={calcTotal}
                      />
                      <p>+</p>
                      <Input
                        percWidth={30}
                        id="qtun"
                        name="qtun"
                        type="number"
                        description="Qt.Un"
                        onChange={(e) => setUn(Number(e.target.value))}
                        onKeyPress={(e) => focusCampo(e)}
                        onKeyUp={calcTotal}
                      />
                      <p>=</p>
                      <Input
                        percWidth={30.5}
                        id="total"
                        name="total"
                        type="number"
                        description="Total"
                        value={total}
                        onKeyPress={(e) => focusCampo(e)}
                        readOnly
                      />
                    </ContentConf>
                  </ContentConf>
                </ContainerConf>
                <Input
                  icon={FiCalendar}
                  id="dtvalidade"
                  name="dtvalidade"
                  type="date"
                  value={dtValidade}
                  onChange={(e) => setDtValidade(e.target.value)}
                  onKeyPress={(e) => focusCampo(e)}
                  description="Data de validade"
                />
                <Button>
                  <button type="button" onClick={limparTela}>
                    LIMPAR TELA
                  </button>
                  {dataUma.codprod > 0 ? (
                    <button id="gravar" type="submit">
                      GRAVAR
                    </button>
                  ) : (
                    <button id="gravar" type="button" disabled>
                      GRAVAR
                    </button>
                  )}
                </Button>
              </Form>
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

export default ConferenciaUma;
