import React, { useCallback, useMemo, useState } from "react";
import styled, { css } from "styled-components";

export type AccordionItem = {
  id: string;
  header: React.ReactNode;
  content: React.ReactNode;
};

type AccordionProps = {
  items: AccordionItem[];
  type?: "single" | "multiple";     // 기본: single
  defaultOpenIds?: string[];        // 처음에 열어둘 패널 id들
  className?: string;
};

const Wrapper = styled.div`
  display: grid;
  gap: 10px;
`;

const Item = styled.div`
  border: 1px solid #E6E2DD;
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  transition: box-shadow .2s ease;

  &[data-open="true"]{
    box-shadow: 0 8px 20px rgba(0,0,0,.08);
  }
`;

const Header = styled.div`
  display: flex;
`;

const Trigger = styled.button`
  appearance: none;
  width: 100%;
  border: 0;
  background: transparent;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
  font-weight: 700;
  color: #332;
  line-height: 1.2;

  &:hover { background: #F7F3EE; }
  &:focus-visible { outline: 2px solid #C89F65; outline-offset: 2px; }
`;

const Indicator = styled.span<{ $open: boolean }>`
  transition: transform .2s ease;
  ${({ $open }) => $open && css`transform: rotate(180deg);`}
  font-size: 14px;
  color: #6B3E26;
`;

const Panel = styled.div<{ $open: boolean }>`
  /* height:auto는 트랜지션 안 되므로 max-height 트릭 */
  max-height: 0;
  opacity: 0;
  transition: max-height .26s ease, opacity .26s ease;
  will-change: max-height, opacity;

  ${({ $open }) =>
    $open &&
    css`
      max-height: 600px;  /* 내용보다 충분히 큰 값 */
      opacity: 1;
    `}
`;

const Inner = styled.div`
  padding: 0 16px 16px;
  color: #444;
  line-height: 1.7;
`;

export default function Accordion({
  items,
  type = "single",
  defaultOpenIds = [],
  className,
}: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(
    type === "single" ? defaultOpenIds.slice(0, 1) : defaultOpenIds
  );

  const isOpen = useCallback(
    (id: string) => openIds.includes(id),
    [openIds]
  );

  const toggle = useCallback(
    (id: string) => {
      setOpenIds((prev) => {
        const opened = prev.includes(id);
        if (type === "single") {
          return opened ? [] : [id];
        }
        // multiple
        return opened ? prev.filter((x) => x !== id) : [...prev, id];
      });
    },
    [type]
  );

  // id 연결용(aria-controls / aria-labelledby)
  const random = useMemo(() => Math.random().toString(36).slice(2, 7), []);
  const getIds = (id: string) => ({
    btnId: `acc-btn-${id}-${random}`,
    panelId: `acc-panel-${id}-${random}`,
  });

  return (
    <Wrapper className={className}>
      {items.map(({ id, header, content }) => {
        const open = isOpen(id);
        const { btnId, panelId } = getIds(id);
        return (
          <Item key={id} data-open={open}>
            <Header>
              <Trigger
                id={btnId}
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => toggle(id)}
              >
                <span>{header}</span>
                <Indicator $open={open} aria-hidden>▾</Indicator>
              </Trigger>
            </Header>

            <Panel
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!open}
              $open={open}
            >
              <Inner>{content}</Inner>
            </Panel>
          </Item>
        );
      })}
    </Wrapper>
  );
}