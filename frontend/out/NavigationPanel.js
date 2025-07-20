const docOutline = []; // list of { id, title, children: [] }
let currentHeading = null;
let counts = {
  heading: 0,
  textbox: 0,
  image: 0,
  table: 0,
  chart: 0,
};


function updateOutlineSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  sidebar.innerHTML = '<h3>Outline</h3><ul class="hierarchy"></ul>';
  const list = sidebar.querySelector('ul.hierarchy');

  docOutline.forEach((heading, index) => {
    const li = document.createElement('li');
    li.className = 'outline-heading';

    const btn = document.createElement('button');
    btn.innerText = `${index + 1}. ${heading.title || 'Untitled'}`;
    btn.onclick = () => selectAndScroll(heading.id);
    li.appendChild(btn);

    // Child list
    const childList = document.createElement('ul');
    childList.className = 'outline-children';

    heading.children.forEach((childObj) => {
        const { id, type, text } = childObj;

        const childBtn = document.createElement('button');
        const childItem = document.createElement('li');

        const short = text?.trim()
            ? (text.length > 10 ? text.slice(0, 10) + '…' : text)
            : type;

        childBtn.innerHTML = `<span class="arrow">→</span> ${short}`;
        childBtn.onclick = () => selectAndScroll(id);

        childItem.appendChild(childBtn);
        childList.appendChild(childItem);
        });


    li.appendChild(childList);
    list.appendChild(li);
  });
}


function removeFromOutline(id) {
  // Remove heading if it's a heading
  const headingIndex = docOutline.findIndex(h => h.id === id);
  if (headingIndex !== -1) {
    docOutline.splice(headingIndex, 1);
    return;
  }

  // Remove child from its parent's children
  for (const h of docOutline) {
    const childIndex = h.children.findIndex(c => c.id === id);
    if (childIndex !== -1) {
      h.children.splice(childIndex, 1);
      return;
    }
  }
}


let selectedElement = null;

function selectAndScroll(id) {
  const el = document.getElementById(id);
  if (!el) return;

  // Scroll
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Remove selection from any previously selected elements
  document.querySelectorAll('.element.selected').forEach((el) => {
    el.classList.remove('selected');
  });

  // Add selected class to current
  el.classList.add('selected');
}

