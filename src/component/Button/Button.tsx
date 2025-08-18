import React from 'react';
import styled, { css } from 'styled-components';

type Variant = 'primary' | 'secondary' | 'outline';
type Size = 'small' | 'medium' | 'large';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
};

const ButtonStyle = styled.button<{ $variant: Variant; $size: Size }>`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s ease;

  &:disabled { opacity: .6; cursor: default; }

  ${({ $size }) => $size === 'small'  && css`font-size:12px; padding:6px 12px;`}
  ${({ $size }) => $size === 'medium' && css`font-size:14px; padding:8px 16px;`}
  ${({ $size }) => $size === 'large'  && css`font-size:16px; padding:12px 20px;`}

  ${({ $variant }) => $variant === 'primary' && css`
    color:#fff; background:#6b3e26;
    &:hover:not(:disabled){ background:#a47551; }
  `}
  ${({ $variant }) => $variant === 'secondary' && css`
    color:#6b3e26; background:#e6e2dd;
    &:hover:not(:disabled){ background:#c89f65; color:#fff; }
  `}
  ${({ $variant }) => $variant === 'outline' && css`
    color:#6b3e26; background:transparent; border:1px solid #6b3e26;
    &:hover:not(:disabled){ background:#f5f2ef; }
  `}
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  ...rest                       
}) => {
  return (
    <ButtonStyle
      $variant={variant}
      $size={size}
      disabled={disabled}
      {...rest}                  
    >
      {children}
    </ButtonStyle>
  );
};

export default Button;
