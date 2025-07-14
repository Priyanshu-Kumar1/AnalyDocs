const page = document.getElementById('page');
const rulerX = document.getElementById('rulerX');
const rulerY = document.getElementById('rulerY');
const configPanel = document.getElementById('configPanel');
const panelContent = document.getElementById('panelContent');
const imageInput = document.getElementById('imageUpload');

let dragTarget = null;
let offsetX = 0, offsetY = 0;

const pageSizes = {
  A4: { width: '794px', height: '1123px' },
  Letter: { width: '816px', height: '1056px' },
  Legal: { width: '816px', height: '1344px' },
};

function openMenu(tab) {
  const ribbons = document.querySelectorAll('.ribbon');
  ribbons.forEach(r => r.style.display = 'none');

  document.getElementById(tab + 'Ribbon').style.display = 'flex';
}

function execCmd(cmd) {
  document.execCommand(cmd, false, null);
}

function execCmdArg(cmd, val) {
  document.execCommand(cmd, false, val);
}

window.onload = () => {
  updatePageSize();
  openMenu('home');
};


function updatePageSize() {
  const value = document.getElementById('pageSizeSelect').value;
  const size = pageSizes[value];
  page.style.width = size.width;
  page.style.height = size.height;
  drawRulers();
}

function drawRulers() {
  rulerX.innerHTML = '';
  rulerY.innerHTML = '';

  const unit = document.getElementById('unitSelect').value;
  const dpi = 96;

  let unitLabel = unit;
  let unitToPx = 1;
  let majorEvery = 10;

  if (unit === 'mm') {
    unitToPx = 3.78;
    majorEvery = 10;
  } else if (unit === 'cm') {
    unitToPx = 37.8;
    majorEvery = 1;
  } else if (unit === 'in') {
    unitToPx = dpi;
    majorEvery = 1;
  } else if (unit === 'px') {
    unitToPx = 1;
    majorEvery = 50;
  }

  const pageWidth = page.offsetWidth;
  const pageHeight = page.offsetHeight;
  const unitsX = Math.ceil(pageWidth / unitToPx);
  const unitsY = Math.ceil(pageHeight / unitToPx);

  // Horizontal ruler
  for (let i = 0; i <= unitsX; i++) {
    const tick = document.createElement('div');
    tick.style.width = unitToPx + 'px';
    tick.style.borderLeft = '1px solid #999';
    tick.style.height = (i % majorEvery === 0) ? '14px' : '6px';
    tick.style.position = 'relative';
    tick.style.display = 'inline-block';
    tick.style.boxSizing = 'border-box';

    if (i % majorEvery === 0) {
      const label = document.createElement('div');
      label.innerText = i;
      label.style.position = 'absolute';
      label.style.bottom = '0';
      label.style.left = '0';
      label.style.fontSize = '8px';
      label.style.transform = 'translateX(-50%)';
      tick.appendChild(label);
    }

    rulerX.appendChild(tick);
  }

  // Vertical ruler
  for (let i = 0; i <= unitsY; i++) {
    const tick = document.createElement('div');
    tick.style.height = unitToPx + 'px';
    tick.style.borderTop = '1px solid #999';
    tick.style.width = (i % majorEvery === 0) ? '14px' : '6px';
    tick.style.position = 'relative';
    tick.style.display = 'block';
    tick.style.boxSizing = 'border-box';

    if (i % majorEvery === 0) {
      const label = document.createElement('div');
      label.innerText = i;
      label.style.position = 'absolute';
      label.style.right = '0';
      label.style.top = '0';
      label.style.fontSize = '8px';
      label.style.transform = 'translateY(-50%)';
      tick.appendChild(label);
    }

    rulerY.appendChild(tick);
  }

  // Align rulers with page
  rulerX.style.left = page.offsetLeft + 'px';
  rulerY.style.top = page.offsetTop + 'px';
}


function makeDraggable(el) {
  let isDragging = false;

  el.addEventListener('mousedown', (e) => {
    if (e.target.closest('.toolbar-button') || e.target.closest('.toolbar-menu')) return;

    const isInEditMode = el.querySelector('textarea');
    const clickedInsideTextarea = e.target.tagName === 'TEXTAREA' || e.target.closest('textarea');
    if (isInEditMode && clickedInsideTextarea) {
      // Prevent dragging if in edit mode and clicked inside textarea
      console.log("Dragging prevented in edit mode");
      return;
    }

    isDragging = true;
    const rect = el.getBoundingClientRect();
    const pageRect = page.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;

    document.body.classList.add('noselect');

    dragTarget = el;
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
  });

  function drag(e) {
    if (!dragTarget) return;

    const pageRect = page.getBoundingClientRect();
    const dx = e.clientX - pageRect.left - offsetX + page.scrollLeft;
    const dy = e.clientY - pageRect.top - offsetY + page.scrollTop;

    const snapX = snapTo(dx, 10);
    const snapY = snapTo(dy, 10);

    dragTarget.style.left = snapX + 'px';
    dragTarget.style.top = snapY + 'px';

    showAlignmentGuides(dragTarget);
  }


  function stopDrag() {
    dragTarget = null;
    clearGuides();
    document.body.classList.remove('noselect'); 
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
  }

}


function snapTo(value, interval = 10) {
  return Math.round(value / interval) * interval;
}

let existingGuides = [];

