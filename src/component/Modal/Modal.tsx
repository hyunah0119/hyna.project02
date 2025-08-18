import React, { useEffect, useRef } from "react";
import styled from "styled-components";

type ModalProps = {
  open: boolean;                  // 열림/닫힘 상태
  onClose: () => void;            // 닫기 콜백 (ESC/배경 클릭/닫기 버튼)
  title?: string;                 // 헤더 타이틀 (선택)
  children: React.ReactNode;      // 내용
  closeOnBackdrop?: boolean;      // 배경 클릭으로 닫기 (기본 true)
};

const Backdrop = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.45);
  z-index: 1000;
  animation: fade .18s ease;
  @keyframes fade { from { opacity: 0 } to { opacity: 1 } }
`;

const Dialog = styled.div`
  width: min(560px, calc(100% - 32px));
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 20px 48px rgba(0,0,0,.18);
  overflow: hidden;
  animation: pop .2s ease;
  @keyframes pop {
    from { transform: translateY(6px); opacity: .96; }
    to   { transform: translateY(0);   opacity: 1; }
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid #E6E2DD;

  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #333;
    margin: 0;
  }
`;

const CloseBtn = styled.button`
  font-size: 18px;
  line-height: 1;
  border: 0;
  border-radius: 8px;
  background: transparent;
  padding: 4px 8px;
  cursor: pointer;

  &:hover { background: #F7F3EE; }
`;

const Content = styled.div`
  padding: 16px;
  outline: none; /* tabIndex(-1) 포커스 시 외곽선 제거 */
`;


export default function Modal({
  open,
  onClose,
  title,
  children,
  closeOnBackdrop = true,
}: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const prevActiveElRef = useRef<HTMLElement | null>(null);
  const titleId = title ? "modal-title" : undefined;

  // 열릴 때 포커스 이동 + 바디 스크롤 잠금, 닫히면 복원
  useEffect(() => {
    if (open) {
      prevActiveElRef.current = document.activeElement as HTMLElement;
      // body scroll lock
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // 내용에 포커스
      setTimeout(() => {
        contentRef.current?.focus();
      }, 0);

      // ESC로 닫기
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", onKeyDown);

      return () => {
        window.removeEventListener("keydown", onKeyDown);
        document.body.style.overflow = prevOverflow;
        // 포커스 복원
        prevActiveElRef.current?.focus?.();
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Backdrop
      aria-hidden
      onClick={() => closeOnBackdrop && onClose()}
    >
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()} // 내부 클릭은 전파 막기
      >
        {(title || onClose) && (
          <Header>
            {title && <h3 id={titleId}>{title}</h3>}
            <CloseBtn
              type="button"
              aria-label="모달 닫기"
              onClick={onClose}
            >
              ✕
            </CloseBtn>
          </Header>
        )}

        <Content
          ref={contentRef}
          tabIndex={-1} // 포커스 받을 수 있게
        >
          {children}
        </Content>
      </Dialog>
    </Backdrop>
  );
}