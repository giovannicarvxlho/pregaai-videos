#!/usr/bin/env python3
"""Confere cada trecho entre aspas do narracao.txt (e das Notas do roteiro.md) contra o nvi.json do app (repo pregaai).
Uso: python3 conferir.py  (só leitura). Procura o nvi.json em ../pregaai, ao lado deste repo, ou em /home/user/pregaai."""
import json, os, re, sys, unicodedata
AQUI = os.path.dirname(os.path.abspath(__file__))
CAMINHOS = [os.path.join(AQUI, '..', '..', '..', 'pregaai', 'assets', 'bible', 'nvi.json'), '/home/user/pregaai/assets/bible/nvi.json']
NVI = json.load(open(next(c for c in CAMINHOS if os.path.exists(c)), encoding='utf-8'))
REFS = ['jo.19:40', 'jo.19:39', 'jo.20:2', 'jo.20:5', 'jo.20:7', 'jo.20:7', 'jo.11:44', 'jo.11:44', 'jo.20:8', 'jo.20:9', 'jo.20:18', 'jo.20:31']
NOTAS = []

def norm(s):
    s = unicodedata.normalize('NFC', s).replace('’', "'").replace('‘', "'")
    s = re.sub(r'\s+([?!.,;:])', r'\1', s)
    return re.sub(r'\s+', ' ', s).strip().lower()

def verso(ref):
    cap, v = ref.split(':')
    return next(x['t'] for x in NVI[cap] if x['v'] == int(v))

rot = open(os.path.join(AQUI, 'roteiro.md'), encoding='utf-8').read()
notas = rot[rot.index('## Notas'):rot.index('## Revisões')]
qn = re.findall(r'"([^"]+)"', notas)
if len(qn) != len(NOTAS):
    print(f'ERRO: {len(qn)} citações nas Notas do roteiro.md e {len(NOTAS)} referências declaradas'); sys.exit(1)
qs = re.findall(r'"([^"]+)"', open(os.path.join(AQUI, 'narracao.txt'), encoding='utf-8').read())
if len(qs) != len(REFS):
    print(f'ERRO: {len(qs)} citações no narracao.txt e {len(REFS)} referências declaradas'); sys.exit(1)
qs, refs = qs + qn, REFS + NOTAS
ok = 0
print('| # | Citação | Versículo | Idêntica à NVI |\n|---|---|---|---|')
for i, (q, ref) in enumerate(zip(qs, refs), 1):
    bate = norm(q) in norm(verso(ref))
    ok += bate
    print(f'| {i} | "{q[:70]}" | {ref} | {"sim" if bate else "NÃO"} |')
print(f'\n{ok} de {len(qs)} conferem (maiúsculas e espaço antes da pontuação ignorados).')
sys.exit(0 if ok == len(qs) else 1)
