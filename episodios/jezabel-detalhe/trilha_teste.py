# Trilha de teste da Jezabel (orquestra VSCO 2 CE, CC0), gerada fora do pipeline em 2026-11-28.
# Espera os samples em LIB (git clone --sparse de github.com/sgossner/vsco-2-ce). Se o estilo for aprovado, vira peça do tools/trilha.py.
# Trilha de teste para a Jezabel com samples da VSCO 2 CE (CC0). Tempos já no vídeo final (narração / 1.25).
import glob, re, numpy as np, soundfile as sf
from scipy.signal import fftconvolve
LIB="/home/user/sgossner/vsco-2-ce"; SR=44100; DUR=41.92
NOMES={'C':0,'C#':1,'D':2,'D#':3,'E':4,'F':5,'F#':6,'G':7,'G#':8,'A':9,'A#':10,'B':11}
def midi(n):
    m=re.match(r'([A-G]#?)(-?\d)',n); return 12*(int(m.group(2))+1)+NOMES[m.group(1)]
def banco(pasta):
    out=[]
    for f in glob.glob(f"{LIB}/{pasta}/*.wav"):
        m=re.search(r'_([A-G]#?-?\d)_(v\d|mf|f|mp)',f.split('/')[-1])
        if m: out.append((midi(m.group(1)), m.group(2), f))
    return out
B={k:banco(p) for k,p in {'cello':'Strings/Cello Section/susvib','viola':'Strings/Viola Section/susvib','vln':'Strings/Violin Section/susVib',
   'cb':'Strings/Solo Contrabass/SusNV','harpa':'Strings/Harp','flauta':'Woodwinds/Flute/susvib'}.items()}
cache={}
def carrega(f):
    if f not in cache:
        x,sr=sf.read(f); x=x if x.ndim==2 else np.stack([x,x],1); cache[f]=x.astype(np.float32)
    return cache[f]
def nota(inst,n,forte=False):
    alvo=midi(n) if isinstance(n,str) else n
    cand=sorted(B[inst],key=lambda c:(abs(c[0]-alvo), (c[1] not in ('v3','v2','f')) if forte else (c[1] not in ('v1','mp','mf'))))
    m,_,f=cand[0]; x=carrega(f); r=2**((alvo-m)/12)
    idx=np.arange(0,len(x)-1,r); i0=idx.astype(int); fr=(idx-i0)[:,None]
    return x[i0]*(1-fr)+x[i0+1]*fr
mix=np.zeros((int(SR*(DUR+4)),2),np.float32)
def poe(x,t,ganho,dur=None,ataque=0.4,solta=1.2,pan=0.0):
    x=x.copy()
    # pula o ataque do arco quando é corda sustentada, para não soar "nota de piano"
    if dur is not None:
        n=int(SR*min(dur+solta,len(x)/SR)); x=x[:n]
        a=int(SR*ataque); x[:a]*=np.linspace(0,1,a)[:,None]
        s=int(SR*solta); x[-s:]*=np.linspace(1,0,s)[:,None]
    x*=ganho; x[:,0]*=1-max(pan,0); x[:,1]*=1+min(pan,0)
    i=int(SR*t); n=min(len(x),len(mix)-i); mix[i:i+n]+=x[:n]
def acorde(t,dur,notas,ganho,forte=False,ataque=0.6):
    for inst,ns,g,pan in notas:
        for n in ns: poe(nota(inst,n,forte),t,ganho*g,dur,ataque=ataque,pan=pan)
def cordas(t,dur,baixo,meio,alto,ganho,forte=False,ataque=0.6):
    acorde(t,dur,[('cb',baixo,0.9,0),('cello',meio,0.8,-0.3),('viola',alto[:2],0.6,0.3),('vln',alto[1:],0.55,0.1)],ganho,forte,ataque)
perc=lambda pad: sorted(glob.glob(f"{LIB}/{pad}"))
def hit(pad,t,ganho,k=-1):
    fs=perc(pad); x=carrega(fs[k]); poe(x,t,ganho)
