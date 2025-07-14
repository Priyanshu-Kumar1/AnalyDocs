function insertImage() {
  const url = document.getElementById('imageURL')?.value;
  const file = imageInput.files[0];

  if (!url && !file) {
    alert("Please provide an image link or upload.");
    return;
  }

  if (url) {
    createImageElement(url);
  } else {
    const reader = new FileReader();
    reader.onload = () => createImageElement(reader.result);
    reader.readAsDataURL(file);
  }
  configPanel.style.display = 'none';
}


function createImageElement(src) {
  const el = document.createElement('div');
  el.className = 'element';
  el.style.left = '60px';
  el.style.top = '150px';
  el.innerHTML = `<img src="${src}" style="width: 100%; height: 100%; max-width: 300px; max-height: 200px;">`;
  page.appendChild(el);
  makeDraggable(el);

  counts.image++;
  const id = `image-${counts.image}`;
  el.id = id;
  if (currentHeading) {
    const headingNode = docOutline.find((h) => h.id === currentHeading);
    headingNode?.children.push(id);
    updateOutlineSidebar();
  }
}

window.insertImage = insertImage;
window.createImageElement = createImageElement;