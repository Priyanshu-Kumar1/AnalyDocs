function addHeading() {
  const el = document.createElement('div');
  counts.heading++;
  const id = `heading-${counts.heading}`;
  el.id = id;
  el.className = 'element';
  el.contentEditable = true;
  el.innerText = `Heading ${counts.heading}`;
  el.style.left = '50px';
  el.style.top = '50px';
  page.appendChild(el);
  makeDraggable(el);

  el.addEventListener('input', () => {
    const heading = docOutline.find((h) => h.id === el.id);
    if (heading) {
      heading.title = el.innerText;
      updateOutlineSidebar();
    }
  });


  // Update outline state
  docOutline.push({ id, title: el.innerText, children: [] });
  currentHeading = id;

  updateOutlineSidebar();
}

window.addHeading = addHeading;