# --- forma v2: cama contínua, harmonia lenta, quase sem batidas ---
def sustenta(inst,n,dur,forte=False):
    # nota contínua de qualquer duração: pega o miolo estável da gravação e emenda em laço com crossfade de potência constante
    x=nota(inst,n,forte); e=np.sqrt(np.convolve((x**2).mean(1),np.ones(SR//10)/(SR//10),'same'))
    vivo=np.where(e>e.max()*0.35)[0]; a,b=vivo[0]+int(SR*0.6),vivo[-1]-int(SR*0.4)
    vivo=np.where(e>e.max()*0.55)[0]; a,b=vivo[0]+int(SR*0.5),vivo[-1]-int(SR*0.3)
    miolo=x[a:b].copy(); xf=int(SR*2.0); L=int(SR*dur)
    if len(miolo)<xf*2+SR: miolo=x[vivo[0]:vivo[-1]].copy()
    # achata a dinâmica do arco: divide pelo envelope suavizado (0,4 s), para o laço não pulsar
    k=int(SR*0.4); env=np.sqrt(np.convolve((miolo**2).mean(1),np.ones(k)/k,'same'))+1e-6
    miolo=miolo/env[:,None]*np.median(env)
    # cada nota começa o laço num ponto diferente, para as emendas não coincidirem entre instrumentos
    off=(hash((inst,n))%1000)/1000*max(1,len(miolo)-xf*2); miolo=np.roll(miolo,-int(off),axis=0)
    out=np.zeros((L,2),np.float32); pos=0; ramp=np.linspace(0,np.pi/2,xf)
    while pos<L:
        seg=miolo.copy(); seg[:xf]*=np.sin(ramp)[:,None]; seg[-xf:]*=np.cos(ramp)[:,None]
        n2=min(len(seg),L-pos); out[pos:pos+n2]+=seg[:n2]; pos+=len(seg)-xf
    return out
def cama(t0,t1,notas,ganho,ataque=1.6,solta=2.4):
    for inst,n,g in notas:
        x=sustenta(inst,n,t1-t0+solta); poe(x,t0,ganho*g,t1-t0,ataque=ataque,solta=solta)
grave=[('cb','A1',1.0),('cello','A2',0.7),('cello','E3',0.45)]
cama(0.0,22.6,grave,0.22)
# A: brilho alto e suave dos violinos (a cena da janela)
cama(3.4,12.5,[('vln','A4',0.5),('vln','E5',0.35),('viola','C4',0.4)],0.10)
# B: tensão sobe devagar, com o sol sustenido por cima do lá
for t,g in [(12.5,0.11),(15.5,0.14),(18.3,0.18),(20.4,0.22)]:
    for inst,n,gg in [('viola','G#3',0.5),('viola','B3',0.4),('vln','E4',0.45),('vln','G#4',0.3)]: poe(sustenta(inst,n,5.6),t,g*gg,3.6,ataque=1.4,solta=2.0)
x=carrega(perc("Percussion/Timpani/Rolls/*Roll_v3*")[0])[:int(SR*4.4)].copy(); x*=np.linspace(0.0,1,len(x))[:,None]**2; poe(x,17.6,0.22)
# a única batida da primeira parte: "E eles jogaram"
hit("Percussion/BDrumNewhit_v5*",22.0,0.45); poe(carrega(f"{LIB}/Miscellania Raw/Misc 1/cymb_gong.wav"),22.0,0.18)
# C: depois do silêncio, só o grave, bem baixo
cama(23.04,30.5,[('cb','A1',1.0),('cello','A2',0.5),('cello','E3',0.3)],0.17,ataque=0.9)
# a mesma cama nos médios, para o celular (que não toca grave) não ouvir um buraco
cama(23.1,30.5,[('viola','A3',0.5),('viola','C4',0.4),('vln','E4',0.35),('vln','A4',0.25)],0.32,ataque=0.7)
# D: a profecia e o fim: fá, mi, lá, lentos
for t,d,ns in [(29.24,3.2,[('cb','F1',1),('cello','F2',0.6),('viola','C4',0.4),('vln','A4',0.35)]),
               (32.3,2.8,[('cb','E1',1),('cello','E2',0.6),('viola','B3',0.4),('vln','G#4',0.35)]),
               (35.0,6.5,[('cb','A1',1),('cello','A2',0.6),('cello','E3',0.4),('viola','C4',0.4),('vln','E4',0.3),('vln','A4',0.3)])]:
    for inst,n,g in ns: poe(sustenta(inst,n,d+3.6),t,(0.3 if t>34 else 0.2)*g,d+1.0,ataque=(0.8 if t>34 else 1.5),solta=2.6)
for t,n,d in [(29.6,'E5',0.8),(30.4,'D5',0.6),(31.0,'C5',0.6),(31.6,'B4',0.7),(32.3,'G#4',1.0),(33.3,'A4',1.8)]: poe(nota('flauta',n),t,0.13,d,ataque=0.2,solta=0.9,pan=-0.2)
cama(34.6,41.5,[('viola','A3',0.5),('viola','E4',0.4),('vln','C5',0.35),('vln','E5',0.3)],0.34,ataque=1.0,solta=3.0)
hit("Percussion/BDrumNewhit_v4*",36.98,0.35)
# silêncio da virada
a,b=int(SR*22.68),int(SR*23.04); r=int(SR*0.04); mix[a:a+r]*=np.linspace(1,0,r)[:,None]; mix[a+r:b]=0
mix=mix[:int(SR*DUR)]
# sala: reverb simples (ruído com decaimento de 2,2 s)
rng=np.random.default_rng(1); n=int(SR*4.0); ir=rng.standard_normal((n,2))*np.exp(-np.linspace(0,6,n))[:,None]; ir[:int(SR*0.03)]=0; ir/=np.abs(ir).sum(0)**0.5*6
wet=np.stack([fftconvolve(mix[:,c],ir[:,c])[:len(mix)] for c in range(2)],1)
out=0.45*mix+0.9*wet
# silêncio da virada vale também para a cauda do reverb
out[a+r:b]*=0.02
# fim: fade do cartão final
f=int(SR*3.5); out[-f:]*=np.linspace(1,0,f)[:,None]
out/=np.abs(out).max()/0.89
sf.write("/tmp/claude-0/-home-user/bb3c6458-9f0f-5159-9944-80ab937e1118/scratchpad/jez/trilha_jezabel_v4.wav",out,SR)
print("ok", out.shape[0]/SR)
