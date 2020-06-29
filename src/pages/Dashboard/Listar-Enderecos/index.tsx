import React, { useState, useCallback, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import ReactLoading from 'react-loading';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { createMessage } from '../../../components/Toast';

import NavBar from '../../../components/NavBar';
import Input from '../../../components/Input';

import api from '../../../services/api';

import { Container, Content, Loanding, Button } from './styles';

interface ProdutoPicking {
  codprod: number;
  qt: number;
  descricao: string;
  codendereco: number;
  deposito: number;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
  ean: number;
  dun: number;
  qtunitcx: number;
  erro: string;
  warning: string;
  mensagemErroWarning: string;
}

const ListarEnderecos: React.FC = () => {
  const user = JSON.parse(localStorage.getItem('@EpocaColetor:user') as string);
  const formRef = useRef<FormHandles>(null);
  const [inputProduto, setInputProduto] = useState(0);
  const [loading, setLoading] = useState(false);
  const [listaProdutos, setListaProdutos] = useState<ProdutoPicking[]>([]);

  const buscarPicking = useCallback(async () => {
    setLoading(true);
    const response = await api.get<ProdutoPicking>(
      `PesquisaProduto/getEnderecoProdutoPicking/${inputProduto}/${user.filial}`,
    );

    const pickingProduto = response.data;

    if (pickingProduto.erro === 'N' && pickingProduto.warning === 'N') {
      const produtoRepetido = listaProdutos.find(
        (prod) => prod.codprod === pickingProduto.codprod,
      );

      if (produtoRepetido) {
        listaProdutos.map((prod) => {
          if (prod.codprod === produtoRepetido.codprod) {
            const newQt = prod.qt + pickingProduto.qt;
            prod.qt = newQt;
            return prod;
          }
          return prod;
        });
        formRef.current?.reset();
        setLoading(false);
      } else {
        setListaProdutos([...listaProdutos, pickingProduto]);
        formRef.current?.reset();
        setLoading(false);
      }
    } else {
      createMessage({
        type: 'error',
        message: pickingProduto.mensagemErroWarning,
      });
      formRef.current?.reset();
      setLoading(false);
    }
  }, [user.filial, listaProdutos, inputProduto]);

  return (
    <>
      <NavBar caminho="dashboard" />
      <Container>
        <Form ref={formRef} onSubmit={buscarPicking}>
          <Input
            focus
            icon={FiSearch}
            name="codprod"
            type="number"
            description="EAN/DUN/CODPROD"
            onChange={(e) => setInputProduto(Number(e.target.value))}
          />
        </Form>
        <Loanding>
          {!loading ? (
            <Content>
              <DataTable
                header="Picking dos produtos"
                value={listaProdutos}
                scrollable
                paginator
                rows={4}
                scrollHeight="500px"
                style={{ width: '100%' }}
              >
                <Column field="rua" header="Rua" style={{ width: '50px' }} />
                <Column
                  field="predio"
                  header="Préd"
                  style={{ width: '55px' }}
                />
                <Column field="nivel" header="Nív" style={{ width: '45px' }} />
                <Column field="apto" header="Apto" style={{ width: '55px' }} />
                <Column
                  field="codprod"
                  header="Prod"
                  style={{ width: '55px' }}
                />
                <Column
                  field="descricao"
                  header="Descrição"
                  style={{ width: '260px' }}
                />
                <Column field="qt" header="Qtd" style={{ width: '55px' }} />
              </DataTable>
              <Button>
                <button type="button">Confirmar Estocagem</button>
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
        </Loanding>
      </Container>
    </>
  );
};

export default ListarEnderecos;
