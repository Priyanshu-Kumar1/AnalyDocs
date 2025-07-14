function addBulletList() {
  const el = document.createElement('div');
  el.className = 'element';
  el.contentEditable = true;
  el.innerHTML = `<ul>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
  </ul>`;
  el.style.left = '50px';
  el.style.top = '150px';
  page.appendChild(el);
  makeDraggable(el);

  counts.bulletList++;
  const id = `bulletList-${counts.bulletList}`;
  el.id = id;

  if (currentHeading) {
    const headingNode = docOutline.find((h) => h.id === currentHeading);
    headingNode?.children.push(id);
    updateOutlineSidebar();
  }
}

function addNumberedList() {
  const el = document.createElement('div');
  el.className = 'element';
  el.contentEditable = true;
  el.innerHTML = `<ol>
    <li>First item</li>
    <li>Second item</li>
    <li>Third item</li>
  </ol>`;
  el.style.left = '50px';
  el.style.top = '200px';
  page.appendChild(el);
  makeDraggable(el);

  counts.numberedList++;
  const id = `numberedList-${counts.numberedList}`;
  el.id = id;

  if (currentHeading) {
    const headingNode = docOutline.find((h) => h.id === currentHeading);
    headingNode?.children.push(id);
    updateOutlineSidebar();
  }
}

window.addBulletList = addBulletList;
window.addNumberedList = addNumberedList;