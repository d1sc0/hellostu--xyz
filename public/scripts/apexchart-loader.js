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
  console.log('[ApexCharts] Found container:', container);
  try {
    const config = reviveFunctions(JSON.parse(container.dataset.config));
    console.log('[ApexCharts] Parsed config:', config);
    if (typeof window.ApexCharts === 'undefined') {
      console.error('[ApexCharts] window.ApexCharts is undefined!');
      return;
    }
    const chart = new window.ApexCharts(container, config);
    chart.render();
    console.log('[ApexCharts] Chart rendered.');
  } catch (e) {
    console.error('[ApexCharts] Error rendering chart:', e);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const els = document.querySelectorAll('.apexchart-container[data-config]');
  console.log(`[ApexCharts] Found ${els.length} chart container(s).`);
  for (const el of els) {
    renderApexChart(el);
  }
});
