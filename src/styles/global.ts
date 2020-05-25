import { createGlobalStyle } from 'styled-components';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    outline: 0;
  }

  body {
    background: #dcdce6;
    color: #FFF;
    -webkit-font-smoothing: antialiased;
  }

  body, input, button, select, option {
    font-family: 'Roboto Slab', sans-serif;
    font-size: 16px;
  }

  input[type=number]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }

  input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
  }

  h1, h2, h3, h4, strong {
    font-weight: 500;
  }

  button {
    cursor: pointer;
  }
`;
