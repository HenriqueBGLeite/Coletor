import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  width: 100%;
  max-width: 700px;
  padding: 0 8px;
  margin: auto;

  form {
    flex: 1;
    width: 100%;
    text-align: center;
  }
`;

export const Content = styled.fieldset`
  width: 100%;
  padding: 10px;
  border-radius: 8px;
  margin: 16px 5px;

  legend {
    font-family: 'Roboto Slab', sans-serif;
    font-weight: 500;
    font-size: 20px;
    color: #4f4f4f;
    padding: 0 5px;
  }

  div {
    display: flex;
    flex-wrap: wrap;

    strong {
      width: 23%;
      border-radius: 10px;
      margin: 8px 5px 0 0;
      padding: 8px;
      background-color: transparent;

      border: 2px solid #878787;
      color: #666360;
      text-align: center;
      align-items: center;

      p + p {
        margin-top: 8px;
        font-size: 30px;
      }
    }
  }
`;
