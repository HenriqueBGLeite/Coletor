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

interface EndAtualProps {
  codendereco: number;
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

const ConferenciaWms: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const endAtual = useHistory<EndAtualProps>();
  const formRef = useRef<FormHandles>(null);
  const [mostrarDescricao, setMostrarDescricao] = useState(false);
  const [endereco, setEndereco] = useState({} as EndAtualProps);
  const [produto, setProduto] = useState(0);

  const [loading, setLoanding] = useState(false);

  useEffect(() => {
    setEndereco(endAtual.location.state);
  }, [endAtual.location.state]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setProduto(Number(event.target.value));
    },
    [],
  );

  const handleGetProduct = useCallback(
    async (data: object) => {
      try {
        formRef.current?.setErrors({});

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
          formRef.current?.setFieldValue('produto', null);
        } else if (endereco.codprod === produto) {
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
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          setLoanding(false);
          return;
        }

        createMessage({
          type: 'error',
          message: 'Erro ao realizar o login. Verifique suas credenciais.',
        });

        formRef.current?.setFieldValue('produto', null);
        setLoanding(false);
      }
    },
    [endereco, produto, user],
  );

  return (
    <>
      <NavBar numInvent={endereco?.numinvent} />
      <Container>
        {!loading ? (
          <Form ref={formRef} onSubmit={handleGetProduct}>
            <Input
              focus
              icon={FiSearch}
              percWidth={100}
              type="number"
              name="produto"
              placeholder="EAN/DUN/CODPROD"
              onChange={handleInputChange}
            />
            {!mostrarDescricao ? (
              <textarea
                name="descricao"
                rows={3}
                placeholder="DESCRIÇÃO DO PRODUTO"
                disabled
              />
            ) : (
              <textarea
                name="descricao"
                rows={3}
                value={endereco.descricao}
                placeholder="DESCRIÇÃO DO PRODUTO"
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
                name="lastro"
                type="number"
                placeholder="Lastro"
              />
              <p>X</p>
              <Input
                percWidth={31}
                name="camada"
                type="number"
                placeholder="Camada"
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
                  name="qtcx"
                  type="number"
                  placeholder="Qt.Cx"
                />
                <p>+</p>
                <Input
                  percWidth={30}
                  name="qtun"
                  type="number"
                  placeholder="Qt.Un"
                />
                <p>=</p>
                <Input
                  percWidth={30}
                  name="total"
                  type="number"
                  placeholder="Total"
                  disabled
                />
              </Content>
              <button type="submit">CONFIRMAR</button>
            </Content>
          </Form>
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
