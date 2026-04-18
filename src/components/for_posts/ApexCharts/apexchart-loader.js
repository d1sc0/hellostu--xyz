import ApexCharts from 'apexcharts';

function reviveFunctions(obj) {
  for (const key in obj) {
    if (typeof obj[key] === 'string' && obj[key].startsWith('function')) {
      obj[key] = eval('(' + obj[key] + ')');
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      reviveFunctions(obj[key]);
    }
  }
  return obj;
}

function renderApexChart(container) {
  const config = reviveFunctions(JSON.parse(container.dataset.config));
  const chart = new ApexCharts(container, config);
  chart.render();
}

for (const el of document.querySelectorAll('[data-config]')) {
  renderApexChart(el);
}
