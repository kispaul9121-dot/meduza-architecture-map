# Meduza task projection

---node
id: R5-02
parent: catalog-table
type: task
title: R5-02 — пагинация каталога
subtitle: pagination / filter / search / sort / count
status: done
order: 102
---
Пагинация каталога завершена.

---node
id: TASK-14
parent: smart-catalog
type: task
title: TASK-14 — hierarchy / technical scope
subtitle: иерархия и полный scope колонок
status: done
order: 114
---
Защищает полный technical scope таблицы.

---node
id: TASK-15
parent: smart-catalog
type: task
title: TASK-15 — производительность
subtitle: параллельная verification-проверка
status: deferred
order: 115
---
Проверка производительности цепочки Catalog.

---node
id: TASK-16
parent: smart-catalog
type: task
title: TASK-16 — умные папки
subtitle: semantic membership и наследование критериев
status: verify
order: 116
depends_on: [R5-02, TASK-14]
protects: [R5-03]
---
Текущий статус — VERIFY. Нужна приёмка перед Guided Move.

---node
id: TASK-17
parent: smart-catalog
type: task
title: TASK-17 — Guided Move
subtitle: criteria diff → confirm → canonical edits
status: blocked
order: 117
depends_on: [TASK-16]
---
Заблокировано до приёмки TASK-16.

---node
id: R5-03
parent: product-configuration
type: task
title: R5-03 — MatchSpec / Refresh
subtitle: saved MatchSpec contract и Refresh semantics
status: protected
order: 103
protects: [MatchSpec, Refresh]
---
Контракт сохранённого MatchSpec и семантики Refresh нельзя менять побочно.
