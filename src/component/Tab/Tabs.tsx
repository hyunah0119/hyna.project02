import React, { useMemo, useRef } from "react";
import styled, { css } from "styled-components";

export type TabItem = {
  value: string;
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  value: string;                                // 현재 활성 탭 값
  onValueChange: (next: string) => void;        // 탭 변경 콜백
  orientation?: "horizontal" | "vertical";      // 기본 horizontal
};

const Wrapper = styled.div<{["data-orient"]?: "horizontal" | "vertical"}>`
  display: grid;
  gap: 12px;

  &[data-orient="vertical"]{
    grid-template-columns: 200px 1fr;
    align-items: start;
  }
`;

const TabList = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const TabButton = styled.button<{ $selected: boolean }>`
  appearance: none;
  border: 0;
  padding: 8px 14px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  background: #E6E2DD;
  color: #6B3E26;
  transition: background .2s ease, color .2s ease, box-shadow .2s ease;

  &:hover { background: #C89F65; color: #fff; }

  ${({ $selected }) =>
    $selected &&
    css`
      background: #6B3E26;
      color: #fff;
      box-shadow: 0 8px 20px rgba(0,0,0,.12);
    `}

  &:focus-visible {
    outline: 2px solid #C89F65;
    outline-offset: 2px;
  }
`;

const TabPanel = styled.div`
  padding: 16px;
  border: 1px solid #E6E2DD;
  border-radius: 12px;
  background: #fff;
`;


export default function Tabs({
  tabs,
  value,
  onValueChange,
  orientation = "horizontal",
}: TabsProps) {
  const ids = useMemo(() => {
    // id 연결용 (tab / panel)
    const rand = Math.random().toString(36).slice(2, 7);
    return tabs.map((t) => ({
      tabId: `tab-${t.value}-${rand}`,
      panelId: `panel-${t.value}-${rand}`,
    }));
  }, [tabs]);

  const currentIndex = Math.max(0, tabs.findIndex(t => t.value === value));
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const moveFocus = (toIndex: number) => {
    const total = tabs.length;
    const i = (toIndex + total) % total;
    tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const horiz = orientation === "horizontal";
    switch (e.key) {
      case "ArrowRight":
        if (horiz) { e.preventDefault(); moveFocus(currentIndex + 1); }
        break;
      case "ArrowLeft":
        if (horiz) { e.preventDefault(); moveFocus(currentIndex - 1); }
        break;
      case "ArrowDown":
        if (!horiz) { e.preventDefault(); moveFocus(currentIndex + 1); }
        break;
      case "ArrowUp":
        if (!horiz) { e.preventDefault(); moveFocus(currentIndex - 1); }
        break;
      case "Home":
        e.preventDefault(); moveFocus(0); break;
      case "End":
        e.preventDefault(); moveFocus(tabs.length - 1); break;
      case "Enter":
      case " ":
        // 포커스된 탭을 활성화
        e.preventDefault();
        {
          const focusedIndex = tabRefs.current.findIndex(el => el === document.activeElement);
          if (focusedIndex >= 0) onValueChange(tabs[focusedIndex].value);
        }
        break;
    }
  };

  return (
    <Wrapper data-orient={orientation}>
      <TabList
        role="tablist"
        aria-orientation={orientation}
        onKeyDown={onKeyDown}
      >
        {tabs.map((t, i) => {
          const selected = t.value === value;
          const { tabId, panelId } = ids[i];
          return (
            <TabButton
              key={t.value}
              id={tabId}
              role="tab"
              ref={(el) => (tabRefs.current[i] = el)}
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              $selected={selected}
              onClick={() => onValueChange(t.value)}
            >
              {t.label}
            </TabButton>
          );
        })}
      </TabList>

      {tabs.map((t, i) => {
        const selected = t.value === value;
        const { tabId, panelId } = ids[i];
        return (
          <TabPanel
            key={t.value}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!selected}
          >
            {selected && t.content}
          </TabPanel>
        );
      })}
    </Wrapper>
  );
}