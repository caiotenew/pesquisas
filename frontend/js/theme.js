/* Tema visual dos gráficos Ponde/Provida. Chart.js 4.x. */
(function () {
  'use strict';
  const ChartLib = window.Chart;
  if (!ChartLib) return;

  const C = {
    teal: '#08a5a0', tealDark: '#087f86', tealLight: '#6fdcd4',
    navy: '#123b5d', amber: '#e8a838', red: '#d1483f',
    grid: '#e5ebef', text: '#53677b', surface: '#ffffff'
  };

  ChartLib.defaults.font.family = "Inter, ui-sans-serif, system-ui, sans-serif";
  ChartLib.defaults.font.size = 11;
  ChartLib.defaults.color = C.text;
  ChartLib.defaults.borderColor = C.grid;
  ChartLib.defaults.plugins.legend.labels.usePointStyle = true;
  ChartLib.defaults.plugins.legend.labels.pointStyle = 'circle';
  ChartLib.defaults.plugins.legend.labels.boxWidth = 8;
  ChartLib.defaults.plugins.legend.labels.padding = 16;
  ChartLib.defaults.plugins.tooltip.backgroundColor = C.navy;
  ChartLib.defaults.plugins.tooltip.titleFont = { family: 'Inter, sans-serif', weight: '700' };
  ChartLib.defaults.plugins.tooltip.bodyFont = { family: 'Inter, sans-serif', weight: '500' };
  ChartLib.defaults.plugins.tooltip.cornerRadius = 10;
  ChartLib.defaults.plugins.tooltip.padding = 12;
  ChartLib.defaults.elements.line.tension = 0.28;
  ChartLib.defaults.elements.point.hoverRadius = 6;
  if (ChartLib.defaults.plugins && ChartLib.defaults.plugins.colors) {
    ChartLib.defaults.plugins.colors.enabled = false;
  }

  const palette4 = [C.teal, C.tealLight, C.amber, C.red];
  ChartLib.register({
    id: 'providaTheme',
    beforeUpdate(chart) {
      const canvasId = chart && chart.canvas && chart.canvas.id;
      const datasets = chart && chart.data && Array.isArray(chart.data.datasets) ? chart.data.datasets : [];
      if (!datasets.length || !datasets[0]) return;

      if (canvasId === 'chart-daily') {
        const main = datasets[0];
        if (main.type === 'bar' || chart.config.type === 'bar') {
          Object.assign(main, { borderColor: C.teal, backgroundColor: C.teal, hoverBackgroundColor: C.navy, borderRadius: 7 });
        } else {
          Object.assign(main, { borderColor: C.teal, backgroundColor: 'rgba(8,165,160,.12)', pointBackgroundColor: C.teal });
        }
        if (datasets[1]) Object.assign(datasets[1], { borderColor: C.navy, backgroundColor: 'transparent' });
      } else if (canvasId === 'chart-satisfaction') {
        Object.assign(datasets[0], { backgroundColor: palette4, borderColor: C.surface });
      } else if (canvasId === 'chart-recommendation') {
        Object.assign(datasets[0], { backgroundColor: palette4, borderRadius: 7 });
      } else if (canvasId === 'chart-questions') {
        Object.assign(datasets[0], { backgroundColor: C.teal, borderRadius: 7 });
      } else if (canvasId === 'chart-youngs') {
        Object.assign(datasets[0], { backgroundColor: C.teal, hoverBackgroundColor: C.tealDark, borderRadius: 7 });
        if (datasets[1]) Object.assign(datasets[1], { backgroundColor: 'rgba(18,59,93,.18)', hoverBackgroundColor: 'rgba(18,59,93,.28)', borderRadius: 7 });
      }

      const scales = chart.options && chart.options.scales;
      if (scales) {
        Object.values(scales).forEach((scale) => {
          scale.grid = { ...(scale.grid || {}), color: C.grid, drawBorder: false };
          scale.border = { ...(scale.border || {}), display: false };
          scale.ticks = { ...(scale.ticks || {}), color: C.text, font: { family: 'Inter, sans-serif', size: 10 } };
        });
      }
    }
  });
})();
