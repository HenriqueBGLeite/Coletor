import styled from 'styled-components';

import { ToastContainer } from 'react-toastify';

export const Toast = styled(ToastContainer)`
  .Toastify__toast--info {
    background: #4648c4;
  }
  .Toastify__toast--success {
    background: #2b803f;
  }
  .Toastify__toast--warning {
    background: #ffffd4;
  }
  .Toastify__toast--error {
    background: #2b803f;
  }
`;
