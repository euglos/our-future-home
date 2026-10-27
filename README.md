# KVARTIRA

Our Future Home — каталог вещей для будущей квартиры. Два цвета (`#0e0e0d` / `#e6e1d8`), минимализм в духе rickowens.eu.
Открывается двойным кликом по `index.html`, без сервера и сборки.

## Файлы

- `items.js` — каталог; формат полей описан в комментарии в начале файла
- `img/` — картинки вещей, имя файла = id (`img/004.png`)
- `index.html`, `style.css`, `app.js` — сам сайт, при добавлении вещей не трогать
- `tools/flatbg.py` — выравнивание фона картинок (Python + Pillow)

## Как добавляется вещь

1. Evgeny присылает ссылку на рилс и скриншот или пару слов: что за вещь.
2. Следующий свободный id, примерная цена. Комнат нет: всё в одном каталоге.
3. Где купить: 1–3 варианта, по возможности в Вене или с доставкой в AT (IKEA, Hornbach, Willhaben, онлайн).
4. Если вещь можно сделать самим, `diy`: короткие шаги с материалами.
5. Картинка: кадр из рилса → `img/src/<id>.png`, его чистят в Gemini (браузер, бесплатно), результат → `img/<id>.jpg`. Без `img` показывается заглушка с номером.

## Промпт для Gemini

Вещь не генерировать с нуля, а редактировать кадр: так она остаётся той самой. Промпт один на все вещи, меняется только `<ВЕЩЬ>`:

```
Edit this photo into a clean product photo of <ВЕЩЬ>.
Keep the object exactly as it is: same shape, texture, proportions and details. Do not redesign or improve it.
Remove hands, people, phone interface, text, logos and clutter.
Place it on a plain, seamless near-black background (#0e0e0d), soft directional light from the upper left, subtle natural shadow.
Front view, centered, the whole object visible with some empty space around it. Square 1:1.
Photorealistic, like a real studio photo, natural colors, no glow, no added objects.
```

Если Gemini всё же меняет вещь, дописать: `This is an edit, not a new image. Change only the background and remove the hand.`

**Плоские вещи и наборы** (постеры, картины): редактирование сохраняет кадрирование исходника и режет края, а вырезки по одной выглядят неровно. Тогда новый чат и промпт «Using this photo as reference, create…»: те же рисунки, одинаковый размер, ровная сетка, чёрная стена, группа на ~70 % ширины с полями, ничего не обрезано. Так сделана 002.

Результат Gemini сохранить как `img/src/<id>-gemini.jpg`. Фон у него обычно с виньеткой и не совпадает с сайтом, поэтому выровнять:
`python -I tools/flatbg.py img/src/<id>-gemini.jpg img/<id>.jpg`. Скрипт приводит фон к `#0e0e0d`, вещь и тени не трогает. Потом прописать `img` у вещи в `items.js`.

## Публикация

GitHub Pages из ветки `main`: https://euglos.github.io/our-future-home/ (страница с `noindex`).
Видео из рилсов и `img/src/` в репозиторий не попадают (`.gitignore`).

Обновлено: 2026-10-27
