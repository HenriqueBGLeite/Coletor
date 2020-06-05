import styled from 'styled-components';

export const Container = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  margin-top: auto;

  form {
    flex: 1;
    margin: 8px 8px 0 8px;
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
`;
