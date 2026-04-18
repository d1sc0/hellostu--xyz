// apexchart-loader.js
// Generic loader for ApexCharts charts in Astro/MDX posts.
// Looks for all <script type="application/json" id="*-config"> blocks and renders charts accordingly.
import ApexCharts from 'apexcharts';
import moment from 'moment';

/**
 * Render all charts defined by data-config attributes in the DOM.
 */
function renderAllApexCharts() {
  // Find all chart containers with a data-config attribute
  const chartEls = document.querySelectorAll('[data-config]');
  chartEls.forEach(el => {
    try {
      const parsed = JSON.parse(el.dataset.config);
      const { id, type, options, series } = parsed;
      // Merge type and series into options
      const chartOptions = {
        ...options,
        chart: { ...options.chart, type, id },
        series,
      };

      // Add yaxis.labels.formatter if formatterKey is present
      if (
        chartOptions.yaxis &&
        chartOptions.yaxis.formatterKey === 'finishingTime'
      ) {
        chartOptions.yaxis.labels = {
          formatter: function (val) {
            return moment(val).format('mm:ss');
          },
        };
        // Remove the custom key so ApexCharts doesn't complain
        delete chartOptions.yaxis.formatterKey;
      }
      // Prevent duplicate rendering
      if (!el._apexChart) {
        el._apexChart = new ApexCharts(el, chartOptions);
        el._apexChart.render();
      }
    } catch (e) {
      // Log the actual data attribute for debugging
      console.error(
        'ApexChart config error:',
        e,
        '\nData attribute:',
        el.dataset.config,
      );
    }
  });
}

// Run on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderAllApexCharts);
} else {
  renderAllApexCharts();
}
