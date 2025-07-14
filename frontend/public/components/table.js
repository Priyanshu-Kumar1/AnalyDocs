function addTable() {
  const rows = parseInt(document.getElementById('tableRows')?.value || 2);
  const cols = parseInt(document.getElementById('tableCols')?.value || 2);

  const el = document.createElement('div');
  el.className = 'element';
  el.style.left = '100px';
  el.style.top = '200px';

  let html = `<table contenteditable="true" style="border-collapse: collapse; width: 100%; height: 100%;">`;
  html += `<tr>`;
  for (let c = 0; c < cols; c++) html += `<th style="border: 1px solid #ccc;">Header ${c+1}</th>`;
  html += `</tr>`;

  for (let r = 0; r < rows; r++) {
    html += `<tr>`;
    for (let c = 0; c < cols; c++) html += `<td style="border: 1px solid #ccc;">Row ${r+1}</td>`;
    html += `</tr>`;
  }
  html += `</table>`;

  el.innerHTML = html;
  el.style.width = '300px';
  el.style.height = '150px';

  page.appendChild(el);
  makeDraggable(el);

  counts.table++;
  const id = `table-${counts.table}`;
  el.id = id;
  if (currentHeading) {
    const headingNode = docOutline.find((h) => h.id === currentHeading);
    headingNode?.children.push(id);
    updateOutlineSidebar();
  }
}

window.addTable = addTable;