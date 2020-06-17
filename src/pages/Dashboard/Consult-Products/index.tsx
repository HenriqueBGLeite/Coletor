import React, { useEffect, useState, useRef, useCallback } from 'react';
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
  lastro: number;
  camada: number;
  total: number;
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
  const [produto, setProduto] = useState<Produto>({} as Produto);
  const [inputProduto, setInputProduto] = useState(0);

  const history = useHistory();

  useEffect(() => {
    api.get(`PesquisaProduto/getFiliais/${user.code}`).then((response) => {
      const filiaisData = response.data;
      if (filiaisData) {
        setFiliais(filiaisData);
      } else {
        history.goBack();
      }
    });
  }, [user.code, history]);

  const handleGetProduct = useCallback(
    async (data: DataForm) => {
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

  const handleSubmit = useCallback(async (data: DataForm) => {
    if (window.document.activeElement?.tagName === 'BUTTON') {
      console.log(data);
      createMessage({
        type: 'info',
        message: 'Ops... ainda não esta pronto. Tela em construção.',
      });
      formRefProd.current?.clearField('codprod');
      document.getElementById('codprod')?.focus();
    }
  }, []);

  return (
    <>
      <NavBar />
      <Container>
        <Content>
          <Form ref={formRefProd} onSubmit={handleGetProduct}>
            <Header>
              <Input
                focus
                percWidth={68}
                name="codprod"
                id="codprod"
                icon={FiZoomIn}
                type="number"
                description="EAN/DUN/CODPROD"
                onChange={(e) => setInputProduto(Number(e.target.value))}
              />
              <Select name="filial" percWidth={30} icon={FiHome}>
                <option value=""> </option>
                {filiais.map((filial) => (
                  <option key={filial.codfilial} value={filial.codfilial}>
                    {filial.codfilial}
                  </option>
                ))}
              </Select>
            </Header>
          </Form>
          <Loanding>
            {!loading ? (
              <Form ref={formRef} onSubmit={handleSubmit}>
                <p>{produto.descricao}</p>
                <Input
                  percWidth={30}
                  name="codProd"
                  type="text"
                  description="Cód.Prod"
                  defaultValue={produto.codprod}
                  disabled
                />
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
                      percWidth={25}
                      name="qtunit"
                      type="text"
                      description="Qt.Unit"
                      defaultValue={produto.qtunit}
                      disabled
                    />
                    <Input
                      name="ean"
                      type="number"
                      description="Cód.Barras Unit."
                      defaultValue={produto.ean}
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
                      percWidth={25}
                      name="qtcx"
                      type="text"
                      description="Qt.Cx"
                      defaultValue={produto.qtcx}
                      disabled
                    />
                    <Input
                      name="dun"
                      type="number"
                      description="Cód.Barras Master"
                      defaultValue={produto.dun}
                    />
                    <Input
                      percWidth={20}
                      name="alt"
                      type="number"
                      description="Alt"
                      defaultValue={produto.alt}
                    />
                    <Input
                      percWidth={20}
                      name="larg"
                      type="number"
                      description="Larg"
                      defaultValue={produto.larg}
                    />
                    <Input
                      percWidth={22}
                      name="comp"
                      type="number"
                      description="Comp"
                      defaultValue={produto.comp}
                    />
                    <Input
                      percWidth={29}
                      name="peso"
                      type="number"
                      description="Peso(kg)"
                      defaultValue={produto.peso}
                    />
                  </div>
                </Fieldset>
                <Fieldset title="Norma Palete">
                  <legend>
                    <span>NORMA PALETE</span>
                  </legend>
                  <div className="wrap">
                    <Input
                      percWidth={31}
                      name="lastro"
                      type="number"
                      description="Lastro"
                      defaultValue={produto.lastro}
                    />
                    <Input
                      percWidth={31}
                      name="camada"
                      type="number"
                      description="Camada"
                      defaultValue={produto.camada}
                    />
                    <Input
                      percWidth={33}
                      name="total"
                      type="number"
                      description="Total"
                      defaultValue={produto.total}
                      disabled
                    />
                  </div>
                </Fieldset>
                <button type="submit">Gravar</button>
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
