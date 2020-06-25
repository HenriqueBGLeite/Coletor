import React, { useState, useCallback } from 'react';

import { Dialog as DialogPrime } from 'primereact/dialog';

import { Footer } from './styles';

interface DialogProps {
  title: string;
  message: string;
  executar: Function;
}

const Dialog: React.FC<DialogProps> = (props) => {
  const { title, message, executar } = props;
  const [action, setAction] = useState(false);

  const footer = useCallback(() => {
    return (
      <Footer>
        <button type="submit" onClick={() => executar(true)}>
          Confirmar
        </button>
        <button type="button" onClick={() => executar(false)}>
          Cancelar
        </button>
      </Footer>
    );
  }, [executar]);

  return (
    <DialogPrime
      header={title}
      visible
      style={{ width: '95vw' }}
      onHide={() => setAction(action)}
      blockScroll
      footer={footer()}
      closable={false}
      className="dialog"
    >
      <p>{message}</p>
    </DialogPrime>
  );
};

export default Dialog;
