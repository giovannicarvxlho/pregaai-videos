#!/usr/bin/env python3
"""Confere cada trecho entre aspas do narracao.txt contra o nvi.json do app (repo pregaai).
Uso: python3 conferir.py  (só leitura). Procura o nvi.json em ../pregaai, ao lado deste repo, ou em /home/user/pregaai."""
import json, os, re, sys, unicodedata
AQUI = os.path.dirname(os.path.abspath(__file__))
CAMINHOS = [os.path.join(AQUI, '..', '..', '..', 'pregaai', 'assets', 'bible', 'nvi.json'), '/home/user/pregaai/assets/bible/nvi.json']
NVI = json.load(open(next(c for c in CAMINHOS if os.path.exists(c)), encoding='utf-8'))
PALAVRA = 'palavra'  # citação de uma palavra da própria frase, não de um versículo
REFS = ['mt.27:46', 'mt.27:46', 'sl.22:7', 'mt.27:40', 'sl.22:8', 'mt.27:43', 'sl.22:16', 'jo.20:25', 'lc.24:39',
        'jo.19:24', 'jo.19:24', 'jo.19:24', 'mc.15:34', 'mt.27:46', '2co.5:21', 'is.53:6', 'rm.8:32', PALAVRA, PALAVRA, PALAVRA,
        'sl.22:10', 'sl.22:21', 'sl.22:24', 'hb.2:12', 'hb.5:7', 'hb.5:7', 'sl.22:31', 'sl.22:31', 'mt.27:46', 'sl.22:31', 'mt.27:46']
ALSO = {'mt.27:46': 'sl.22:1', 'jo.19:24': 'sl.22:18', 'hb.2:12': 'sl.22:22'}

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
    if ref == PALAVRA:
        print(f'| {i} | "{q}" | palavra da própria frase | — |'); ok += 1; continue
    bate = norm(q) in norm(verso(ref))
    extra = f' (também em {ALSO[ref]}: {"sim" if norm(q) in norm(verso(ALSO[ref])) else "não"})' if ref in ALSO else ''
    ok += bate
    print(f'| {i} | "{q}" | {ref} | {"sim" if bate else "NÃO"}{extra} |')
print(f'\n{ok} de {len(qs)} conferem (maiúsculas e espaço antes da pontuação ignorados).')
sys.exit(0 if ok == len(qs) else 1)
