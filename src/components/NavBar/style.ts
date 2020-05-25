import styled from 'styled-components';

export const Container = styled.div`
  flex: 1;
  height: 100vh;
  max-height: 50px;

  background: #c22e2c;
  display: flex;
  align-items: center;
  justify-content: space-between;

  button {
    display: flex;
    margin-left: 10px;
    margin-right: 10px;
    align-items: center;
    text-decoration: none;
    border: 0;
    background: transparent;
    color: #fff;
    transition: color 0.2s;

    &:hover {
      color: #666;
    }

    svg {
      margin-right: 6px;
    }
  }

  p {
    margin-left: -10px;
    font-size: 14px;
  }
`;
