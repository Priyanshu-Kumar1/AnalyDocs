function addTextbox() {
  const container = document.createElement('div');
  container.className = 'element';
  container.style.left = '50px';
  container.style.top = '300px';
  container.style.minWidth = '250px';
  container.style.minHeight = '30px';
  container.style.padding = '10px';
  container.style.cursor = 'pointer';

  addResizeHandles(container);

  const p = document.createElement('p');
  p.innerText = 'Double-click to edit text...';
  p.style.margin = '0';
  p.style.fontSize = '14px';
  p.style.lineHeight = '1.6';
  p.style.color = '#333';
  p.style.wordBreak = 'break-word';

  container.appendChild(p);
  page.appendChild(container);
  makeDraggable(container);

  counts.textbox++;
  const id = `textbox-${counts.textbox}`;
  container.id = id;
  if (currentHeading) {
    const headingNode = docOutline.find((h) => h.id === currentHeading);
    headingNode?.children.push({ id, type: 'textbox', text: container.innerText });
    updateOutlineSidebar();
  }

  // Select on click
  container.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent it from bubbling to document
    deselectAllElements();
    container.classList.add('selected');
  });

  // Double-click to edit
  p.addEventListener('dblclick', (e) => {
    e.stopPropagation();
    const textarea = document.createElement('textarea');
    textarea.value = p.innerText;
    textarea.style.width = '100%';
    textarea.style.height = 'auto';
    textarea.style.minHeight = '30px';
    textarea.style.fontSize = '14px';
    textarea.style.lineHeight = '1.6';
    textarea.style.border = 'none';
    textarea.style.outline = 'none';
    textarea.style.resize = 'none';
    textarea.style.padding = '0';
    textarea.style.background = 'transparent';
    textarea.style.overflow = 'hidden';

    textarea.addEventListener('input', () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';

      const heading = docOutline.find(h => h.children.some(c => c.id === id));
      if (heading) {
        const child = heading.children.find(c => c.id === id);
        if (child) {
          child.text = textarea.value;
          updateOutlineSidebar();
        }
      }
    });

    textarea.addEventListener('blur', () => {
      p.innerText = textarea.value.trim() || 'Double-click to edit text...';
      container.replaceChild(p, textarea);
    });

    container.replaceChild(textarea, p);
    textarea.focus();

    setTimeout(() => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }, 0);
  });

}

window.addTextbox = addTextbox;