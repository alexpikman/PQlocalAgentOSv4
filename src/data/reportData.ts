export interface RoadmapItem {
  id: string;
  category: 'P0' | 'P1' | 'P2' | 'P3' | 'P4';
  title: string;
  description: string;
  completed: boolean;
  verificationType: 'static_verified' | 'needs_target_machine';
}

export const ROADMAP_ITEMS: RoadmapItem[] = [
  // P0
  {
    id: 'p0-1',
    category: 'P0',
    title: 'Проверить все операции удаления и отвязки сущностей',
    description: 'Изолировать операцию "Убрать из чата" от глобального серверного удаления проекта.',
    completed: true,
    verificationType: 'static_verified',
  },
  {
    id: 'p0-2',
    category: 'P0',
    title: 'Защита удаления проекта при наличии связанных задач (HTTP 409)',
    description: 'Сервер отклоняет запрос DELETE с HTTP 409: "Нельзя удалить проект, к которому привязаны задачи. Сначала удалите или переназначьте задачи".',
    completed: true,
    verificationType: 'static_verified',
  },
  {
    id: 'p0-3',
    category: 'P0',
    title: 'Шифрование и безопасное хранение GitHub/SSH токенов (DPAPI)',
    description: 'Корректная обработка ctypes, DATA_BLOB, указателей и освобождение памяти LocalFree на Windows.',
    completed: false,
    verificationType: 'needs_target_machine',
  },
  {
    id: 'p0-4',
    category: 'P0',
    title: 'Границы разрешений SSH и SSRF-ограничения сетевых инструментов',
    description: 'working_dir задает каталог команды, но не заменяет песочницу; проверка фильтрации внутренних IP.',
    completed: false,
    verificationType: 'needs_target_machine',
  },
  // P1
  {
    id: 'p1-1',
    category: 'P1',
    title: 'Чистый сценарий установки и запуска на Windows',
    description: 'Инструкции и скрипты запуска Python/FastAPI бэкенда и Vite интерфейса.',
    completed: true,
    verificationType: 'static_verified',
  },
  {
    id: 'p1-2',
    category: 'P1',
    title: 'Прогон проверок Python и JavaScript на main',
    description: 'Статический синтаксический анализ, проверка типов и отсутствие сломанных импортов.',
    completed: true,
    verificationType: 'static_verified',
  },
  {
    id: 'p1-3',
    category: 'P1',
    title: 'Интеграционный тест локального чата с Ollama',
    description: 'Проверка передачи контекста проекта, потокового ответа и работы с моделью Qwen 2.5 Coder на порту 11434.',
    completed: false,
    verificationType: 'needs_target_machine',
  },
  {
    id: 'p1-4',
    category: 'P1',
    title: 'Устранение ошибки загрузки llama.dll для GGUF-моделей',
    description: 'Проверка загрузки llama-cpp-python в среде Windows и зависимостей C++ runtime.',
    completed: false,
    verificationType: 'needs_target_machine',
  },
  // P2
  {
    id: 'p2-1',
    category: 'P2',
    title: 'Инвентаризация всех API-эндпоинтов и интерфейсных страниц',
    description: 'Сверка REST-маршрутов с компонентами фронтенда, устранение расхождений.',
    completed: true,
    verificationType: 'static_verified',
  },
  {
    id: 'p2-2',
    category: 'P2',
    title: 'Сверка 5 параметров телеметрии и влияние серверного кеша',
    description: '1) Источник; 2) Поведение при отсутствии; 3) Формат API; 4) Визуализация; 5) Частота обновления и TTL кеша.',
    completed: true,
    verificationType: 'static_verified',
  },
  {
    id: 'p2-3',
    category: 'P2',
    title: 'Соблюдение 7 CSS-слоёв и удаление дублирующихся стилей',
    description: 'Tokens -> Base -> Shell -> Components -> Patterns -> Sections -> Responsive.',
    completed: true,
    verificationType: 'static_verified',
  },
  // P3
  {
    id: 'p3-1',
    category: 'P3',
    title: 'Сквозные сценарии сред: local, github, ssh',
    description: 'Проверка передачи working_dir и SSH-подключения в выполнение задач агентом.',
    completed: true,
    verificationType: 'static_verified',
  },
  {
    id: 'p3-2',
    category: 'P3',
    title: 'Использование репозитория конкретного проекта вместо глобального',
    description: 'Убедиться, что агент в GitHub-среде привязан к repo_url проекта, а не к глобальной настройке.',
    completed: false,
    verificationType: 'needs_target_machine',
  },
  {
    id: 'p3-3',
    category: 'P3',
    title: 'Обратная совместимость старых проектов без поля environment',
    description: 'Проекты без явного типа получают local по умолчанию без нарушения структуры данных.',
    completed: true,
    verificationType: 'static_verified',
  },
  // P4
  {
    id: 'p4-1',
    category: 'P4',
    title: 'Формализация контракта модуля и метаданных',
    description: 'Ограничения на объем загрузки сторонних модулей и число файлов для исключения произвольного исполнения.',
    completed: true,
    verificationType: 'static_verified',
  },
  {
    id: 'p4-2',
    category: 'P4',
    title: 'Графовый исполнитель (input -> template -> ollama -> transform -> output)',
    description: 'Валидация узлов, перехват ошибок провайдера и пошаговая цепочка преобразований.',
    completed: true,
    verificationType: 'static_verified',
  },
];

export const COMMITS_LOG = [
  {
    hash: 'a210e13',
    title: 'Запрет удаления глобального проекта из чата',
    description: 'Действие в чате переведено на отвязку от контекста без DELETE /api/projects/:id.',
    status: 'Merged & Verified',
  },
  {
    hash: 'c90529c',
    title: 'Защита проекта, к которому привязаны задачи (HTTP 409)',
    description: 'Блокировка удаления проекта при наличии задач с сообщением пользователю.',
    status: 'Merged & Verified',
  },
  {
    hash: '87cdaf6',
    title: 'Уточнение названия действия удаления проекта',
    description: 'Разделение меток "Убрать из чата" и "Удалить проект".',
    status: 'Merged & Verified',
  },
  {
    hash: '4b3b0bf',
    title: 'Добавление рабочего каталога для инструментов',
    description: 'Параметр working_dir добавлен в конфигурацию инструментария агента.',
    status: 'Merged & Verified',
  },
  {
    hash: '0e79a15',
    title: 'Тип среды проекта и инструкции',
    description: 'Поддержка local, github, ssh в схеме сущности и системных промптах.',
    status: 'Merged & Verified',
  },
  {
    hash: 'cff9a62',
    title: 'Передача каталога и SSH-подключения в выполнение задач',
    description: 'Paramiko команды выполняются с переходом в настроенную директорию.',
    status: 'Merged & Verified',
  },
  {
    hash: '68cce57',
    title: 'Поля среды в модальном окне проекта',
    description: 'Условные поля в UI для SSH-подключений и GitHub репозиториев.',
    status: 'Merged & Verified',
  },
  {
    hash: '5d7e5a7',
    title: 'Метка среды в списке проектов',
    description: 'Отображение типа среды в карточке проекта.',
    status: 'Merged & Verified',
  },
];
