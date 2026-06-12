document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.getElementById('darkmode-toggle');
  
  function updateChartsTheme(isDark) {
    document.querySelectorAll('.apexchart-container').forEach(container => {
      if (container.chartInstance) {
        const updateConfig = {
          theme: { mode: isDark ? 'dark' : 'light' }
        };
        
        // If original config had grid row colors, adjust them dynamically for dark/light mode
        if (container.originalConfig && container.originalConfig.grid && container.originalConfig.grid.row && container.originalConfig.grid.row.colors) {
          updateConfig.grid = {
            row: {
              colors: isDark 
                ? container.originalConfig.grid.row.colors.map(c => c === '#f3f3f3' ? '#1e293b' : c)
                : container.originalConfig.grid.row.colors
            }
          };
        }
        
        container.chartInstance.updateOptions(updateConfig);
      }
    });
  }

  toggle?.addEventListener('click', function (e) {
    e.preventDefault();
    document.body.classList.toggle('dark-mode');
    
    const isDark = document.body.classList.contains('dark-mode');
    if (isDark) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
    
    // Dynamically update charts theme
    updateChartsTheme(isDark);
  });

  // On load, set theme from localStorage
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
});