function showAlignmentGuides(el) {
  clearGuides();

  const elements = Array.from(document.querySelectorAll('.element')).filter(e => e !== el);
  const elRect = el.getBoundingClientRect();
  const elCenterX = elRect.left + elRect.width / 2;
  const elCenterY = elRect.top + elRect.height / 2;

  const pageRect = page.getBoundingClientRect();
  const pageCenterX = pageRect.left + pageRect.width / 2;
  const pageCenterY = pageRect.top + pageRect.height / 2;

  // Show guide if element aligns with page center (horizontal)
  if (Math.abs(elCenterX - pageCenterX) < 5) {
    drawVerticalGuide(pageCenterX - pageRect.left); // relative to page
  }

  // Show guide if element aligns with page center (vertical)
  if (Math.abs(elCenterY - pageCenterY) < 5) {
    drawHorizontalGuide(pageCenterY - pageRect.top); // relative to page
  }

  // Compare with other elements (existing logic, if any)
  elements.forEach(other => {
    const otherRect = other.getBoundingClientRect();

    // left-edge align
    if (Math.abs(elRect.left - otherRect.left) < 5) {
      drawVerticalGuide(other.offsetLeft);
    }

    // top-edge align
    if (Math.abs(elRect.top - otherRect.top) < 5) {
      drawHorizontalGuide(other.offsetTop);
    }
  });
}

function drawVerticalGuide(x) {
  const guide = document.createElement('div');
  guide.className = 'guideline vertical-line';
  guide.style.left = x + 'px';
  guide.style.top = 0;
  guide.style.height = '100%';
  guide.style.width = '1px';
  guide.style.position = 'absolute';
  guide.style.background = 'blue';
  page.appendChild(guide);
}


function drawHorizontalGuide(y) {
  const guide = document.createElement('div');
  guide.className = 'guideline horizontal-line';
  guide.style.top = y + 'px';
  guide.style.left = 0;
  guide.style.width = '100%';
  guide.style.height = '1px';
  guide.style.position = 'absolute';
  guide.style.background = 'blue';
  page.appendChild(guide);
}

function removeGuidelines() {
  document.querySelectorAll('.guideline').forEach(g => g.remove());
}


function clearGuides() {
  removeGuidelines();
}


function toggleGridLines() {
  page.classList.toggle('grid');
}


function createToolbar(el) {
  const btn = document.createElement('div');
  btn.className = 'toolbar-button';
  btn.innerText = '⚙';
  el.appendChild(btn);

  const toolbar = document.getElementById('floatingToolbar');

  function showToolbar() {
    const elRect = el.getBoundingClientRect();
    const editorRect = document.getElementById('editor-area').getBoundingClientRect();

    toolbar.style.left = (elRect.left - editorRect.left) + 'px';
    toolbar.style.top = (elRect.top - editorRect.top - 35) + 'px';
    toolbar.style.display = 'flex';

    window._activeElement = el;
  }

  el.addEventListener('mouseenter', () => {
    showToolbar();
  });

  el.addEventListener('mouseleave', () => {
    setTimeout(() => {
      if (!toolbar.matches(':hover')) toolbar.style.display = 'none';
    }, 200);
  });

  toolbar.addEventListener('mouseleave', () => {
    toolbar.style.display = 'none';
  });
}

function execCmd(cmd) {
  document.execCommand(cmd);
}

function bringToFront() {
  const el = window._activeElement;
  if (el) el.style.zIndex = parseInt(el.style.zIndex || 1) + 10;
}

function sendToBack() {
  const el = window._activeElement;
  if (el) el.style.zIndex = Math.max(1, parseInt(el.style.zIndex || 1) - 10);
}

function showMore() {
  alert("More formatting features coming soon!");
}


function bringToFront() {
  const el = window._activeElement;
  if (el) el.style.zIndex = parseInt(el.style.zIndex || 1) + 10;
}

function sendToBack() {
  const el = window._activeElement;
  if (el) el.style.zIndex = Math.max(1, parseInt(el.style.zIndex || 1) - 10);
}


function togglePanel(type) {
  panelContent.innerHTML = '<h3>Configuration</h3>';
  configPanel.style.display = 'block';

  if (type === 'textbox') {
    panelContent.innerHTML = `<button onclick="addTextbox()">Add Textbox</button>`;
  }

  if (type === 'image') {
    panelContent.innerHTML = `
      <label>Image URL:</label>
      <input type="text" id="imageURL" placeholder="https://...">
      <button onclick="imageInput.click()">Upload Image</button>
      <button onclick="insertImage()">Add Image</button>
    `;
  }

  if (type === 'table') {
    panelContent.innerHTML = `
      <label>Rows:</label>
      <input type="number" id="tableRows" value="2" min="1">
      <label>Columns:</label>
      <input type="number" id="tableCols" value="2" min="1">
      <button onclick="addTable()">Add Table</button>
    `;
  }

  if (type === 'chart') {
    panelContent.innerHTML = `
      <label>Type (bar/line):</label>
      <input type="text" id="chartType" value="bar">
      <label>Labels (comma-separated):</label>
      <input type="text" id="chartLabels" value="Jan,Feb,Mar">
      <label>Values (comma-separated):</label>
      <input type="text" id="chartValues" value="10,20,30">
      <button onclick="addChart()">Add Chart</button>
    `;
  }
}


updatePageSize();


function toggleCategory(id) {
  const section = document.getElementById(id);
  section.style.display = (section.style.display === 'none') ? 'block' : 'none';
}

function deselectAllElements() {
  document.querySelectorAll('.element.selected').forEach(el => {
    el.classList.remove('selected');
  });
}



document.addEventListener('keydown', function (e) {
  if (e.key === 'Delete') {
    document.querySelectorAll('.element.selected').forEach(el => {
      // Check if it's NOT in edit mode (no textarea inside)
      if (!el.querySelector('textarea')) {
        const id = el.id;
        el.remove();
        removeFromOutline(id);
        updateOutlineSidebar();
        selectedElement = null;
      }
    });
  }
});

