import React, { useState, useCallback } from 'react';

import { Dialog as DialogPrime } from 'primereact/dialog';

import { Footer } from './styles';

interface DialogProps {
  title: string;
  message: string;
  tipoEndereco?: string;
  trocarProduto?: boolean;
  executar: Function;
}

const Dialog: React.FC<DialogProps> = (props) => {
  const { title, message, tipoEndereco, trocarProduto, executar } = props;
  const [action, setAction] = useState(false);

  const footer = useCallback(() => {
    return (
      <Footer>
        <button
          type="submit"
          onClick={() => executar(true, tipoEndereco, trocarProduto)}
        >
          Confirmar
        </button>
        <button type="button" onClick={() => executar(false)}>
          Cancelar
        </button>
      </Footer>
    );
  }, [executar, tipoEndereco, trocarProduto]);

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
      <p>{message}</p>
    </DialogPrime>
  );
};

export default Dialog;
