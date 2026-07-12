export function requireAuth(req, res, next) {
  if (!req.session.user) return res.redirect('/auth/login');
  next();
}

export function requireGuest(req, res, next) {
  if (req.session.user) return res.redirect('/');
  next();
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.session.user) return res.redirect('/auth/login');
    if (!roles.includes(req.session.user.role)) return res.status(403).render('403', { title: 'Forbidden' });
    next();
  };
}
