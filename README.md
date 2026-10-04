# Meduza Architecture Map

Интерактивная карта проекта Meduza.

## Архитектура

HTML больше не хранит архитектуру или список задач.

```
content/
  architecture.md   # постоянный скелет проекта
  tasks.md          # задачи и статусы
scripts/
  build-map.mjs     # Markdown -> nodes.json + validation
site/
  index.html        # тонкая оболочка
  styles.css        # внешний вид
  app.js            # универсальный renderer
  data/nodes.json   # генерируется при deploy
```

Можно добавлять новые отдельные Markdown-файлы в `content/`: генератор читает **все** `.md` рекурсивно.

Каждый узел описывается блоком:

```md
---node
id: TASK-18
parent: product-configuration
type: task
title: TASK-18 — название
subtitle: короткое пояснение
status: verify
order: 180
depends_on: [TASK-16]
protects: [R5-03]
---
Подробности задачи.
```

После push GitHub Actions валидирует ID/parent-связи, собирает JSON и публикует карту. `index.html` для новых задач и веток менять не нужно.

Режимы сайта: **Архитектура / Задачи / Всё**.

Целевой поток: **Notion → Markdown projection → build → map**. Notion остаётся source of truth.
