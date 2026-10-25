/*
 * Tema visual dos gráficos do Ponde Pesquisas.
 * Aplica tipografia e cores Provida; não altera dados, consultas ou rotas.
 */
(function () {
  'use strict';
  if (!window.Chart) return;

  const C = {
    teal: '#08a5a0',
    tealDark: '#087f86',
    tealLight: '#6fdcd4',
    navy: '#123b5d',
    amber: '#e8a838',
    red: '#d1483f',
    grid: '#e8edf3',
    text: '#65758b',
    white: '#ffffff'
  };

  const css = getComputedStyle(document.documentElement);
  const bodyFont = css.getPropertyValue('--font-provida').trim() || 'Inter, system-ui, sans-serif';
  const displayFont = css.getPropertyValue('--font-display').trim() || 'Figtree, Inter, system-ui, sans-serif';

  Chart.defaults.font.family = bodyFont;
  Chart.defaults.font.size = 11;
  Chart.defaults.color = C.text;
  Chart.defaults.borderColor = C.grid;
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
  Chart.defaults.plugins.legend.labels.pointStyle = 'circle';
  Chart.defaults.plugins.legend.labels.padding = 18;
  Chart.defaults.plugins.tooltip.backgroundColor = '#102d46';
  Chart.defaults.plugins.tooltip.titleFont = { family: displayFont, size: 12, weight: '700' };
  Chart.defaults.plugins.tooltip.bodyFont = { family: bodyFont, size: 11, weight: '500' };
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.cornerRadius = 9;
  Chart.defaults.plugins.tooltip.displayColors = true;
  Chart.defaults.plugins.tooltip.boxPadding = 4;
  Chart.defaults.elements.line.borderWidth = 3;
  Chart.defaults.elements.point.hoverRadius = 6;
  Chart.defaults.elements.bar.borderRadius = 6;
  Chart.defaults.elements.bar.borderSkipped = false;

  if (Chart.defaults.plugins && Chart.defaults.plugins.colors) {
    Chart.defaults.plugins.colors.enabled = false;
  }

  const scale4 = [C.teal, C.tealLight, C.amber, C.red];

  Chart.register({
    id: 'pondeTheme',
    beforeUpdate(chart) {
      const id = chart.canvas && chart.canvas.id;
      const datasets = chart.data.datasets || [];

      if (id === 'chart-daily') {
        if (datasets[0]) {
          if (datasets[0].type === 'bar' || chart.config.type === 'bar') {
            Object.assign(datasets[0], {
              borderColor: C.teal,
              backgroundColor: C.teal,
              hoverBackgroundColor: C.navy,
              borderRadius: 6
            });
          } else {
            Object.assign(datasets[0], {
              borderColor: C.tealDark,
              backgroundColor: 'rgba(8,165,160,.11)',
              pointBackgroundColor: C.teal,
              pointBorderColor: C.white,
              pointBorderWidth: 2,
              tension: .32,
              fill: true
            });
          }
        }
        if (datasets[1]) {
          Object.assign(datasets[1], {
            borderColor: C.navy,
            backgroundColor: 'transparent',
            borderDash: [6, 5],
            pointRadius: 0,
            borderWidth: 2
          });
        }
      } else if (id === 'chart-satisfaction') {
        if (datasets[0]) Object.assign(datasets[0], {
          backgroundColor: scale4,
          borderColor: C.white,
          borderWidth: 3,
          hoverOffset: 5
        });
      } else if (id === 'chart-recommendation') {
        if (datasets[0]) Object.assign(datasets[0], {
          backgroundColor: scale4,
          hoverBackgroundColor: [C.tealDark, C.teal, '#d39a2f', '#b93d36'],
          borderRadius: 7
        });
      } else if (id === 'chart-questions') {
        if (datasets[0]) Object.assign(datasets[0], {
          backgroundColor: C.teal,
          hoverBackgroundColor: C.tealDark,
          borderRadius: 7
        });
      } else if (id === 'chart-youngs') {
        if (datasets[0]) Object.assign(datasets[0], {
          backgroundColor: C.teal,
          hoverBackgroundColor: C.tealDark,
          borderRadius: 6
        });
        if (datasets[1]) Object.assign(datasets[1], {
          backgroundColor: 'rgba(18,59,93,.16)',
          hoverBackgroundColor: 'rgba(18,59,93,.28)',
          borderRadius: 6
        });
      }

      const scales = chart.options && chart.options.scales;
      if (scales) {
        Object.values(scales).forEach((scale) => {
          scale.grid = { ...(scale.grid || {}), color: C.grid, drawBorder: false };
          scale.border = { ...(scale.border || {}), display: false };
          scale.ticks = {
            ...(scale.ticks || {}),
            color: C.text,
            font: { family: bodyFont, size: 10 }
          };
        });
      }
    }
  });
})();
