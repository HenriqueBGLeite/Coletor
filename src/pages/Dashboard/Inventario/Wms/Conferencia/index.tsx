import React, {
  useCallback,
  useEffect,
  useState,
  ChangeEvent,
  useRef,
} from 'react';
import { FiSearch } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import api from '../../../../../services/api';

import Input from '../../../../../components/Input';
import { createMessage } from '../../../../../components/Toast';
import NavBar from '../../../../../components/NavBar';
import { Container } from './style';

interface EndAtualProps {
  codendereco: number;
  tipoender: string;
  codprod: number;
  descricao: string;
  numinvent: number;
}

interface ProdutoInventario {
  codprod: number;
  descricao: string;
}

const ConferenciaWms: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const endAtual = useHistory<EndAtualProps>();
  const formRef = useRef<FormHandles>(null);
  const [mostrarDescricao, setMostrarDescricao] = useState(false);
  const [endereco, setEndereco] = useState({} as EndAtualProps);
  const [produto, setProduto] = useState(0);

  useEffect(() => {
    setEndereco(endAtual.location.state);
  }, [endAtual.location.state]);

  const handleInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setProduto(Number(event.target.value));
    },
    [],
  );

  const handleGetProduct = useCallback(async () => {
    if (endereco?.codprod !== produto && endereco?.tipoender === 'AP') {
      createMessage({
        type: 'error',
        message: 'Endereço de picking. Não foi possível alterar o produto.',
      });

      formRef.current?.setFieldValue('produto', null);
    } else if (endereco?.codprod === produto) {
      setMostrarDescricao(true);
    } else {
      const response = await api.get<ProdutoInventario>(
        `Inventario/getProdutoInventario/${produto}/${user.filial}`,
      );

      const { codprod, descricao } = response.data;
      console.log(codprod, descricao);
      console.log(endereco.codprod, endereco.descricao);

      setEndereco({ ...endereco, [codprod]: codprod, [descricao]: descricao });

      console.log(endereco.codprod, endereco.descricao);

      setMostrarDescricao(true);
    }
  }, [endereco, produto, user]);

  return (
    <>
      <NavBar numInvent={endereco?.numinvent} />
      <Container>
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
        </Form>
      </Container>
    </>
  );
};

export default ConferenciaWms;
