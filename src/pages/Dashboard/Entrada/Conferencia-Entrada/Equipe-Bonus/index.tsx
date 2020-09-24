import React, { useRef, useCallback, useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import ReactLoading from 'react-loading';
import { useHistory } from 'react-router-dom';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import api from '../../../../../services/api';

import getValidationErrors from '../../../../../utils/getValidationErros';
import { createMessage } from '../../../../../components/Toast';
import NavBar from '../../../../../components/NavBar';
import Dialog from '../../../../../components/Dialog';
import Input from '../../../../../components/Input';
import { Container, Content, Button, Loading } from './styles';

interface FuncData {
  matricula: number;
  nome: string;
}

const EquipeBonus: React.FC = () => {
  const history = useHistory();
  const numbonus = history.location.state;
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState(false);
  const [mostrarDialog, setMostrarDialog] = useState(false);
  const [matricula, setMatricula] = useState(0);
  const [listaEquipe, setListaEquipe] = useState<FuncData[]>([]);
  const [codSelecionado, setCodSelecionado] = useState<FuncData>(
    {} as FuncData,
  );

  const buscaAjudante = useCallback(
    async (data) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          matricula: Yup.string().required('Código obrigatório.'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const ajudanteRepetido = listaEquipe.find(
          (ajud) => ajud.matricula === matricula,
        );

        if (ajudanteRepetido) {
          createMessage({
            type: 'alert',
            message: `O ajudante: ${matricula} já está na lista.`,
          });

          formRef.current?.reset();
          setLoading(false);
        } else {
          const response = await api.get<FuncData[]>(
            `Entrada/BuscaAjudanteBonus/${matricula}`,
          );

          if (response.data.length > 0) {
            const ajudante = response.data[0];

            setListaEquipe([...listaEquipe, ajudante]);

            formRef.current?.reset();
            setLoading(false);
          } else {
            createMessage({
              type: 'alert',
              message: `Nenhum funcionário encontrado com o código: ${matricula}.`,
            });

            formRef.current?.reset();
            setLoading(false);
          }
        }
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);
          setLoading(false);
        } else {
          createMessage({
            type: 'error',
            message: `Erro: ${err.message}`,
          });

          formRef.current?.reset();
          setLoading(false);
        }
      }
    },
    [matricula, listaEquipe],
  );

  const removerAjudante = useCallback(
    (retorno: boolean) => {
      if (retorno) {
        const posicaoAjudante = listaEquipe.indexOf(codSelecionado);

        listaEquipe.splice(posicaoAjudante, 1);

        formRef.current?.reset();
        setCodSelecionado({} as FuncData);
        setMostrarDialog(false);
        document.getElementById('matricula')?.focus();
      } else {
        createMessage({
          type: 'info',
          message: 'Operação abortada pelo usuário.',
        });

        formRef.current?.reset();
        setCodSelecionado({} as FuncData);
        setMostrarDialog(false);
        document.getElementById('matricula')?.focus();
      }
    },
    [listaEquipe, codSelecionado],
  );

  const conferirBonus = useCallback(() => {
    if (listaEquipe.length > 0) {
      console.log('Gravar equipe bônus.');
    } else {
      console.log('Próxima tela, nenhuma equipe informada.');
    }
  }, [listaEquipe]);
  return (
    <>
      <NavBar caminho="/entrada" />
      <Container>
        <Form ref={formRef} onSubmit={buscaAjudante}>
          <Input
            focus
            icon={FiSearch}
            id="matricula"
            name="matricula"
            type="number"
            description="CÓDIGO AJUDANTE"
            onChange={(e) => setMatricula(Number(e.target.value))}
          />
        </Form>
        <Loading>
          {!loading ? (
            <Content>
              <DataTable
                header="Equipe Bônus"
                value={listaEquipe}
                selectionMode="single"
                selection={codSelecionado}
                onSelectionChange={(e) => setCodSelecionado(e.value)}
                scrollable
                paginator
                rows={4}
                scrollHeight="420px"
                style={{ width: '100%' }}
              >
                <Column
                  field="matricula"
                  header="Código"
                  style={{ width: '70px' }}
                />
                <Column field="nome" header="Nome" style={{ width: '350px' }} />
              </DataTable>
              {mostrarDialog ? (
                <Dialog
                  title="Remover ajudante"
                  message={`Deseja realmente remover da conferência do bônus: ${numbonus} o ajudante: ${codSelecionado?.nome}?`}
                  executar={removerAjudante}
                />
              ) : (
                <Button>
                  {codSelecionado && codSelecionado.matricula ? (
                    <button
                      type="button"
                      onClick={() => setMostrarDialog(true)}
                    >
                      Remover Ajudante
                    </button>
                  ) : (
                    <button type="button" disabled>
                      Remover Ajudante
                    </button>
                  )}
                  <button type="button" onClick={conferirBonus}>
                    Conferir Bônus
                  </button>
                </Button>
              )}
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

export default EquipeBonus;
