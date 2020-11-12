import React, { useCallback, useState, useEffect, useRef } from 'react';
import { FiTruck } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import getValidationErrors from '../../../../../../../utils/getValidationErros';

import api from '../../../../../../../services/api';
import NavBar from '../../../../../../../components/NavBar';
import { createMessage } from '../../../../../../../components/Toast';
import Input from '../../../../../../../components/Input';

import { Container, Loanding } from './styles';

interface DataOs {
  boxOrig: number;
  numcar: number;
  qtPend: number;
}

interface DataPendencia {
  letra: string;
  numos: number;
  numvol: number;
  codprod: number;
  descricao: string;
  rua: number;
  predio: number;
  nivel: number;
  apto: number;
  tipoos: string;
  separador: string;
}

const OsPendente: React.FC = () => {
  const history = useHistory();
  const dataOs = history.location.state as DataOs;
  const [pendencia, setPendencia] = useState<DataPendencia[]>([]);
  const [loading, setLoading] = useState(false);
  const [numCarregamento, setNumCarregamento] = useState(0);
  const formRef = useRef<FormHandles>(null);

  useEffect(() => {
    setLoading(true);
    async function loadDiverg(): Promise<void> {
      try {
        const response = await api.get<DataPendencia[]>(
          `ConferenciaSaida/PendenciaOsCarregamento/${dataOs.numcar}`,
        );

        setPendencia(response.data);
        setLoading(false);
      } catch (err) {
        createMessage({
          type: 'error',
          message: `Error: ${err.message}`,
        });
        setLoading(false);
      }
    }

    if (dataOs.numcar) {
      loadDiverg();
    } else {
      setLoading(false);
    }
  }, [dataOs]);

  const pendenciaCarga = useCallback(async (data) => {
    try {
      setLoading(true);
      formRef.current?.setErrors({});

      const schema = Yup.object().shape({
        numcar: Yup.string().required('Informe a carga.'),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      const response = await api.get<DataPendencia[]>(
        `ConferenciaSaida/PendenciaOsCarregamento/${data.numcar}`,
      );

      const pendencias = response.data.length;

      if (pendencias > 0) {
        setNumCarregamento(data.numcar);
        setPendencia(response.data);
        setLoading(false);
      } else {
        createMessage({
          type: 'alert',
          message: `Nenhuma pendencia encontrada para o carregamento: ${data.numcar}`,
        });
        setPendencia([]);
        formRef.current?.clearField('numcar');
        setLoading(false);
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);

        formRef.current?.setErrors(errors);
      }

      createMessage({
        type: 'error',
        message: `Error: ${err.message}`,
      });
      setLoading(false);
    }
  }, []);

  return (
    <>
      {dataOs.numcar ? (
        <>
          <NavBar
            caminho="/conferencia-saida/conferencia-os"
            numCarregamento={dataOs.numcar}
            params={dataOs}
          />
          <Loanding>
            {!loading ? (
              <DataTable
                header={`O.S pendentes da carga: ${dataOs.numcar}`}
                value={pendencia}
                scrollable
                paginator
                rows={5}
                scrollHeight="500px"
                style={{ width: '100%' }}
              >
                <Column field="letra" header="Cli" style={{ width: '55px' }} />
                <Column
                  field="numpalete"
                  header="Pal"
                  style={{ width: '45px' }}
                />
                <Column field="numos" header="O.S" style={{ width: '90px' }} />
                <Column field="numvol" header="Vol" style={{ width: '45px' }} />
                <Column
                  field="codprod"
                  header="Prod"
                  style={{ width: '60px' }}
                />
                <Column
                  field="descricao"
                  header="Descrição"
                  style={{ width: '200px' }}
                />
                <Column field="rua" header="Rua" style={{ width: '45px' }} />
                <Column field="predio" header="Pré" style={{ width: '50px' }} />
                <Column field="nivel" header="Nív" style={{ width: '45px' }} />
                <Column field="apto" header="Apto" style={{ width: '54px' }} />
                <Column
                  field="tipoos"
                  header="Tipo O.S"
                  style={{ width: '160px' }}
                />
                <Column
                  field="separador"
                  header="Separador"
                  style={{ width: '200px' }}
                />
              </DataTable>
            ) : (
              <ReactLoading
                className="loading"
                type="spokes"
                width="100px"
                color="#c22e2c"
              />
            )}
          </Loanding>
        </>
      ) : (
        <>
          <NavBar caminho="/conferencia-saida/conferencia-os" params={dataOs} />

          <Container>
            <Form ref={formRef} onSubmit={pendenciaCarga}>
              <Input
                focus
                icon={FiTruck}
                name="numcar"
                type="number"
                description="CARREGAMENTO"
              />
            </Form>
            <Loanding>
              {!loading ? (
                <DataTable
                  header={`O.S pendentes da carga: ${numCarregamento}`}
                  value={pendencia}
                  scrollable
                  paginator
                  rows={4}
                  scrollHeight="500px"
                  style={{ width: '100%' }}
                >
                  <Column
                    field="letra"
                    header="Cli"
                    style={{ width: '55px' }}
                  />
                  <Column
                    field="numpalete"
                    header="Pal"
                    style={{ width: '45px' }}
                  />
                  <Column
                    field="numos"
                    header="O.S"
                    style={{ width: '90px' }}
                  />
                  <Column
                    field="numvol"
                    header="Vol"
                    style={{ width: '45px' }}
                  />
                  <Column
                    field="codprod"
                    header="Prod"
                    style={{ width: '60px' }}
                  />
                  <Column
                    field="descricao"
                    header="Descrição"
                    style={{ width: '200px' }}
                  />
                  <Column field="rua" header="Rua" style={{ width: '45px' }} />
                  <Column
                    field="predio"
                    header="Pré"
                    style={{ width: '50px' }}
                  />
                  <Column
                    field="nivel"
                    header="Nív"
                    style={{ width: '45px' }}
                  />
                  <Column
                    field="apto"
                    header="Apto"
                    style={{ width: '54px' }}
                  />
                  <Column
                    field="tipoos"
                    header="Tipo O.S"
                    style={{ width: '120px' }}
                  />
                  <Column
                    field="separador"
                    header="Separador"
                    style={{ width: '200px' }}
                  />
                </DataTable>
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
      )}
    </>
  );
};

export default OsPendente;
