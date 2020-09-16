import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;

  form {
    padding: 8px;
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
