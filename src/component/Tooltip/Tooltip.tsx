import React, { useRef, useState } from "react";
import styled, { css } from "styled-components";

type Placement = "top" | "right" | "bottom" | "left";

type TooltipProps = {
  /** 툴팁 내용 */
  content: React.ReactNode;
  /** 표시 위치 (기본 bottom) */
  placement?: Placement;
  /** 나타나기 지연(ms) – 기본 200 */
  openDelay?: number;
  /** Triggers: hover/focus (기본), 필요시 onOpenChange로 외부제어도 가능 */
  onOpenChange?: (open: boolean) => void;
  /** 래핑할 트리거 요소(텍스트/아이콘/버튼 등) */
  children: React.ReactElement<any>;
};

const Wrap = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const Bubble = styled.span`
  position: absolute;
  max-width: 260px;
  padding: 8px 10px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 1.4;
  color: #fff;
  background: rgba(51, 42, 34, 0.95); /* 다크브라운 톤 */
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
  pointer-events: none;           /* 마우스 이벤트 통과 */
  white-space: nowrap;            /* 한 줄; 필요시 normal */
  z-index: 20;

  /* 초기 상태: 숨김 */
  opacity: 0;
  transform: translateY(4px);
  transition: opacity .16s ease, transform .16s ease, visibility 0s linear .16s;
  visibility: hidden;

  &[data-open="true"] {
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
    transition: opacity .16s ease, transform .16s ease;
  }

  /* 위치별 포지셔닝 */
  ${({ ["data-placement"]: p }: any) => {
    switch (p) {
      case "top":
        return css`
          bottom: 100%;
          left: 50%;
          transform: translate(-50%, -4px);
          &[data-open="true"] { transform: translate(-50%, 0); }
          margin-bottom: 8px;
        `;
      case "right":
        return css`
          left: 100%;
          top: 50%;
          transform: translate(4px, -50%);
          &[data-open="true"] { transform: translate(0, -50%); }
          margin-left: 8px;
        `;
      case "left":
        return css`
          right: 100%;
          top: 50%;
          transform: translate(-4px, -50%);
          &[data-open="true"] { transform: translate(0, -50%); }
          margin-right: 8px;
        `;
      default:
        /* bottom */
        return css`
          top: 100%;
          left: 50%;
          transform: translate(-50%, 4px);
          &[data-open="true"] { transform: translate(-50%, 0); }
          margin-top: 8px;
        `;
    }
  }}
`;

export default function Tooltip({
  content,
  placement = "bottom",
  openDelay = 200,
  onOpenChange,
  children,
}: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<number | null>(null);
  const idRef = useRef(`tip-${Math.random().toString(36).slice(2, 8)}`);

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const show = () => {
    clearTimer();
    timerRef.current = window.setTimeout(() => {
      setOpen(true);
      onOpenChange?.(true);
    }, openDelay);
  };
  const hide = () => {
    clearTimer();
    setOpen(false);
    onOpenChange?.(false);
  };

  // children에 aria-describedby/이벤트 주입
  const trigger = React.cloneElement(children, {
    onMouseEnter: (e: React.MouseEvent) => {
      children.props.onMouseEnter?.(e);
      show();
    },
    onMouseLeave: (e: React.MouseEvent) => {
      children.props.onMouseLeave?.(e);
      hide();
    },
    onFocus: (e: React.FocusEvent) => {
      children.props.onFocus?.(e);
      show();
    },
    onBlur: (e: React.FocusEvent) => {
      children.props.onBlur?.(e);
      hide();
    },
    "aria-describedby": open ? idRef.current : undefined,
  });

  return (
    <Wrap>
      {trigger}
      <Bubble
        id={idRef.current}
        role="tooltip"
        aria-hidden={!open}
        data-open={open}
        data-placement={placement}
      >
        {content}
      </Bubble>
    </Wrap>
  );
}