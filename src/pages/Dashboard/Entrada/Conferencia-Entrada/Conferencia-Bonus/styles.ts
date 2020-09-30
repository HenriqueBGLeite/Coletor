import styled from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  & > input,
  section > div {
    display: none;
  }

  margin: auto;

  ul {
    flex: 1;
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      button {
        float: left;
        padding: 10px 10.6px;
        font-size: 15px;
        border: 0;
        font-weight: bold;
        background: $unactiveColor;
        color: #444;

        &:hover {
          background: $unactiveHoverColor;
        }
        &:active {
          background: $activeColor;
        }
      }
      &:not(:last-child) button {
        border-right-width: 0;
      }
    }
  }

  section {
    clear: both;

    div {
      h2 {
        margin: 0;
        font-family: 'Raleway';
        letter-spacing: 1px;
        color: #34495e;
      }
    }
  }

  #tab1:checked ~ section .tab1,
  #tab2:checked ~ section .tab2,
  #tab3:checked ~ section .tab3 {
    display: block;
  }

  #tab1:checked ~ nav .tab1,
  #tab2:checked ~ nav .tab2,
  #tab3:checked ~ nav .tab3 {
    color: #c22e2c;
  }

  #tab1:checked ~ nav .tab1,
  #tab2:checked ~ nav .tab2,
  #tab3:checked ~ nav .tab3 {
    button {
      background: #c84241;
      color: #fff;
      position: relative;

      &:after {
        content: '';
        display: block;
        position: absolute;
        height: 2px;
        width: 100%;
        background: $activeColor;
        left: 0;
        bottom: -1px;
      }
    }
  }
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const Button = styled.div`
  display: flex;
  padding: 16px;

  button {
    background: #c22e2c;
    color: #fff;
    height: 56px;
    border-radius: 10px;
    border: 0;
    width: 100%;
    font-weight: bold;
    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#c84241')};
    }

    &:disabled {
      background: #c84250;
    }
  }

  button + button {
    margin-left: 5px;
  }
`;

export const Loading = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;

  .loading {
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    margin-top: 16px;
  }
`;

export const ContainerConf = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 8px 8px;

  width: 100%;
  margin-top: auto;

  form {
    width: 100%;
    margin: 0;
  }

  textarea {
    display: flex;
    width: 100%;
    margin-top: 8px;
    border-radius: 10px;
    padding: 10px;
    border: 2px solid #878787;

    align-items: center;
    background: transparent;
    color: #333;
    resize: vertical;

    &::placeholder {
      color: #878787;
    }
  }

  textarea + div {
    margin: 8px 0 0 0;
  }
`;

export const ContentConf = styled.div`
  display: flex;
  width: 100%;

  flex-wrap: wrap;

  input {
    font-size: 24px;

    &::placeholder {
      font-size: 16px;
    }
  }

  div + div {
    margin-top: 8px;
    margin-left: 2px;
  }

  p {
    width: 100;
    margin: 20px 2px;
    font-size: 20px;
    color: #000000;
  }

  button {
    background: #c22e2c;
    color: #fff;
    height: 56px;
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    width: 100%;
    font-weight: bold;
    margin-top: 8px;
    transition: background-color 0.2s;

    &:hover {
      background: ${shade(0.2, '#c84241')};
    }
  }

  #detalhe {
    width: 100%;
    display: flex;
    flex-wrap: wrap;

    button {
      width: 49%;
      margin: 0;
    }

    button + button {
      margin-left: 5px;
    }
  }

  .inputmask {
    border-radius: 10px;
    padding: 5px 10px;
    width: 100%;

    border: 2px solid #878787;
    color: #666360;

    display: flex;
    align-items: center;

    svg {
      margin-right: 16px;
    }
  }
`;
