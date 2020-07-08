import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  ChangeEvent,
} from 'react';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { FiZoomIn, FiHome } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';
import api from '../../../services/api';

import { createMessage } from '../../../components/Toast';

import NavBar from '../../../components/NavBar';
import Input from '../../../components/Input';
import Select from '../../../components/Select';

import { Container, Content, Header, Fieldset, Loanding } from './style';

interface Filial {
  codfilial: number;
}

interface Produto {
  codfilial: number;
  codprod: number;
  descricao: string;
  embalagem: string;
  unidade: string;
  qtunit: number;
  ean: number;
  embalagemmaster: string;
  unidademaster: string;
  qtcx: number;
  dun: number;
  alt?: number;
  larg?: number;
  comp?: number;
  peso?: number;
  altun?: number;
  largun?: number;
  compun?: number;
  pesoun: number;
  lastro: number;
  camada: number;
  total: number;
  capacidade?: number;
  reposicao?: number;
  prazovalidade: number;
  shelflife: number;
}

interface DataForm {
  codprod: number;
  filial: number;
}

const ConsultarProdutos: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const formRef = useRef<FormHandles>(null);
  const formRefProd = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [filiais, setFiliais] = useState<Filial[]>([]);
  const [selectedFilial, setSelectedFilial] = useState<number | undefined>();
  const [produto, setProduto] = useState<Produto>({} as Produto);
  const [inputProduto, setInputProduto] = useState(0);
  const [lastro, setLastro] = useState(0);
  const [camada, setCamada] = useState(0);
  const [total, setTotal] = useState(0);

  const history = useHistory();
  const location = history.location.pathname;

  useEffect(() => {
    setLoading(true);
    const produtoState = history.location.state as Produto;

    if (produtoState) {
      try {
        api
          .get<Filial[]>(`PesquisaProduto/getFiliais/${user.code}`)
          .then((response) => {
            const filiaisData = response.data;
            const filteredFiliais = filiaisData.filter(
              (filial) =>
                Number(filial.codfilial) !== Number(produtoState.codfilial),
            );

            setProduto(produtoState);
            setLastro(produtoState.lastro);
            setCamada(produtoState.camada);
            setFiliais(filteredFiliais);
            setSelectedFilial(produtoState.codfilial);
            setTotal(produtoState.lastro * produtoState.camada);
            setLoading(false);
          });
      } catch (err) {
        createMessage({
          type: 'error',
          message: err,
        });
        setLoading(false);
      }
    } else {
      api
        .get(`PesquisaProduto/getFiliais/${user.code}`)
        .then((response) => {
          const filiaisData = response.data;
          if (filiaisData) {
            setFiliais(filiaisData);
            setLoading(false);
          } else {
            history.goBack();
          }
        })
        .catch(() => {
          createMessage({
            type: 'error',
            message:
              'Falha na comunicação com o BD. Não foi possivel carregar as filiais.',
          });
          history.goBack();
        });
    }
  }, [user.code, history]);

  const handleGetProduct = useCallback(
    async (data: DataForm) => {
      setLoading(true);
      setSelectedFilial(data.filial);
      try {
        const schema = Yup.object().shape({
          codprod: Yup.string().required('Código obrigatório.'),
          filial: Yup.string().required('Filial obrigatória.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.get<Produto[]>(
          `PesquisaProduto/getProduto/${inputProduto}/${data.filial}`,
        );

        const responseProd = response.data;

        if (responseProd !== null) {
          const prod = responseProd[0];

          setProduto(prod);
          setLastro(prod.lastro);
          setCamada(prod.camada);
          setTotal(prod.total);
          setLoading(false);
        } else {
          createMessage({
            type: 'error',
            message: 'Não foi possivel listar o produto.',
          });
          setProduto({} as Produto);
          setLastro(0);
          setCamada(0);
          setTotal(0);
          setLoading(false);
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          createMessage({
            type: 'error',
            message:
              'Verifique se o código e a filial estão informados corretamente.',
          });
          setLoading(false);
          return;
        }
        setLoading(false);
      }
    },
    [inputProduto],
  );

  const telaEstoque = useCallback(() => {
    history.push(`${location}/estoque`, produto);
  }, [history, location, produto]);

  const telaEndereco = useCallback(() => {
    history.push(`${location}/enderecos`, produto);
  }, [history, location, produto]);

  const handleCalcTotal = useCallback(() => {
    setTotal(lastro * camada);
    setProduto({ ...produto, total: lastro * camada });
  }, [produto, lastro, camada]);

  const handleAltDadosProd = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const campoValidacao = event.target.id;
      const valorCampoValidacao = Number(event.target.value);

      if (campoValidacao === 'ean') {
        setProduto({ ...produto, ean: valorCampoValidacao });
      } else if (campoValidacao === 'altun') {
        setProduto({ ...produto, altun: valorCampoValidacao });
      } else if (campoValidacao === 'largun') {
        setProduto({ ...produto, largun: valorCampoValidacao });
      } else if (campoValidacao === 'compun') {
        setProduto({ ...produto, compun: valorCampoValidacao });
      } else if (campoValidacao === 'pesoun') {
        setProduto({ ...produto, pesoun: valorCampoValidacao });
      } else if (campoValidacao === 'dun') {
        setProduto({ ...produto, dun: valorCampoValidacao });
      } else if (campoValidacao === 'alt') {
        setProduto({ ...produto, alt: valorCampoValidacao });
      } else if (campoValidacao === 'larg') {
        setProduto({ ...produto, larg: valorCampoValidacao });
      } else if (campoValidacao === 'comp') {
        setProduto({ ...produto, comp: valorCampoValidacao });
      } else if (campoValidacao === 'peso') {
        setProduto({ ...produto, peso: valorCampoValidacao });
      } else if (campoValidacao === 'lastro') {
        setLastro(valorCampoValidacao);
        setProduto({ ...produto, lastro: valorCampoValidacao });
      } else if (campoValidacao === 'camada') {
        setCamada(valorCampoValidacao);
        setProduto({ ...produto, camada: valorCampoValidacao });
      } else if (campoValidacao === 'capacidade') {
        setProduto({ ...produto, capacidade: valorCampoValidacao });
      } else if (campoValidacao === 'reposicao') {
        setProduto({ ...produto, reposicao: valorCampoValidacao });
      } else if (campoValidacao === 'prazoValidade') {
        setProduto({ ...produto, prazovalidade: valorCampoValidacao });
      } else if (campoValidacao === 'shelfLife') {
        setProduto({ ...produto, shelflife: valorCampoValidacao });
      }
    },
    [produto],
  );

  const handleSubmit = useCallback(async () => {
    if (window.document.activeElement?.tagName === 'BUTTON') {
      setLoading(true);

      setProduto({
        ...produto,
        lastro,
        camada,
        total,
      });

      console.log(produto);

      const response = await api.put('PesquisaProduto/editaDadosProd', produto);

      const salvou = response.data;

      if (!salvou) {
        createMessage({
          type: 'error',
          message: 'Erro ao gravar as informações. Por favor, tente novamente.',
        });
        setLoading(false);
      } else {
        createMessage({
          type: 'success',
          message: 'Dados gravados com sucesso.',
        });

        formRef.current?.reset();
        formRefProd.current?.reset();
        setTotal(0);
        setProduto({} as Produto);
        setLoading(false);

        document.getElementById('codprod')?.focus();
      }
    }
  }, [produto, lastro, camada, total]);

  return (
    <>
      <NavBar caminho="/" />
      <Container>
        <Content>
          <Loanding>
            {!loading ? (
              <Form ref={formRefProd} onSubmit={handleGetProduct}>
                <Header>
                  <Select name="filial" percWidth={30} icon={FiHome}>
                    <option value={selectedFilial}>{selectedFilial}</option>
                    {filiais
                      .filter((fil) => fil.codfilial !== selectedFilial)
                      .map((filial) => (
                        <option key={filial.codfilial} value={filial.codfilial}>
                          {filial.codfilial}
                        </option>
                      ))}
                  </Select>
                  <Input
                    percWidth={68}
                    name="codprod"
                    id="codprod"
                    icon={FiZoomIn}
                    type="number"
                    description="EAN/DUN/CODPROD"
                    onChange={(e) => setInputProduto(Number(e.target.value))}
                  />
                </Header>
              </Form>
            ) : (
              <></>
            )}
          </Loanding>
          <Loanding>
            {!loading ? (
              <Form ref={formRef} onSubmit={handleSubmit}>
                <Input
                  percWidth={30}
                  name="codProd"
                  type="text"
                  description="Cód.Prod"
                  defaultValue={produto.codprod}
                  disabled
                />
                {produto.codprod ? <p>{produto.descricao}</p> : <p />}

                <Fieldset title="Unidade">
                  <legend>
                    <span>UNIDADE</span>
                  </legend>
                  <div className="wrap">
                    <Input
                      percWidth={45}
                      name="embalagem"
                      type="text"
                      description="Emb.Unit"
                      defaultValue={produto.embalagem}
                      disabled
                    />
                    <Input
                      percWidth={25}
                      name="unidade"
                      type="text"
                      description="Unid."
                      defaultValue={produto.unidade}
                      disabled
                    />
                    <Input
                      percWidth={25.6}
                      name="qtunit"
                      type="text"
                      description="Qt.Unit"
                      defaultValue={produto.qtunit}
                      disabled
                    />
                    <p style={{ margin: 0, width: '100%' }} />
                    <Input
                      id="ean"
                      name="ean"
                      type="number"
                      description="Cód.Barras Unit."
                      defaultValue={produto.ean}
                      onChange={handleAltDadosProd}
                    />
                    <p style={{ margin: 0, width: '100%' }} />
                    <Input
                      percWidth={20}
                      id="altun"
                      name="altun"
                      type="number"
                      description="Alt"
                      defaultValue={produto.altun}
                      onChange={handleAltDadosProd}
                    />
                    <Input
                      percWidth={21.4}
                      id="largun"
                      name="largun"
                      type="number"
                      description="Larg"
                      defaultValue={produto.largun}
                      onChange={handleAltDadosProd}
                    />
                    <Input
                      percWidth={22.4}
                      id="compun"
                      name="compun"
                      type="number"
                      description="Comp"
                      defaultValue={produto.compun}
                      onChange={handleAltDadosProd}
                    />
                    <Input
                      percWidth={29.8}
                      id="pesoun"
                      name="pesoun"
                      type="number"
                      description="Peso(kg)"
                      defaultValue={produto.pesoun}
                      onChange={handleAltDadosProd}
                    />
                  </div>
                </Fieldset>
                <Fieldset title="Master (cm)">
                  <legend>
                    <span>MASTER (cm)</span>
                  </legend>
                  <div className="wrap">
                    <Input
                      percWidth={45}
                      name="embalagemMaster"
                      type="text"
                      description="Emb.Master"
                      defaultValue={produto.embalagemmaster}
                      disabled
                    />
                    <Input
                      percWidth={25}
                      name="unidadeMaster"
                      type="text"
                      description="Un.M"
                      defaultValue={produto.unidademaster}
                      disabled
                    />
                    <Input
                      percWidth={25.6}
                      name="qtcx"
                      type="text"
                      description="Qt.Cx"
                      defaultValue={produto.qtcx}
                      disabled
                    />
                    <p style={{ margin: 0, width: '100%' }} />
                    <Input
                      id="dun"
                      name="dun"
                      type="number"
                      description="Cód.Barras Master"
                      defaultValue={produto.dun}
                      onChange={handleAltDadosProd}
                    />
                    <p style={{ margin: 0, width: '100%' }} />
                    <Input
                      percWidth={20}
                      id="alt"
                      name="alt"
                      type="number"
                      description="Alt"
                      defaultValue={produto.alt}
                      onChange={handleAltDadosProd}
                    />
                    <Input
                      percWidth={21.4}
                      id="larg"
                      name="larg"
                      type="number"
                      description="Larg"
                      defaultValue={produto.larg}
                      onChange={handleAltDadosProd}
                    />
                    <Input
                      percWidth={22.4}
                      id="comp"
                      name="comp"
                      type="number"
                      description="Comp"
                      defaultValue={produto.comp}
                      onChange={handleAltDadosProd}
                    />
                    <Input
                      percWidth={29.8}
                      id="peso"
                      name="peso"
                      type="number"
                      description="Peso(kg)"
                      defaultValue={produto.peso}
                      onChange={handleAltDadosProd}
                    />
                  </div>
                </Fieldset>
                <Fieldset title="Norma Palete">
                  <legend>
                    <span>NORMA PALETE</span>
                  </legend>
                  <div className="wrap">
                    <Input
                      percWidth={31.4}
                      id="lastro"
                      name="lastro"
                      type="number"
                      description="Lastro"
                      defaultValue={produto.lastro}
                      onChange={handleAltDadosProd}
                      onKeyUp={handleCalcTotal}
                    />
                    <Input
                      percWidth={31.4}
                      id="camada"
                      name="camada"
                      type="number"
                      description="Camada"
                      defaultValue={produto.camada}
                      onChange={handleAltDadosProd}
                      onKeyUp={handleCalcTotal}
                    />
                    <Input
                      percWidth={32.9}
                      name="total"
                      type="number"
                      description="Total"
                      value={total}
                      disabled
                    />
                  </div>
                </Fieldset>
                <Fieldset title="Dados Adicionais">
                  <legend>
                    <span>DADOS ADICIONAIS</span>
                  </legend>
                  <div className="wrap">
                    <Input
                      percWidth={48.8}
                      id="capacidade"
                      name="capacidade"
                      type="number"
                      description="Capacidade Picking"
                      defaultValue={produto.capacidade}
                      onChange={handleAltDadosProd}
                    />
                    <Input
                      percWidth={48.8}
                      id="reposicao"
                      name="reposicao"
                      type="number"
                      description="Ponto de reposicao"
                      defaultValue={produto.reposicao}
                      onChange={handleAltDadosProd}
                    />
                    <p style={{ margin: 0, width: '100%' }} />
                    <Input
                      percWidth={48.8}
                      id="prazovalidade"
                      name="prazovalidade"
                      type="number"
                      description="Prazo Validade"
                      defaultValue={produto.prazovalidade}
                      onChange={handleAltDadosProd}
                    />
                    <Input
                      percWidth={48.8}
                      id="shelflife"
                      name="shelflife"
                      type="number"
                      description="Shelf Life (%)"
                      defaultValue={produto.shelflife}
                      onChange={handleAltDadosProd}
                    />
                  </div>
                </Fieldset>

                {produto.codprod ? (
                  <>
                    <div id="detalhe">
                      <button type="button" onClick={telaEstoque}>
                        Estoque
                      </button>
                      <button type="button" onClick={telaEndereco}>
                        Endereços
                      </button>
                    </div>
                    <button type="submit">Gravar</button>
                  </>
                ) : (
                  <>
                    <div id="detalhe">
                      <button type="button" disabled>
                        Estoque
                      </button>
                      <button type="button" disabled>
                        Endereços
                      </button>
                    </div>
                    <button type="submit" disabled>
                      Gravar
                    </button>
                  </>
                )}
              </Form>
            ) : (
              <ReactLoading
                className="loading"
                type="spokes"
                width="100px"
                color="#c22e2c"
              />
            )}
          </Loanding>
        </Content>
      </Container>
    </>
  );
};

export default ConsultarProdutos;
