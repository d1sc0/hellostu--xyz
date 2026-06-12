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
    
    // Check dark mode on initial load
    const isDarkMode = document.body.classList.contains('dark-mode');
    config.theme = config.theme || {};
    config.theme.mode = isDarkMode ? 'dark' : 'light';
    
    // Adjust grid row background colors for dark mode if present
    if (isDarkMode && config.grid && config.grid.row && config.grid.row.colors) {
      config.grid.row.colors = config.grid.row.colors.map(color => 
        color === '#f3f3f3' ? '#1e293b' : color
      );
    }

    // Inject mm:ss formatter for finishing times chart
    if (container.id === 'tgf-finish-times' && config.yaxis && config.yaxis.labels) {
      config.yaxis.labels.formatter = function (value) {
        const minutes = Math.floor(value / 60);
        const seconds = Math.round(value % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
      };
    }
    if (typeof window.ApexCharts === 'undefined') {
      return;
    }
    const chart = new window.ApexCharts(container, config);
    chart.render();
    
    // Save reference to instance and original config for dynamic theme toggling
    container.chartInstance = chart;
    container.originalConfig = JSON.parse(container.dataset.config);
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
