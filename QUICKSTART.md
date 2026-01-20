# Быстрый старт

## Шаг 1: Установка зависимостей

### Frontend
```bash
npm install
```

### Backend
```bash
pip install -r requirements.txt
```

## Шаг 2: Добавление изображений

Поместите изображения в следующие папки:

- `public/images/hero/hero-background.jpg`
- `public/images/about/about-nature.jpg`
- `public/images/contact/contact-nature.jpg`
- `public/images/reserves/belovezhskaya-pushcha.jpg`
- `public/images/reserves/berezinsky.jpg`
- `public/images/reserves/pripyatsky.jpg`
- `public/images/reserves/narochansky.jpg`
- `public/images/reserves/braslavskie.jpg`
- `public/images/reserves/polesky.jpg`

**Подробные инструкции:** см. файл `INSTRUCTIONS.md`

## Шаг 3: Запуск приложения

### Вариант 1: Автоматический запуск (Windows)
```bash
start.bat
```

### Вариант 2: Автоматический запуск (Linux/Mac)
```bash
chmod +x start.sh
./start.sh
```

### Вариант 3: Ручной запуск

**Терминал 1 - Backend:**
```bash
cd backend
python app.py
```

**Терминал 2 - Frontend:**
```bash
npm start
```

## Шаг 4: Открыть в браузере

Откройте: http://localhost:3000

## Готово! 🎉

Приложение должно работать. Если возникли проблемы:

1. Убедитесь, что порты 3000 и 5000 свободны
2. Проверьте, что все зависимости установлены
3. Убедитесь, что изображения добавлены в правильные папки
4. Проверьте консоль браузера на наличие ошибок

