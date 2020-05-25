import React, { useRef, useCallback } from 'react';
import { FiZoomIn, FiHome, FiSave } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import NavBar from '../../../components/NavBar';
import Input from '../../../components/Input';
import Select from '../../../components/Select';

import { Container, Content, Header, Fieldset } from './style';

const ConsultProducts: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const handleSubmit = useCallback((data: object) => {
    console.log(data);
  }, []);
  return (
    <>
      <NavBar />
      <Container>
        <Content>
          <Form ref={formRef} onSubmit={handleSubmit}>
            <Header>
              <Input
                percWidth={67}
                name="code"
                icon={FiZoomIn}
                type="number"
                placeholder="EAN/DUN/CODPROD"
              />
              <Select name="company" icon={FiHome} percWidth={30}>
                <option value={7}>7</option>
                <option value={12}>12</option>
                <option value={25}>25</option>
                <option value={34}>34</option>
              </Select>
              <p>Vodka Orloff, se beber não dirija, se dirigir não me chame</p>
              <Input
                percWidth={30}
                name="codProd"
                type="text"
                placeholder="Cód.Prod"
                defaultValue={undefined}
                disabled
              />
            </Header>
            <Fieldset title="Unidade">
              <legend>
                <span>UNIDADE</span>
              </legend>
              <Input
                percWidth={33}
                name="packing"
                type="text"
                placeholder="Emb.Unit"
                defaultValue={undefined}
                disabled
              />
              <Input
                percWidth={33}
                name="unity"
                type="text"
                placeholder="Unid."
                defaultValue={undefined}
                disabled
              />
              <Input
                percWidth={33}
                name="qtunit"
                type="text"
                placeholder="Qt.Unit"
                defaultValue={undefined}
                disabled
              />
              <Input
                percWidth={100}
                name="ean"
                type="number"
                placeholder="Cód.Barras Unit."
                defaultValue={undefined}
              />
            </Fieldset>
            <fieldset />
            <fieldset title="Master (cm)">
              <legend>
                <span>MASTER (cm)</span>
              </legend>
              <Input
                percWidth={100}
                name="packingMaster"
                type="text"
                placeholder="Emb.Master"
                defaultValue={undefined}
                disabled
              />
              <Input
                percWidth={100}
                name="unityMaster"
                type="text"
                placeholder="Un.M"
                defaultValue={undefined}
                disabled
              />
              <Input
                percWidth={100}
                name="qtunitcx"
                type="text"
                placeholder="Qt.Cx"
                defaultValue={undefined}
                disabled
              />
              <Input
                percWidth={100}
                name="dun"
                type="number"
                placeholder="Cód.Barras Master"
                defaultValue={undefined}
              />
              <Input
                percWidth={100}
                name="heigth"
                type="number"
                placeholder="Alt"
                defaultValue={undefined}
              />
              <Input
                percWidth={100}
                name="width"
                type="number"
                placeholder="Larg"
                defaultValue={undefined}
              />
              <Input
                percWidth={100}
                name="legth"
                type="number"
                placeholder="Comp"
                defaultValue={undefined}
              />
              <Input
                percWidth={100}
                name="weight"
                type="number"
                placeholder="Peso(kg)"
                defaultValue={undefined}
              />
            </fieldset>
            <fieldset title="Norma Palete">
              <legend>
                <span>NORMA PALETE</span>
              </legend>
              <Input
                percWidth={100}
                name="ballast"
                type="number"
                placeholder="Lastro"
                defaultValue={undefined}
              />
              <Input
                percWidth={100}
                name="layer"
                type="number"
                placeholder="Camada"
                defaultValue={undefined}
              />
              <Input
                percWidth={100}
                name="total"
                type="number"
                placeholder="Total"
                defaultValue={undefined}
                disabled
              />
            </fieldset>
            <button type="submit">
              <FiSave />
              Gravar
            </button>
          </Form>
        </Content>
      </Container>
    </>
  );
};

export default ConsultProducts;
