# Сайт музыкального коллектива Latido Trio (Astro + Decap CMS + GitHub Pages)

## Что внутри

```
src/
  ├── layouts/Base.astro       — общий шаблон
  ├── pages/
  |   ├── index.astro            — главная
  |   ├── bio.astro              — био
  |   ├── news.astro             — новости
  |   ├── media.astro            — видео/фото/аудио
  |   ├── contacts.astro         — контакты + ссылка на техрайдер
  content.config.ts        — схемы данных
content/
  shows/                   — концерты
  pages/                   — тексты страниц
  news/                    — новости
public/
  admin/                   — панель управления Decap CMS
  uploads/                 — картинки, загруженные через CMS
  audio/                   — mp3 для прослушивания
  docs/                    — техрайдер.pdf и другие документы
  styles/
    ├── global.css         # только @import'ы + токены/база
    ├── base.css           # переменные темы, reset, кнопки, карточки, бейджи, футер
    ├── header.css         # шапка v2 + панель меню (НОВОЕ, см. ниже)
    ├── player.css         # глобальный плеер
    ├── hero.css           # hero-секция
    ├── home.css           # афиша-тизер, треки, новости на главной
    ├── band.css           # страница /band (состав)
    ├── shows.css          # show-list + модалка концерта
```

## Локальный запуск

```bash
npm install
npm run dev
```

Открыть http://localhost:4321 — сайт, http://localhost:4321/admin — панель управления.


## Доступ клиента в панель управления (/admin)

Decap CMS с backend `github` требует GitHub OAuth.

- **decap-server** — локально / на своём VPS (npm i decap-server).
- **Cloudflare Pages Function** с OAuth-прокси (готовые community-решения:
  ищите «decap cms github oauth cloudflare workers»).
- Либо вообще без OAuth: клиент правит markdown-файлы прямо в GitHub
  (интерфейс GitHub для правки файлов удобный, а сайт пересобирается сам).

После настройки клиент заходит на your-band.pages.dev/admin, логинится
через GitHub и редактирует: афишу (дата, город, площадка, билеты, картинка,
статус sold out), тексты страниц, новости, документы.

## Клиентская часть — что редактируется где

| Контент | Где лежит | Где правится |
|---|---|---|
| Афиша | content/shows/*.md | /admin → «Афиша» |
| Тексты страниц | content/pages/*.md | /admin → «Страницы» |
| Новости | content/news/*.md | /admin → «Новости» |
| Фото/афиши | public/uploads/ | загрузка в /admin |
| Аудио | public/audio/ | загрузка файла в репозиторий |
| Техрайдер PDF | public/docs/ | загрузка файла в репозиторий |

## Что добавить дальше (по необходимости)

- React-остров: аудиоплеер с плейлистом, фотогалерея с лайтбоксом
  (`npx astro add react` и вставляете компонент на страницу).
- Кнопки соцсетей/стримингов (Spotify, YouTube, Bandcamp) в шапку.
- Раздел «Прошедшие концерты» (фильтр по дате < now) — логика уже в index.astro.
- Sitemap + robots.txt для SEO.
