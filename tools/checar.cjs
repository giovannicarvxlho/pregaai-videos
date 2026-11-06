// Confere se esta máquina tem tudo para gerar os vídeos: npm run checar
// Cada ✘ vem com o comando que resolve. Rode de novo depois de instalar.
// roda() devolve a saída do comando (pode ser vazia) ou null se ele falhou.
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const R = path.join(__dirname, '..');
const WIN = process.platform === 'win32', MAC = process.platform === 'darwin';
let falhas = 0;
const ok = (m) => console.log('✔ ' + m);
const erro = (m, cmd) => { falhas++; console.log('✘ ' + m + (cmd ? '\n    → ' + cmd : '')); };
const aviso = (m, cmd) => console.log('! ' + m + (cmd ? '\n    → ' + cmd : ''));
const roda = (cmd, args) => {
  const r = spawnSync(cmd, args, { encoding: 'utf8' });
  return r.status === 0 ? (r.stdout || r.stderr || '').trim() : null;
};

(async () => {
  const node = Number(process.versions.node.split('.')[0]);
  if (node >= 22) ok(`Node ${process.version}`);
  else erro(`Node ${process.version} (precisa do 22 ou mais)`, 'instale o Node 22 LTS (nodejs.org)');

  if (fs.existsSync(path.join(R, 'node_modules', '@expo-google-fonts', 'gasoek-one'))) ok('fontes da marca');
  else erro('fontes da marca', 'npm i');

  let pw = false;
  try { require('playwright'); pw = true; ok('Playwright'); } catch { erro('Playwright', 'npm i'); }
  if (pw) {
    try { const b = await require('./navegador.cjs').abrir(); await b.close(); ok('Chromium do Playwright'); }
    catch { erro('Chromium do Playwright', 'npx playwright install chromium'); }
  }

  const ff = roda('ffmpeg', ['-version']);
  if (ff) ok(ff.split('\n')[0]);
  else erro('ffmpeg', WIN ? 'winget install Gyan.FFmpeg (depois abra outro terminal)' : MAC ? 'brew install ffmpeg' : 'sudo apt install ffmpeg');

  if (roda('bash', ['-c', 'echo ok']) !== null) ok('bash (build.sh e sheet.sh)');
  else erro('bash', WIN ? 'instale o Git for Windows e rode os .sh pelo Git Bash' : 'instale o bash');

  const py = ['python3', 'python', 'py'].find((p) => /^Python 3/.test(roda(p, ['--version']) || ''));
  if (!py) erro('Python 3', WIN ? 'winget install Python.Python.3.12' : MAC ? 'brew install python' : 'sudo apt install python3 python3-pip');
  else {
    ok(`Python 3 (${py})`);
    if (py !== 'python3') aviso(`aqui o Python se chama "${py}": troque "python3" por "${py}" nos comandos do README`);
    if (roda(py, ['-c', 'import sherpa_onnx, PIL']) !== null) ok('pacotes Python (sherpa-onnx, Pillow)');
    else erro('pacotes Python (sherpa-onnx, Pillow)', `${py} -m pip install -r tools/requirements.txt`);
    const mdir = path.join(R, 'tools', 'modelos', 'sherpa-onnx-whisper-small');
    const arq = ['small-encoder.int8.onnx', 'small-decoder.int8.onnx', 'small-tokens.txt'];
    if (arq.every((f) => fs.existsSync(path.join(mdir, f)))) ok('modelo do Whisper (tools/modelos)');
    else erro('modelo do Whisper (tools/modelos)', `${py} tools/baixar_modelo.py`);
  }

  if (fs.existsSync(path.join(R, '..', 'pregaai', 'assets', 'bible', 'nvi.json'))) ok('NVI (../pregaai/assets/bible/nvi.json)');
  else aviso('NVI não encontrada em ../pregaai/assets/bible/nvi.json', 'clone o repo pregaai na mesma pasta deste, para conferir o roteiro');

  console.log(falhas ? `\n${falhas} item(ns) faltando.` : '\nTudo pronto para gerar vídeo.');
  process.exit(falhas ? 1 : 0);
})();
