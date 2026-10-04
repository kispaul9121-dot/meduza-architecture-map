# Meduza architecture projection

---node
id: meduza
type: architecture
title: MEDUZA
subtitle: проект целиком
status: root
order: 0
expanded: true
---
Корневой узел карты проекта.

---node
id: catalog
parent: meduza
type: architecture
title: Каталог
subtitle: верхнеуровневый Admin workspace
status: branch
order: 10
expanded: true
---
Основная рабочая область каталога Meduza.

---node
id: smart-catalog
parent: catalog
type: architecture
title: Каталог: дерево и таблица
subtitle: рабочая область списка товаров
status: branch
order: 11
expanded: false
---
Дерево разделов и адаптивная таблица Products.

---node
id: catalog-tree
parent: smart-catalog
type: architecture
title: Дерево разделов / умные папки
subtitle: semantic/query-driven navigation
status: branch
order: 12
---
Навигация по semantic/query-driven папкам.

---node
id: catalog-table
parent: smart-catalog
type: architecture
title: Адаптивная таблица Products
subtitle: поиск / фильтры / сортировка / колонки
status: branch
order: 13
---
Server-side список Products.

---node
id: product-card
parent: catalog
type: architecture
title: Карточка Product
subtitle: основная рабочая поверхность товара
status: branch
order: 20
expanded: true
---
Product Card открывается из строки Catalog.

---node
id: product-main
parent: product-card
type: architecture
title: Основная информация
subtitle: Commerce + folder context
status: branch
order: 21
---
Базовая информация Product.

---node
id: product-variants
parent: product-card
type: architecture
title: Варианты
subtitle: native Medusa Options / Variants / SKU
status: protected
order: 22
---
UI над native Medusa Options/Variants.

---node
id: product-characteristics
parent: product-card
type: architecture
title: Характеристики
subtitle: единственный редактор technical Product Facts
status: current
order: 23
---
Единственное место создания и редактирования canonical technical Catalog Facts.

---node
id: product-configuration
parent: product-card
type: architecture
title: Комплектация
subtitle: linked Config Nodes и подбор
status: branch
order: 24
---
Linked Config Nodes, MatchSpec, Refresh и candidate allowlist.

---node
id: product-rules
parent: product-card
type: architecture
title: Ограничения и правила
subtitle: Обзор / Проверки / JSON / История
status: branch
order: 25
---
Rules используют существующие Facts и Node IDs.

---node
id: product-related
parent: product-card
type: architecture
title: Связанные товары
subtitle: relations без candidate approval
status: branch
order: 26
---
Связи Products отдельно от configuration allowlist.

---node
id: pages
parent: meduza
type: architecture
title: Pages / Страницы
subtitle: отдельный верхнеуровневый Admin workspace
status: branch
order: 30
---
Редактор публичных Pages. Не является вкладкой Product Card.

---node
id: seo
parent: meduza
type: architecture
title: SEO
subtitle: отдельный верхнеуровневый Admin workspace
status: branch
order: 40
---
Canonical SEO editing для связанной Page/URL.

---node
id: system
parent: meduza
type: architecture
title: Система / Runtime
subtitle: техническое ядро проекта
status: protected
order: 50
---
Технические контракты и runtime.

---node
id: library
parent: system
type: architecture
title: Dictionaries & Library
subtitle: canonical definitions и stable IDs
status: protected
order: 51
---
Canonical definitions технических параметров.

---node
id: facts
parent: system
type: architecture
title: Product Catalog Facts
subtitle: canonical technical data
status: protected
order: 52
---
Product-level canonical technical facts.

---node
id: nodes-matchspec
parent: system
type: architecture
title: Config Nodes / MatchSpec
subtitle: stable refs и persisted matching
status: protected
order: 53
---
Persistent linked Config Nodes и saved MatchSpec.

---node
id: runtime
parent: system
type: architecture
title: Configuration Package / Runtime
subtitle: publish / validation / runtime
status: protected
order: 54
---
Published revisions и runtime contracts.

---node
id: integrations
parent: meduza
type: architecture
title: Интеграции
subtitle: границы с внешними системами
status: branch
order: 60
---
Интеграционные границы проекта.

---node
id: medusa-native
parent: integrations
type: architecture
title: Native Medusa
subtitle: Product / Variant / Pricing / Inventory
status: protected
order: 61
---
Source of truth для штатных Commerce-данных.
