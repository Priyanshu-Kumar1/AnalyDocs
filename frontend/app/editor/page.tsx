'use client'

import './editor.css'
import { useEffect, useState } from 'react'
import {
  Type, Edit2, List, Minus, MessageSquare, Image, BarChart2, Grid, AlignLeft, AlignCenter, AlignRight, AlignJustify
} from 'react-feather'
import { ListOrdered, Quote, Superscript, Subscript, Grid as LucideGrid, ListTree,  } from 'lucide-react'

import FontSelector from "@/components/FontSelector";

declare global {
  interface Window {
    updatePageSize?: () => void
    openMenu?: (menu: string) => void
    execCmd?: (cmd: string) => void
    execCmdArg?: (cmd: string, arg: any) => void
    toggleGridLines?: () => void
    drawRulers?: () => void
    addTextbox?: () => void
    togglePanel?: (type: string) => void
    toggleCategory?: (id: string) => void
    addHeading?: () => void
    addBulletList?: () => void
    addNumberedList?: () => void
    addHorizontalLine?: () => void
    addRichText?: () => void
    addQuote?: () => void
    bringToFront?: () => void
    sendToBack?: () => void
    showMore?: () => void
  }
}

export default function EditorPage() {
  const [isClient, setIsClient] = useState(false)
  const applyFont = (font: string) => {
    const editor = document.getElementById("editor");
    if (editor) {
      (editor as HTMLElement).style.fontFamily = `'${font}', sans-serif`;
    }
  };


  useEffect(() => {
    setIsClient(true)  // ✅ Mark that we are on the client now

    const chart = document.createElement('script')
    chart.src = 'https://cdn.jsdelivr.net/npm/chart.js'
    chart.defer = true
    document.body.appendChild(chart)

    const editorScript = document.createElement('script')
    editorScript.src = '/editor.js'
    editorScript.defer = true
    document.body.appendChild(editorScript)

    const resizeScript = document.createElement('script')
    resizeScript.src = '/resize.js'
    resizeScript.defer = true
    document.body.appendChild(resizeScript)

    const navigationPanel = document.createElement('script')
    navigationPanel.src = '/navigationPanel.js'
    navigationPanel.defer = true
    document.body.appendChild(navigationPanel)

    const allcomponents = document.createElement('script')
    allcomponents.src = '/allComponents.js'
    allcomponents.defer = true
    allcomponents.type = 'module'
    document.body.appendChild(allcomponents)

    const dragSelection = document.createElement('script')
    dragSelection.src = '/dragSelection.js'
    dragSelection.defer = true
    document.body.appendChild(dragSelection)

    return () => {
      document.body.removeChild(chart)
      document.body.removeChild(editorScript)
      document.body.removeChild(resizeScript)
      document.body.removeChild(navigationPanel)
      document.body.removeChild(allcomponents)
      document.body.removeChild(dragSelection)
    }
  }, [])

  if (!isClient) return null

  return (
    <>
      
      <div id="navbar">
        <a href="#" className="logo">
          <img src="/assets/logo-light.svg" id="logo" alt="AnalyDocs Logo" />
        </a>
        <div className='page-size'>
          Page Size:
          <select id="pageSizeSelect" onChange={() => window.updatePageSize?.()} defaultValue="A4">
            <option value="A4">A4 (210×297mm)</option>
            <option value="Letter">Letter (216×279mm)</option>
            <option value="Legal">Legal (216×356mm)</option>
          </select>
        </div>
      </div>

      <div className="ribbon-layout">
        <div id="menuBar">
          <div className="menu-tab" onClick={() => window.openMenu?.('home')}>Home</div>
          <div className="menu-tab" onClick={() => window.openMenu?.('insert')}>Insert</div>
          <div className="menu-tab" onClick={() => window.openMenu?.('format')}>Format</div>
        </div>

        <div id="ribbonContainer">
          <div
            id="homeRibbon"
            className="ribbon"
            style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start',
              padding: '10px 20px',
              borderBottom: '1px solid #ddd',
            }}
          >
            {/* FONT GROUP */}
            <div style={{ display: 'grid', gap: '8px', borderRight: '1px solid #ccc', paddingRight: '20px', gridTemplateColumns: 'repeat(6, 30px)',
                gridTemplateRows: 'repeat(2, 20px)', placeItems: 'center' }}>
                <button className='ribbon-element' onClick={() => window.execCmd?.('bold')} title="Bold (Ctrl+B)">𝐁</button>
                <button className='ribbon-element' onClick={() => window.execCmd?.('italic')} title="Italic (Ctrl+I)">𝑖</button>
                <button className='ribbon-element' onClick={() => window.execCmd?.('underline')} title="Underline (Ctrl+U)">U̲</button>
                <button className='ribbon-element' onClick={() => window.execCmd?.('strikeThrough')} title="Strikethrough">abc</button>
                <button className='ribbon-element' onClick={() => window.execCmd?.('subscript')} title="Subscript">
                  <Subscript size={15} />
                </button>
                <button className='ribbon-element' onClick={() => window.execCmd?.('superscript')} title="Superscript">
                  <Superscript size={15} />
                </button>
              <FontSelector className="ribbon-element font-selector" onFontChange={applyFont} style={{ gridColumn: "span 4", width: "150px", height: "30px", fontSize: "small", padding: "8px", borderRadius: "4px" }} />
              <div className='ribbon-element' style={{ fontSize: 'small', gridColumn: 'span 2', height: '30px'}}>
                <select
                  defaultValue="14px"
                  onChange={(e) => window.execCmdArg?.('fontSize', e.target.value)}
                  title="Font Size"
                >
                  <option value="8px">8</option>
                  <option value="10px">10</option>
                  <option value="12px">12</option>
                  <option value="14px">14</option>
                  <option value="18px">18</option>
                  <option value="24px">24</option>
                  <option value="32px">32</option>
                </select>
              </div>
            </div>

            {/* PARAGRAPH GROUP */}
            <div style={{ display: 'grid', gap: '8px', borderRight: '1px solid #ccc', paddingRight: '20px', gridTemplateColumns: 'repeat(4, 30px)',
                gridTemplateRows: 'repeat(2, 20px)', placeItems: 'center' }}>
              <button className='ribbon-element' onClick={() => window.execCmd?.('justifyLeft')} title="Align Left">
                <AlignLeft size={15} />
              </button>
              <button className='ribbon-element' onClick={() => window.execCmd?.('justifyCenter')} title="Center">
                <AlignCenter size={15} />
              </button>
              <button className='ribbon-element' onClick={() => window.execCmd?.('justifyRight')} title="Align Right">
                <AlignRight size={15} />
              </button>
              <button className='ribbon-element' onClick={() => window.execCmd?.('justify')} title="Align Justify">
                <AlignJustify size={15} />
              </button>
              <button className='ribbon-element' onClick={() => window.execCmdArg?.('insertUnorderedList', null)} title="Bullets">
                <List size={15} />
              </button>
              <button className='ribbon-element' onClick={() => window.execCmdArg?.('insertOrderedList', null)} title="Numbered List">
                <ListOrdered size={15} />
              </button>
              <button className='ribbon-element' onClick={() => window.execCmd?.('outdent')} title="Decrease Indent">⇤</button>
              <button className='ribbon-element' onClick={() => window.execCmd?.('indent')} title="Increase Indent">⇥</button>
            </div>

            {/* STYLE PRESETS (FUTURE) */}
            <div style={{ display: 'grid', gap: '8px', borderRight: '1px solid #ccc', paddingRight: '20px', gridTemplateColumns: 'repeat(3, 30px)',
                gridTemplateRows: 'repeat(2, 20px)', placeItems: 'center' }}>
              <button className='ribbon-element' title="Normal Text" onClick={() => window.execCmdArg?.('formatBlock', 'p')}>T</button>
              <button className='ribbon-element' title="Heading 1" onClick={() => window.execCmdArg?.('formatBlock', 'h1')}>H1</button>
              <button className='ribbon-element' title="Heading 2" onClick={() => window.execCmdArg?.('formatBlock', 'h2')}>H2</button>
            </div>

            {/* PAGE TOOLS */}
            <div style={{ display: 'grid', gap: '8px' , gridTemplateColumns: 'repeat(3, 30px)',
                gridTemplateRows: 'repeat(2, 20px)', placeItems: 'center' }}>
              <button className='ribbon-element' onClick={() => window.toggleGridLines?.()} title="Toggle Grid Lines">
                <LucideGrid size={15} /> Grid
              </button>
              <label htmlFor="unitSelect" style={{ fontSize: '12px' }}>Units</label>
              <select
                id="unitSelect"
                onChange={() => window.drawRulers?.()}
                defaultValue="mm"
                title="Ruler Units"
              >
                <option value="mm">mm</option>
                <option value="cm">cm</option>
                <option value="in">inches</option>
                <option value="px">pixels</option>
              </select>
            </div>
          </div>


          <div
            id="insertRibbon"
            className="ribbon"
            style={{
              display: 'none',
              gap: '20px',
              alignItems: 'flex-start',
            }}
          >
            {/* Text Components */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 20px)',
                gridTemplateRows: 'repeat(2, 20px)',
                gap: '10px',
                borderRight: '1px solid #ccc',
                paddingRight: '20px',
                placeItems: 'center',
              }}
            >
              <button title="Textbox" onClick={() => window.addTextbox?.()}>
                <Type size={15} />
              </button>
              <button title="Heading" onClick={() => window.addHeading?.()}>
                <Edit2 size={15} />
              </button>
              <button title="Bullet List" onClick={() => window.addBulletList?.()}>
                <List size={15} />
              </button>
              <button title="Numbered List" onClick={() => window.addNumberedList?.()}>
                <ListOrdered size={15} />
              </button>
              <button title="Horizontal Line" onClick={() => window.addHorizontalLine?.()}>
                <Minus size={15} />
              </button>
              <button title="Quote" onClick={() => window.addQuote?.()}>
                <Quote size={15} />
              </button>
            </div>

            {/* Media & Charts */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 20px)',
                gridTemplateRows: 'repeat(2, 20px)',
                gap: '10px',
                borderRight: '1px solid #ccc',
                paddingRight: '20px',
                placeItems: 'center',
              }}
            >
              <button title="Image" onClick={() => window.togglePanel?.('image')}>
                <Image size={15} />
              </button>
              <button title="Chart" onClick={() => window.togglePanel?.('chart')}>
                <BarChart2 size={15} />
              </button>
            </div>

            {/* Tables */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 20px)',
                gridTemplateRows: 'repeat(2, 20px)',
                gap: '10px',
                placeItems: 'center',
              }}
            >
              <button title="Insert Table" onClick={() => window.togglePanel?.('table')}>
                <Grid size={15} />
              </button>
            </div>
          </div>


          <div id="formatRibbon" className="ribbon" style={{ display: 'none' }}>
            <button onClick={() => window.execCmd?.('justifyLeft')}>⬅️ Left</button>
            <button onClick={() => window.execCmd?.('justifyCenter')}>↔️ Center</button>
            <button onClick={() => window.execCmd?.('justifyRight')}>➡️ Right</button>
          </div>
        </div>
      </div>

      <div id="container">
        <div id="sidebar">
          <div className='sidebar-toggle-menu'>
            <div className='category-btn-layout'>
              <button className='sidebar-toggle' onClick={() => window.togglePanel?.('navigation')}>
                <ListTree size={15} /> <span>Navigation Panel</span>
              </button>
              <button className='sidebar-toggle' onClick={() => window.togglePanel?.('page_layout')}>
                <svg xmlns="http://www.w3.org/2000/svg" height="15px" viewBox="0 -960 960 960" width="15px" fill="currentColor"><path d="M240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>
                <span>Page Layout</span>
              </button>
              <button className='sidebar-toggle' onClick={() => window.togglePanel?.('properties')}>
                <MessageSquare size={15} /> <span>Properties</span>
              </button>
            </div>
          </div>
        </div>

        <div id="editor-wrapper">
          <div id="editor-area">
            <div id="rulerY" className="ruler"></div>
            <div id="page-wrapper">
              <div id="rulerX" className="ruler"></div>
              <div id="page"></div>
            </div>
            <div id="floatingToolbar">
              <button onClick={() => window.execCmd?.('bold')} title="Bold">
                <b>𝐁</b>
              </button>
              <button onClick={() => window.execCmd?.('italic')} title="Italic">
                <i>𝑖</i>
              </button>
              <button onClick={() => window.bringToFront?.()} title="Bring to Front">
                ⬆️
              </button>
              <button onClick={() => window.sendToBack?.()} title="Send to Back">
                ⬇️
              </button>
              <button onClick={() => window.showMore?.()} title="More">
                ⋮
              </button>
            </div>
          </div>
        </div>
      </div>
      <div id="selectionBox"></div>
    </>
  )
}
