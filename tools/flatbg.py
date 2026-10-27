# Выравнивает фон картинки от Gemini под цвет сайта #0e0e0d, вещь и тени не трогает.
# python -I tools/flatbg.py img/src/<id>-gemini.jpg img/<id>.jpg
import sys
import numpy as np
from PIL import Image, ImageFilter

src, dst = sys.argv[1], sys.argv[2]
target = np.array([14, 14, 13], float)

img = Image.open(src).convert("RGB")
a = np.asarray(img).astype(float)
lum = a.mean(2)

# холсты = всё заметно светлее фона; расширяем маску, чтобы не задеть края
obj = Image.fromarray(((lum > 70) * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(15))
bg = 1 - np.asarray(obj) / 255.0

def smooth(x, n=16):
    im = Image.fromarray(x.astype(np.float32), "F")
    return np.asarray(im.resize((n, n), Image.BOX).resize(im.size, Image.BICUBIC))

# плавное поле фона: нормированное усреднение только по фоновым пикселям
w = smooth(bg) + 1e-6
field = np.stack([smooth(a[..., c] * bg) / w for c in range(3)], 2)

flat = np.clip(a - field + target, 0, 255)

# мягкий переход у краёв холстов
m = (np.asarray(obj.filter(ImageFilter.GaussianBlur(6))) / 255.0)[..., None]
out = flat * (1 - m) + a * m
Image.fromarray(out.round().astype(np.uint8)).save(dst, quality=92)
