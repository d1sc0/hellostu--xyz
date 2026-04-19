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
  try {
    const config = reviveFunctions(JSON.parse(container.dataset.config));
    if (typeof window.ApexCharts === 'undefined') {
      return;
    }
    const chart = new window.ApexCharts(container, config);
    chart.render();
  } catch (e) {
    // Optionally log errors in development only
  }
}

document.addEventListener('DOMContentLoaded', function () {
  for (const el of document.querySelectorAll(
    '.apexchart-container[data-config]',
  )) {
    renderApexChart(el);
  }
});
