function addResizeHandles(el) {
  const positions = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

  positions.forEach(pos => {
    const handle = document.createElement('div');
    handle.className = `resize-handle ${pos}`;
    el.appendChild(handle);

    handle.addEventListener('mousedown', function (e) {
      e.stopPropagation();
      e.preventDefault();
      startResize(e, el, pos);
    });
  });
}

let resizing = false;
let currentResizeTarget = null;
let startX = 0, startY = 0;
let startWidth = 0, startHeight = 0;
let startLeft = 0, startTop = 0;

function startResize(e, el, direction) {
  resizing = true;
  currentResizeTarget = el;
  resizeDir = direction;

  startX = e.clientX;
  startY = e.clientY;
  startWidth = el.offsetWidth;
  startHeight = el.offsetHeight;

  // ✅ You missed these — needed to update position
  startLeft = el.offsetLeft;
  startTop = el.offsetTop;

  document.addEventListener('mousemove', performResize);
  document.addEventListener('mouseup', stopResize);
}


function performResize(e) {
  if (!resizing || !currentResizeTarget) return;

  const dx = e.clientX - startX;
  const dy = e.clientY - startY;

  let newWidth = startWidth;
  let newHeight = startHeight;
  let newLeft = startLeft;
  let newTop = startTop;

  // Horizontal resizing
  if (resizeDir.includes('e')) {
    newWidth = startWidth + dx;
  }
  if (resizeDir.includes('w')) {
    const width = startWidth - dx;
    if (width >= 50) {
      newWidth = width;
      newLeft = startLeft + dx;
    } else {
      newWidth = 50;
      newLeft = startLeft + (startWidth - 50);
    }
  }

  // Vertical resizing
  if (resizeDir.includes('s')) {
    newHeight = startHeight + dy;
  }
  if (resizeDir.includes('n')) {
    const height = startHeight - dy;
    if (height >= 30) {
      newHeight = height;
      newTop = startTop + dy;
    } else {
      newHeight = 30;
      newTop = startTop + (startHeight - 30);
    }
  }

  // Update position
  if (resizeDir.includes('w')) {
    currentResizeTarget.style.left = newLeft + 'px';
  }
  if (resizeDir.includes('n')) {
    currentResizeTarget.style.top = newTop + 'px';
  }

  // Update size
  currentResizeTarget.style.width = newWidth + 'px';
  currentResizeTarget.style.height = newHeight + 'px';

  // Resize internal content if applicable
  const img = currentResizeTarget.querySelector('img');
  const canvas = currentResizeTarget.querySelector('canvas');
  const table = currentResizeTarget.querySelector('table');

  if (img) {
    img.style.width = '100%';
    img.style.height = '100%';
  }
  if (canvas) {
    canvas.width = newWidth;
    canvas.height = newHeight;
  }
  if (table) {
    table.style.width = '100%';
    table.style.height = '100%';
  }
}




function stopResize() {
  resizing = false;
  currentResizeTarget = null;
  resizeDir = '';
  document.removeEventListener('mousemove', performResize);
  document.removeEventListener('mouseup', stopResize);
}
