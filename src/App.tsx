import { useState } from 'react'
import './App.scss'

import Button from './component/Button/Button'
import Modal from './component/Modal/Modal'
import Tabs, { type TabItem } from './component/Tab/Tabs'
import Accordion, { type AccordionItem } from './component/Accordion/Accordion'
import Tooltip from './component/Tooltip/Tooltip'


function App() {
  const [open, setOpen] = useState(false);

  /*
  const tabItems: TabItem[] = [
    { value: "guide", label: "가이드", content: <p>컴포넌트 사용 가이드입니다.</p> },
    { value: "examples", label: "예시", content: <Button>예시 버튼</Button> },
    { value: "notes", label: "비고", content: <p>추가 메모 영역</p> },
  ];
  */

  const accItems: AccordionItem[] = [
    { id: 'a1', header: '01 예시', content: <p>1번 예시</p> },
    { id: 'a2', header: '02 예시', content: <p>2번 예시</p> },
    { id: 'a3', header: '03 예시', content: <p>3번 예시</p> },
  ];

  const [tab, setTab] = useState("guide");

  return (
    <div className='wrap'>
      <h1>UI Components</h1>

      {/* Button */}
      <section>
        <h3 className='title'>## Button</h3>

        <article>
          <div className='box'>
            <h5>01. 큰 사이즈</h5>
  
            <Button variant="primary" size="large">Primary</Button>
            <Button variant="secondary" size="large">Secondary</Button>
            <Button variant="outline" size="large">Outline</Button>
          </div>
  
          <div className='box'>
            <h5>02. 중간 사이즈</h5>
  
            <Button variant="primary" size="medium">Primary</Button>
            <Button variant="secondary" size="medium">Secondary</Button>
            <Button variant="outline" size="medium">Outline</Button>
          </div>
  
          <div className='box'>
            <h5>03. 작은 사이즈</h5>
  
            <Button variant="primary" size="small">Primary</Button>
            <Button variant="secondary" size="small">Secondary</Button>
            <Button variant="outline" size="small">Outline</Button>
          </div>
  
          <div className='box'>
            <h5>04. disabled</h5>
  
            <Button variant="primary" size="small" disabled>Primary</Button>
            <Button variant="secondary" size="small" disabled>Secondary</Button>
            <Button variant="outline" size="small" disabled>Outline</Button>
          </div>
        </article>
      </section>

      {/* Modal */}
      <section>
        <h3 className='title'>## Modal</h3>

        <article>
          <div style={{ display:'flex', gap:12 }}>
            <Button onClick={() => setOpen(true)}>모달 열기</Button>
          </div>
        </article>

        <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="제목입니다."
        >
          <p>HYNA 포트폴리오 입니다.</p>
          <div style={{ marginTop: 12, display:'flex', gap:8 }}>
            <Button variant="secondary" onClick={() => setOpen(false)}>닫기</Button>
          </div>
        </Modal>
      </section>
      
      {/* Tabs */}
      {/*
      <section>
        <h3 className='title'>## Tabs</h3>

        <Tabs tabs={tabItems} value={tab} onValueChange={setTab} />
      </section>
      */}

      {/* Accordion */}
      <section>
        <h3 className='title'>## Accordion</h3>

        <article>
          <Accordion items={accItems} type="single" defaultOpenIds={['a1']} />
        </article>
      </section>

      {/* Tooltip */}
      <section>
        <h3 className='title'>## Tooltip</h3>

        <article>
          <div style={{ display:'flex', gap:16, flexWrap:'wrap', alignItems:'center' }}>
            <Tooltip content="기본(bottom) 툴팁">
              <Button variant="secondary">Hover me</Button>
            </Tooltip>
  
            <Tooltip content="위에 표시됩니다" placement="top">
              <Button variant="outline">Top</Button>
            </Tooltip>
  
            <Tooltip content="오른쪽에 표시됩니다" placement="right">
              <span style={{ padding: 8, border: '1px dashed #C89F65', borderRadius: 8 }}>Text target</span>
            </Tooltip>
  
            <Tooltip content="지연 600ms 후 표시" openDelay={600}>
              <Button>Delay 600ms</Button>
            </Tooltip>
          </div>
        </article>
      </section>
    </div>
  )
}

export default App
