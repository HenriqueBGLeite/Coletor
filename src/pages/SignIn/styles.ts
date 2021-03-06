import styled, { keyframes } from 'styled-components';
import { shade } from 'polished';

export const Container = styled.div`
  height: 100%;

  display: flex;
  align-items: stretch;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;
  max-width: 700px;
  margin: 0 auto;
`;

const appearFromAbove = keyframes`
  from {
    opacity: 0;
    transform: translateY(-100px);
  }
  to {
    opacity: 1;
    transform: translateY(0px);
  }
`;

export const AnimationContainer = styled.div`
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  animation: ${appearFromAbove} 1s;

  img {
    width: 100%;
    max-height: 700px;
  }

  @media (max-width: 400px) {
    img {
      width: 100%;
      max-height: 180px;
    }
  }

  form {
    width: 100%;
    text-align: center;

    background: transparent;
    border-radius: 10px;
    padding: 0 16px;

    justify-content: space-between;
  }

  p {
    background-color: #ededf2;
    color: black;
    font-size: 10px;
    text-align: right;
  }
`;

export const Loanding = styled.div`
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

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

  .loading {
    width: 100%;
    height: 56px;
    border-radius: 10px;
    border: 0;
    padding: 0 16px;
    margin-top: 16px;
  }
`;
