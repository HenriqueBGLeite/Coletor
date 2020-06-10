import React, {
  useCallback,
  useEffect,
  useState,
  ChangeEvent,
  useRef,
} from 'react';
import { FiSearch, FiCalendar } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import ReactLoading from 'react-loading';
import * as Yup from 'yup';
import api from '../../../../../services/api';
import getValidationErrors from '../../../../../utils/getValidationErros';

import Input from '../../../../../components/Input';
import { createMessage } from '../../../../../components/Toast';
import NavBar from '../../../../../components/NavBar';
import { Container, Content } from './style';

interface Props {
  enderecoOrig: [
    {
      codendereco: number;
      inventos: number;
      tipoender: string;
      numinvent: number;
      status: string;
      codprod: number;
      qtunitcx: number;
      descricao: string;
      qt: number;
      contagem: number;
      deposito: number;
      rua: number;
      predio: number;
      nivel: number;
      apto: number;
    },
  ];
  endereco: {
    codendereco: number;
    contagem: number;
    tipoender: string;
    codprod: number;
    qtunitcx: number;
    descricao: string;
    numinvent: number;
  };
}

interface EndAtualProps {
  codendereco: number;
  contagem: number;
  tipoender: string;
  codprod: number;
  qtunitcx: number;
  descricao: string;
  numinvent: number;
}

interface ProdutoInventario {
  codprod: number;
  descricao: string;
  qtunitcx: number;
}

interface SubmitForm {
  codprod: number;
}

