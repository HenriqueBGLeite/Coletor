import React, { useState, useCallback, useRef } from 'react';
import { FiLock } from 'react-icons/fi';
import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import { Dialog as DialogPrime } from 'primereact/dialog';

import Input from '../Input';

import { Container, Footer } from './styles';

interface DialogProps {
  title: string;
  message: string;
  tipoEndereco?: string;
  trocarProduto?: boolean;
  mostraInput?: boolean;
  executar: Function;
}

interface ConfirmarProps {
  confirmar: boolean;
  tipoEndereco: string;
  trocarProduto: boolean;
  senha: string;
}
const Dialog: React.FC<DialogProps> = (props) => {
  const formRef = useRef<FormHandles>(null);
  const [senha, setSenha] = useState('');
  const {
    title,
    message,
    tipoEndereco,
    trocarProduto,
    executar,
    mostraInput,
  } = props;

  const [action, setAction] = useState(false);

  const footer = useCallback(() => {
    return (
      <Footer>
        <button
          type="submit"
          onClick={() => executar(true, tipoEndereco, trocarProduto, senha)}
        >
          Confirmar
        </button>
        <button type="button" onClick={() => executar(false)}>
          Cancelar
        </button>
      </Footer>
    );
  }, [executar, tipoEndereco, trocarProduto, senha]);

  return (
    <DialogPrime
      header={title}
      visible
      style={{ width: '95vw', fontWeight: 'bold', fontSize: '16px' }}
      onHide={() => setAction(action)}
      blockScroll
      footer={footer()}
      closable={false}
    >
      <Container>
        <p>{message}</p>
        {mostraInput ? (
          <Form
            ref={formRef}
            onSubmit={() => executar(true, tipoEndereco, trocarProduto, senha)}
          >
            <Input
              icon={FiLock}
              name="senha"
              type="number"
              description="Informe a senha"
              onChange={(e) => setSenha(e.target.value)}
            />
          </Form>
        ) : (
          ''
        )}
      </Container>
    </DialogPrime>
  );
};

export default Dialog;
