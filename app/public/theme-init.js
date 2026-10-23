// Applies the remembered theme before first paint so the page never flashes the wrong one.
// Kept as an external file (not inline) so the Content-Security-Policy can forbid inline scripts.
try {
  var t = localStorage.getItem('clientdesk.theme');
  if (t === 'light' || t === 'dark') document.documentElement.setAttribute('data-theme', t);
} catch (e) {}
