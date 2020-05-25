import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;

  display: flex;
  align-items: stretch;
  margin: 0 10px 0 10px;
`;

export const Content = styled.div`
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 700px;
  margin: 50px auto;

  button {
    background: #fff;
    border-radius: 10px;
    border: 0;
    width: 100%;
    padding: 40px;
    font-size: 20px;
    display: block;
    text-decoration: none;

    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;

    & + button {
      margin-top: 16px;
    }

    &:hover {
      transform: translateX(10px);
    }

    svg {
      margin-left: auto;
      color: #000000;
    }
  }
`;
