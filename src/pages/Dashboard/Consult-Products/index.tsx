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
  alt: number;
  larg: number;
  comp: number;
  peso: number;
  altUn: number;
  largUn: number;
  compUn: number;
  pesoUn: number;
  lastro: number;
  camada: number;
  total: number;
  capacidade: number;
  reposicao: number;
  prazoValidade: number;
  shelfLife: number;
}

interface DataForm {
  codprod: number;
  filial: number;
}

const ConsultProducts: React.FC = () => {
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
    } else {
      api.get(`PesquisaProduto/getFiliais/${user.code}`).then((response) => {
        const filiaisData = response.data;
        if (filiaisData) {
          setFiliais(filiaisData);
          setLoading(false);
        } else {
          history.goBack();
        }
      });
    }
  }, [user.code, history]);

  const handleGetProduct = useCallback(
    async (data: DataForm) => {
      setSelectedFilial(data.filial);
      setLoading(true);
      try {
        const schema = Yup.object().shape({
          codprod: Yup.string().required('Código obrigatório.'),
          filial: Yup.string().required('Filial obrigatória.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.get(
          `PesquisaProduto/getProduto/${inputProduto}/${data.filial}`,
        );

        const prod = response.data;
        setProduto(prod);
        setLastro(prod.lastro);
        setCamada(prod.camada);
        setTotal(prod.total);
        setLoading(false);
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
    setProduto({ ...produto, total });
  }, [produto, lastro, camada, total]);

  const handleAltDadosProd = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const campoValidacao = event.target.id;
      const valorCampoValidacao = Number(event.target.value);

      if (campoValidacao === 'ean') {
        setProduto({ ...produto, ean: valorCampoValidacao });
      } else if (campoValidacao === 'altUn') {
        setProduto({ ...produto, altUn: valorCampoValidacao });
      } else if (campoValidacao === 'largUn') {
        setProduto({ ...produto, largUn: valorCampoValidacao });
      } else if (campoValidacao === 'compUn') {
        setProduto({ ...produto, compUn: valorCampoValidacao });
      } else if (campoValidacao === 'pesoUn') {
        setProduto({ ...produto, pesoUn: valorCampoValidacao });
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
        setProduto({ ...produto, prazoValidade: valorCampoValidacao });
      } else if (campoValidacao === 'shelfLife') {
        setProduto({ ...produto, shelfLife: valorCampoValidacao });
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
        total: lastro * camada,
      });

      const response = await api.put('PesquisaProduto/editaDadosProd', produto);

      const salvou = response.data;

      if (!salvou) {
        createMessage({
          type: 'error',
          message: 'Erro ao gravar as informações. Por favor, tente novamente.',
        });
        setLoading(false);
      }

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
  }, [produto, lastro, camada]);

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
                      id="altUn"
                      name="altUn"
                      type="number"
                      description="Alt"
                      defaultValue={produto.altUn}
                      onChange={handleAltDadosProd}
                    />
                    <Input
                      percWidth={21.4}
                      id="largUn"
                      name="largUn"
                      type="number"
                      description="Larg"
                      defaultValue={produto.largUn}
                      onChange={handleAltDadosProd}
                    />
                    <Input
                      percWidth={22.4}
                      id="compUn"
                      name="compUn"
                      type="number"
                      description="Comp"
                      defaultValue={produto.compUn}
                      onChange={handleAltDadosProd}
                    />
                    <Input
                      percWidth={29.8}
                      id="pesoUn"
                      name="pesoUn"
                      type="number"
                      description="Peso(kg)"
                      defaultValue={produto.pesoUn}
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
                      id="prazoValidade"
                      name="prazoValidade"
                      type="number"
                      description="Prazo Validade"
                      defaultValue={produto.prazoValidade}
                      onChange={handleAltDadosProd}
                    />
                    <Input
                      percWidth={48.8}
                      id="shelfLife"
                      name="shelfLife"
                      type="number"
                      description="Shelf Life (%)"
                      defaultValue={produto.shelfLife}
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

export default ConsultProducts;