const ConferenciaWms: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const history = useHistory();
  const endAtual = history.location.state as Props;
  const formRefProd = useRef<FormHandles>(null);
  const formRef = useRef<FormHandles>(null);
  const [mostrarDescricao, setMostrarDescricao] = useState(false);
  const [endereco, setEndereco] = useState({} as EndAtualProps);
  const [produto, setProduto] = useState(0);

  const [lastro, setLastro] = useState(0);
  const [camada, setCamada] = useState(0);
  const [cx, setCx] = useState(0);
  const [un, setUn] = useState(0);
  const [total, setTotal] = useState(0);

  const [loading, setLoanding] = useState(false);

  useEffect(() => {
    setEndereco(endAtual.endereco);
    document.getElementById('produto')?.focus();
  }, [endAtual]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setProduto(Number(event.target.value));
    },
    [],
  );

  const handleGetProduct = useCallback(
    async (data: object) => {
      try {
        formRefProd.current?.setErrors({});

        const schema = Yup.object().shape({
          produto: Yup.string().required('Código obrigatório.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        if (endereco.codprod !== produto && endereco.tipoender === 'AP') {
          createMessage({
            type: 'error',
            message: 'Endereço de picking. Não foi possível alterar o produto.',
          });
          formRefProd.current?.setFieldValue('produto', null);
        } else if (endereco.codprod === produto) {
          document.getElementById('lastro')?.focus();
          setMostrarDescricao(true);
        } else {
          setLoanding(true);
          const response = await api.get<ProdutoInventario>(
            `Inventario/getProdutoInventario/${produto}/${user.filial}`,
          );

          const { codprod, descricao, qtunitcx } = response.data;

          setEndereco({ ...endereco, codprod, descricao, qtunitcx });
          setMostrarDescricao(true);
          setLoanding(false);
          document.getElementById('lastro')?.focus();
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRefProd.current?.setErrors(errors);

          setLoanding(false);
          return;
        }

        createMessage({
          type: 'error',
          message: 'Erro ao realizar o login. Verifique suas credenciais.',
        });

        formRefProd.current?.setFieldValue('produto', null);
        setLoanding(false);
      }
    },
    [endereco, produto, user],
  );

  const handleCalcTotal = useCallback(
    (event) => {
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
        document.getElementById('button')?.focus();
      }

      setTotal(
        ((lastro * camada) * endereco.qtunitcx) + // eslint-disable-line
          (Number(un) + Number(cx) * endereco.qtunitcx),
      );
    },
    [endereco.qtunitcx, lastro, camada, cx, un],
  );

  const handleSubmitForm = useCallback(
    async (data: object) => {
      if (window.document.activeElement?.tagName === 'BUTTON') {
        console.log(data);

        const excludeEndereco = endAtual.enderecoOrig.findIndex(
          (end) => end.codendereco === endereco.codendereco,
        );

        if (excludeEndereco >= 0) {
          const filteredEndereco = endAtual.enderecoOrig.filter(
            (end) => end.codendereco !== endereco.codendereco,
          );

          if (filteredEndereco.length > 0) {
            history.push('endereco-inventario', filteredEndereco);
          } else {
            const response = await api.get(
              `Inventario/getProxOs/${user.code}/${endereco.codendereco}/${endereco.contagem}`,
            );

            const encontrouEndereco = response.data;

            if (encontrouEndereco) {
              history.push('endereco-inventario', encontrouEndereco);
            } else {
              history.push('inventario');
            }
          }
        }
      }
    },
    [history, user.code, endereco, endAtual.enderecoOrig],
  );

  return (
    <>
      <NavBar numInvent={endereco?.numinvent} />
      <Container>
        {!loading ? (
          <>
            <Form ref={formRefProd} onSubmit={handleGetProduct}>
              <Input
                icon={FiSearch}
                percWidth={100}
                type="number"
                id="produto"
                name="produto"
                placeholder="EAN/DUN/CODPROD"
                onChange={handleInputChange}
              />
            </Form>
            <Form ref={formRef} onSubmit={handleSubmitForm}>
              {!mostrarDescricao ? (
                <textarea
                  name="descricao"
                  rows={3}
                  placeholder="DESCRIÇÃO/EMBALAGEM"
                  disabled
                />
              ) : (
                <textarea
                  id="descricao"
                  name="descricao"
                  rows={3}
                  value={endereco.descricao}
                  disabled
                />
              )}
              <Content>
                {!mostrarDescricao ? (
                  <Input
                    percWidth={31}
                    name="qtunitcx"
                    type="number"
                    placeholder="Qt.Unit.Cx"
                    disabled
                  />
                ) : (
                  <Input
                    percWidth={31}
                    name="qtunitcx"
                    type="number"
                    defaultValue={endereco.qtunitcx}
                    placeholder="Qt.Unit.Cx"
                    disabled
                  />
                )}
                <p />
                <Input
                  percWidth={31}
                  id="lastro"
                  name="lastro"
                  type="number"
                  placeholder="Lastro"
                  onChange={(e) => setLastro(Number(e.target.value))}
                  onKeyPress={handleCalcTotal}
                />
                <p>X</p>
                <Input
                  percWidth={31}
                  id="camada"
                  name="camada"
                  type="number"
                  placeholder="Camada"
                  onChange={(e) => setCamada(Number(e.target.value))}
                  onKeyPress={handleCalcTotal}
                />
                <Input
                  icon={FiCalendar}
                  percWidth={99}
                  name="dtvalidade"
                  type="text"
                  placeholder="Data validade"
                  disabled
                />
                <Content>
                  <Input
                    percWidth={30}
                    id="qtcx"
                    name="qtcx"
                    type="number"
                    placeholder="Qt.Cx"
                    onChange={(e) => setCx(Number(e.target.value))}
                    onKeyPress={handleCalcTotal}
                  />
                  <p>+</p>
                  <Input
                    percWidth={30}
                    id="qtun"
                    name="qtun"
                    type="number"
                    placeholder="Qt.Un"
                    onChange={(e) => setUn(Number(e.target.value))}
                    onKeyPress={handleCalcTotal}
                  />
                  <p>=</p>
                  <Input
                    percWidth={30}
                    id="total"
                    name="total"
                    type="number"
                    placeholder="Total"
                    value={total}
                    disabled
                  />
                </Content>
                <button id="button" type="submit">
                  CONFIRMAR
                </button>
              </Content>
            </Form>
          </>
        ) : (
          <ReactLoading
            className="loading"
            type="spokes"
            width="100px"
            color="#c22e2c"
          />
        )}
      </Container>
    </>
  );
};

export default ConferenciaWms;