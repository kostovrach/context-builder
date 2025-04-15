# 🛠 Context Builder

Это - CLI-инструмент для сбора структуры, сниппетов и зависимостей проекта, с экспортом в PDF.
Изначальная идея по назначению - это возможнсть ввести нейросеть в контекст проекта, для решения каких то локальных проблем в коде избегая бесконечных промтов с кусками кода.


## Как работает:

Генерируются два файла в папке `output` - `project-context.md` и `project-context.pdf`, в которых содержатся:

- 🌳 Древовидная структура проекта с визуализацией вложенности (`node_modules`, `.git`, `dist` и `build` исключаются)
- 📄 Сниппеты кода поддерживаемых инструментом файлов (`.js`, `.ts`, `.jsx`, `.tsx`, `.json`, `.html`, `.css`, `.scss`)
- 🔗 Список зависимостей в каждом файле (import, link, src и т.д.)


## Как развернуть:

### 🚀 Установить основные зависимости:

```bash
npm install
```

### 📦 Установить зависимости puppeteer и marked:

```bash
npm install puppeteer marked
```

### ▶️ Использование:

Запустить из корня `Context Builder` с указанием относительного или абсолютного пути к проекту:

```bash
node index.js /путь/к/проекту
```

### ✅ Результат: 

В папке `output/` появятся два файла:

- `project-context.md`
- `project-context.pdf`

### Для более тонкой настройки:

В файле `utils/filePreview.js` можно отредактировать:

- `const IGNORED_DIRS` для управления игнорируемыми директориями
- `const IGNORED_FILES` для управления игнорируемыми файлами
- параметр `maxLines =` функции `getFilePreview` для управления размером сниппетов (дефолтное значение 250)