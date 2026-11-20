#!/usr/bin/env node
// Construye index.html uniendo, en orden, los ficheros de src/.
// Uso:  node build.js           -> genera index.html
//       node build.js --check   -> comprueba que index.html está al día (sale con código 1 si no)
'use strict';
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src');
const parts = fs.readdirSync(dir).filter(f => /^\d\d_/.test(f)).sort();
const html = parts.map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('');
const out = path.join(__dirname, 'index.html');

// Comprobación de sintaxis del script embebido
const js = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));
try { new Function(js); } catch (e) { console.error('Error de sintaxis en el juego:', e.message); process.exit(1); }

if (process.argv.includes('--check')) {
  const cur = fs.existsSync(out) ? fs.readFileSync(out, 'utf8') : '';
  if (cur !== html) { console.error('index.html no está al día: ejecuta "node build.js"'); process.exit(1); }
  console.log('index.html está al día');
} else {
  fs.writeFileSync(out, html);
  console.log(`index.html generado (${parts.length} partes, ${(html.length / 1024).toFixed(1)} KB)`);
}
