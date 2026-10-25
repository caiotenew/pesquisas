/*
 * Configuração do frontend.
 * - Local: usa a API em http://localhost:3000.
 * - GitHub Pages: usa a API publicada no Render.
 */
(function () {
  var PRODUCTION_API_URL = 'https://ponde-pesquisas-api.onrender.com';

  var isLocal = ['localhost', '127.0.0.1'].indexOf(window.location.hostname) !== -1;

  window.APP_CONFIG = {
    API_BASE_URL: isLocal ? 'http://localhost:3000' : PRODUCTION_API_URL,
    ADMIN_EMAIL: 'damascenocaio311@gmail.com',
    METABASE_DASHBOARD_URL: ''
  };
})();