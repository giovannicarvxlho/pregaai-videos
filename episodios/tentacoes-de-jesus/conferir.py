#!/usr/bin/env python3
"""Confere cada trecho entre aspas do narracao.txt contra o nvi.json do app (repo pregaai).
Uso: python3 conferir.py  (só leitura). Procura o nvi.json em ../pregaai, ao lado deste repo, ou em /home/user/pregaai."""
import json, os, re, sys, unicodedata
AQUI = os.path.dirname(os.path.abspath(__file__))
CAMINHOS = [os.path.join(AQUI, '..', '..', '..', 'pregaai', 'assets', 'bible', 'nvi.json'), '/home/user/pregaai/assets/bible/nvi.json']
NVI = json.load(open(next(c for c in CAMINHOS if os.path.exists(c)), encoding='utf-8'))
REFS = ['mt.3:17', 'mt.4:3', 'mt.4:2', 'mt.4:3', 'mt.4:4', 'mt.4:6', 'mt.4:7', 'mt.4:9', 'mt.4:10', 'mt.4:11',
        'dt.8:2', 'hb.2:17', 'hb.4:15', 'hb.2:18']
ALSO = {'mt.4:4': 'dt.8:3', 'mt.4:6': 'sl.91:11', 'mt.4:7': 'dt.6:16', 'mt.4:10': 'dt.6:13'}

def norm(s):
    s = unicodedata.normalize('NFC', s).replace('’', "'").replace('‘', "'")
    s = re.sub(r'\s+([?!.,;:])', r'\1', s)
    return re.sub(r'\s+', ' ', s).strip().lower()

def verso(ref):
    cap, v = ref.split(':')
    return next(x['t'] for x in NVI[cap] if x['v'] == int(v))

qs = re.findall(r'"([^"]+)"', open(os.path.join(AQUI, 'narracao.txt'), encoding='utf-8').read())
if len(qs) != len(REFS):
    print(f'ERRO: {len(qs)} citações no narracao.txt e {len(REFS)} referências declaradas'); sys.exit(1)
ok = 0
print('| # | Citação | Versículo | Idêntica à NVI |\n|---|---|---|---|')
for i, (q, ref) in enumerate(zip(qs, REFS), 1):
    bate = norm(q) in norm(verso(ref))
    extra = f' (fonte citada: {ALSO[ref]})' if ref in ALSO else ''
    ok += bate
    print(f'| {i} | "{q[:70]}" | {ref} | {"sim" if bate else "NÃO"}{extra} |')
print(f'\n{ok} de {len(qs)} conferem (maiúsculas e espaço antes da pontuação ignorados).')
sys.exit(0 if ok == len(qs) else 1)
