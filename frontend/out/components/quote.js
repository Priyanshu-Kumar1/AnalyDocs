function addQuote() {
  const el = document.createElement('div');
  el.className = 'element';
  el.contentEditable = true;
  el.innerHTML = `
    <blockquote style="border-left: 4px solid #ccc; margin: 0; padding-left: 10px; font-style: italic;">
      “This is a sample quote or citation.”
    </blockquote>`;
  el.style.left = '50px';
  el.style.top = '350px';
  page.appendChild(el);
  makeDraggable(el);

  counts.quote++;
  const id = `quote-${counts.quote}`;
  el.id = id;
  if (currentHeading) {
    const headingNode = docOutline.find((h) => h.id === currentHeading);
    headingNode?.children.push(id);
    updateOutlineSidebar();
  }
}

window.addQuote = addQuote;