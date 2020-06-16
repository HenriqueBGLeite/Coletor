import styled, { css } from 'styled-components';

import Tooltip from '../Tooltip';

interface ContainerProps {
  isFocused: boolean;
  isFilled: boolean;
  isErrored: boolean;
  width: number;
}

export const Container = styled.div<ContainerProps>`
  border-radius: 10px;
  padding: 10px;
  width: 100%;

  border: 2px solid #878787;
  color: #666360;

  display: flex;
  align-items: center;

  & + div {
    margin-top: 8px;
  }

  ${(props) =>
    props.width &&
    css`
      width: ${props.width}%;
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

  input {
    flex: 1;
    width: 100%;
    background: transparent;
    border: 0;
    color: #333;

    &::placeholder {
      color: #878787;
    }
  }

  svg {
    margin-right: 16px;
  }

  .label-float{
    position: relative;
    padding-top: 13px;
  }

  .label-float input {
    flex: 1;
    width: 100%;
    background: transparent;
    border: 0;
    color: #333;
    font-size: 20px;
    transition: all .3s ease-out;
  }

  .label-float input::placeholder{
    color:transparent;
  }

  .label-float label{
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    color: #878787;
    margin-top: 10px;
    transition: all .3s ease-out;
    -webkit-transition: all .3s ease-out;
    -moz-transition: all .3s ease-out;
  }

  .label-float input:focus + label,

  .label-float input:not(:placeholder-shown) + label {
      font-size: 10px;
      margin-top: 0;
      color: #878787;
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
