let isSelecting = false;
let suppressClick = false;
let selectStartX = 0, selectStartY = 0;
const selectionBox = document.getElementById('selectionBox');

document.getElementById('editor-area').addEventListener('mousedown', (e) => {
  
  if (e.button !== 0 || e.target.closest('.element')) return;

  isSelecting = true;
  selectStartX = e.pageX;
  selectStartY = e.pageY;

  selectionBox.style.left = selectStartX + 'px';
  selectionBox.style.top = selectStartY + 'px';
  selectionBox.style.width = '0px';
  selectionBox.style.height = '0px';
  selectionBox.style.display = 'block';

  deselectAllElements();
});

document.addEventListener('mousemove', (e) => {
  if (!isSelecting) return;

  const currentX = e.pageX;
  const currentY = e.pageY;

  const left = Math.min(selectStartX, currentX);
  const top = Math.min(selectStartY, currentY);
  const width = Math.abs(selectStartX - currentX);
  const height = Math.abs(selectStartY - currentY);

  selectionBox.style.left = left + 'px';
  selectionBox.style.top = top + 'px';
  selectionBox.style.width = width + 'px';
  selectionBox.style.height = height + 'px';

  // Collision detection
  document.querySelectorAll('.element').forEach(el => {
    const r1 = selectionBox.getBoundingClientRect();
    const r2 = el.getBoundingClientRect();
    const pageRect = document.getElementById('page').getBoundingClientRect();

    const isOverlapping = !(
      r2.right < r1.left ||
      r2.left > r1.right ||
      r2.bottom < r1.top ||
      r2.top > r1.bottom
    );

    if (isOverlapping) {
      el.classList.add('selected');
    } else {
      el.classList.remove('selected');
    }
  });
});

document.addEventListener('mouseup', () => {
  if (isSelecting) {
    isSelecting = false;
    suppressClick = true;
    selectionBox.style.display = 'none';
    selectionBox.style.width = '0px';
    selectionBox.style.height = '0px';
  }

});
