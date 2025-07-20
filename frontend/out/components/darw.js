function addHorizontalLine() {
  const el = document.createElement('div');
  el.className = 'element';
  el.innerHTML = `<hr style="border: none; border-top: 1px solid #999; width: 100%;">`;
  el.style.left = '50px';
  el.style.top = '300px';
  el.style.width = '300px';
  el.style.height = '1px';
  el.style.padding = '0';

  page.appendChild(el);
  makeDraggable(el);

  counts.horizontalLine++;
  const id = `horizontalLine-${counts.horizontalLine}`;
  el.id = id;
  if (currentHeading) {
    const headingNode = docOutline.find((h) => h.id === currentHeading);
    headingNode?.children.push(id);
    updateOutlineSidebar();
  }
}

window.addHorizontalLine = addHorizontalLine;