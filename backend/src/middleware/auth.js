
const prisma = require('../lib/prisma');
const { verifyToken } = require('../lib/auth');

const SEEN_THROTTLE_MS = 30 * 1000;

const ALLOWED_DURING_PASSWORD_CHANGE = [
  '/change-password',
  '/me',
  '/logout',
  '/heartbeat'
];

async function auth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ')
      ? header.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        error: 'Não autenticado.'
      });
    }

    const payload = verifyToken(token);

    const user = await prisma.user.findUnique({
      where: { id: Number(payload.sub) }
    });

    if (!user || user.status !== 'ATIVO' || !user.ativo) {
      return res.status(401).json({
        error: 'Sessão inválida ou conta sem acesso.'
      });
    }

    // Invalida tokens anteriores à última troca de senha.
    if (
      user.passwordChangedAt &&
      payload.iat &&
      payload.iat <
        Math.floor(user.passwordChangedAt.getTime() / 1000)
    ) {
      return res.status(401).json({
        error: 'Sua senha foi alterada. Entre novamente.'
      });
    }

    // Obriga a troca da senha temporária antes de usar o sistema.
    const allowedWhileChangingPassword =
      req.baseUrl === '/api/auth' &&
      ALLOWED_DURING_PASSWORD_CHANGE.includes(req.path);

    if (
      user.mustChangePassword &&
      !allowedWhileChangingPassword
    ) {
      return res.status(403).json({
        error: 'Você precisa trocar sua senha inicial antes de continuar.',
        code: 'PASSWORD_CHANGE_REQUIRED'
      });
    }

    // Atualiza a presença no máximo uma vez a cada 30 segundos.
    const now = Date.now();

    if (
      !user.lastSeenAt ||
      now - new Date(user.lastSeenAt).getTime() > SEEN_THROTTLE_MS
    ) {
      prisma.user.update({
        where: { id: user.id },
        data: { lastSeenAt: new Date(now) }
      }).catch(() => {});
    }

    req.user = user;
    return next();

  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido ou expirado.'
    });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Acesso negado.'
      });
    }

    next();
  };
}

module.exports = { auth, requireRole };
