function addChart() {
  const type = document.getElementById('chartType')?.value || 'bar';
  const labels = document.getElementById('chartLabels')?.value.split(',').map(l => l.trim());
  const values = document.getElementById('chartValues')?.value.split(',').map(Number);

  const el = document.createElement('div');
  el.className = 'element';
  el.style.left = '150px';
  el.style.top = '250px';

  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 200;
  el.appendChild(canvas);
  page.appendChild(el);
  makeDraggable(el);

  counts.chart++;
  const id = `chart-${counts.chart}`;
  el.id = id;
  if (currentHeading) {
    const headingNode = docOutline.find((h) => h.id === currentHeading);
    headingNode?.children.push(id);
    updateOutlineSidebar();
  }

  new Chart(canvas, {
    type,
    data: {
      labels,
      datasets: [{
        label: 'Chart',
        data: values,
        backgroundColor: ['#4CAF50', '#2196F3', '#FFC107'],
        borderColor: '#333'
      }]
    },
    options: {
      responsive: false,
      maintainAspectRatio: false
    }
  });

  configPanel.style.display = 'none';
}

window.addChart = addChart;