import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 400px;
  margin: auto;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  width: 100%;
  max-width: 700px;
  margin: 20px auto;

  h1 {
    font-family: 'Roboto Slab', sans-serif;
    font-weight: 700;
    font-style: italic;
    font-size: 40px;
    color: #363636;
  }

  form {
    width: 100%;
    text-align: center;

    background: transparent;
    border-radius: 10px;
    padding: 16px;

    justify-content: space-between;
  }
`;

export const Loanding = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  .loading {
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    margin-top: 16px;

    align-items: center;
    justify-content: center;
  }
`;
