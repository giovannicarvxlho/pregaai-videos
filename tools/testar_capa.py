# Os dois testes da capa: como ela aparece no feed do celular (168×94 no longo, 94×167 no Short)
# e em preto e branco. Junta tudo numa folha só para comparar versões.
# Uso: python3 tools/testar_capa.py out/<ep>-miniatura-a.png out/<ep>-miniatura-b.png ... [-o folha.png]
import sys
from PIL import Image, ImageDraw, ImageOps

args = sys.argv[1:]
out = args[args.index('-o') + 1] if '-o' in args else 'out/teste-capas.png'
files = [a for i, a in enumerate(args) if a != '-o' and (i == 0 or args[i - 1] != '-o')]
ims = [Image.open(f).convert('RGB') for f in files]
rows = []
for f, im in zip(files, ims):
    wide = im.width > im.height
    big = im.resize((480, 270) if wide else (270, 480))
    small = im.resize((168, 94) if wide else (94, 167), Image.LANCZOS)
    rows.append((f, big, small, ImageOps.grayscale(small).convert('RGB')))
h = sum(max(b.height, 200) + 40 for _, b, _, _ in rows) + 10
sheet = Image.new('RGB', (480 + 2 * 200 + 50, h), 'white')
d, y = ImageDraw.Draw(sheet), 10
for f, big, small, gray in rows:
    sheet.paste(big, (10, y)); sheet.paste(small, (510, y)); sheet.paste(gray, (510 + small.width + 20, y))
    d.text((10, y + big.height + 6), f, fill='black'); y += max(big.height, 200) + 40
sheet.save(out)
print(out)
