import styled, { css } from 'styled-components';
import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
  percWidth: number;
}

export const Container = styled.div<ContainerProps>`
  border-radius: 10px;
  padding: 16px;
  width: 100%;

  border: 2px solid #878787;
  color: #666360;

  display: flex;
  align-items: center;

  ${(props) =>
    props.percWidth &&
    css`
      width: ${props.percWidth}%;
    `}

  ${(props) =>
    props.isErrored &&
    css`
      border-color: #c53030;
    `}

  ${(props) =>
    props.isFocused &&
    css`
      color: #005129;
      border-color: #005129;
    `}

  ${(props) =>
    props.isFilled &&
    css`
      color: #005129;
    `}


  select {
    flex: 1;
    background: transparent;
    border: 0;
    color: #333;
  }

  svg {
    margin-right: 16px;
  }
`;

export const Error = styled(Tooltip)`
  height: 20px;
  margin-left: 16px;

  svg {
    margin: 0;
  }

  span {
    background: #c53030;
    color: #fff;

    &::before {
      border-color: #c53030 transparent;
    }
  }
`;
