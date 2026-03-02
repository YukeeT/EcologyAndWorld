"""
Backend API для информационного ресурса 'Экология и мир'
Включает данные о заповедниках Республики Беларусь и базу данных
для хранения информации о животных и бронированиях домиков.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import sqlite3
from datetime import datetime
from typing import Optional
import urllib.parse
import urllib.request
import json
import re

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "ecology.db")


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def fetch_wikipedia_summary(title: str) -> Optional[str]:
    """Получить краткое описание сущности из русской Википедии."""
    try:
        base_url = "https://ru.wikipedia.org/api/rest_v1/page/summary/{}"
        url = base_url.format(urllib.parse.quote(title))
        with urllib.request.urlopen(url, timeout=5) as resp:
            if resp.status == 200:
                data = json.loads(resp.read().decode("utf-8"))
                extract = data.get("extract")
                if extract:
                    # Ограничиваем длину, чтобы описание оставалось компактным
                    return extract[:800]
    except Exception:
        # В случае любой ошибки просто вернем None, чтобы не ломать сервис
        return None
    return None


def seed_animals_from_web(cur: sqlite3.Cursor) -> None:
    """
    Заполнить таблицу animals, получая описания видов с русской Википедии.
    Список видов (название и латинское название) определен вручную,
    а текст описания подгружается из сети.
    """
    animals_meta = [
        # Беловежская пуща
        (1, "Европейский зубр", "Bison bonasus"),
        (1, "Бурый медведь", "Ursus arctos"),
        (1, "Чёрный аист", "Ciconia nigra"),
        # Березинский биосферный заповедник
        (2, "Бобр речной", "Castor fiber"),
        (2, "Рысь обыкновенная", "Lynx lynx"),
        (2, "Большой подорлик", "Clanga clanga"),
        # Припятский национальный парк
        (3, "Лось", "Alces alces"),
        (3, "Выдра речная", "Lutra lutra"),
        (3, "Серая цапля", "Ardea cinerea"),
        # Нарочанский национальный парк
        (4, "Судак", "Sander lucioperca"),
        (4, "Щука обыкновенная", "Esox lucius"),
        (4, "Большой крохаль", "Mergus merganser"),
        # Браславские озера
        (5, "Окунь речной", "Perca fluviatilis"),
        (5, "Большая поганка", "Podiceps cristatus"),
        (5, "Бобр речной", "Castor fiber"),
        # Полесский радиационно-экологический заповедник
        (6, "Волк обыкновенный", "Canis lupus"),
        (6, "Кабан дикий", "Sus scrofa"),
        (6, "Орлан-белохвост", "Haliaeetus albicilla"),
    ]

    for reserve_id, name, species in animals_meta:
        description = fetch_wikipedia_summary(name)
        cur.execute(
            "INSERT INTO animals (reserve_id, name, species, description) VALUES (?, ?, ?, ?)",
            (reserve_id, name, species, description),
        )


OFFICIAL_SITE_URLS = {
    1: "https://npbp.by/",
    2: "https://berezinsky.by/",
    3: "https://www.npp.by/",
    4: "https://narochpark.by/",
    5: "https://braslavpark.by/",
    6: "https://zapovednik.by/",
}


def fetch_page_title(url: str) -> Optional[str]:
    """Вернуть заголовок HTML-страницы (тег <title>) по указанному URL."""
    try:
        with urllib.request.urlopen(url, timeout=5) as resp:
            if resp.status == 200:
                html = resp.read().decode("utf-8", errors="ignore")
                match = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
                if match:
                    return match.group(1).strip()
    except Exception:
        return None
    return None


def seed_cabins_from_web(cur: sqlite3.Cursor) -> None:
    """
    Заполнить таблицу cabins.
    Для каждого заповедника используется официальный сайт как источник информации;
    в БД сохраняется ссылка и заголовок страницы как описание.
    Вместимость и ориентировочная цена указываются как примерные значения.
    """
    base_cabins = {
        1: [
            {"name": "Гостевые домики Беловежской пущи", "capacity": 4, "price_per_night": 120},
            {"name": "Эко-шале Беловежской пущи", "capacity": 6, "price_per_night": 180},
        ],
        2: [
            {"name": "Гостевые дома Березинского заповедника", "capacity": 3, "price_per_night": 90},
        ],
        3: [
            {"name": "Домики Припятского национального парка", "capacity": 5, "price_per_night": 140},
        ],
        4: [
            {"name": "Домики у озера Нарочь", "capacity": 4, "price_per_night": 150},
        ],
        5: [
            {"name": "Домики в парке «Браславские озёра»", "capacity": 4, "price_per_night": 130},
        ],
        6: [
            {"name": "Гостевые домики Полесского заповедника", "capacity": 2, "price_per_night": 80},
        ],
    }

    for reserve_id, cabins in base_cabins.items():
        source_url = OFFICIAL_SITE_URLS.get(reserve_id)
        title = fetch_page_title(source_url) if source_url else None

        for cabin in cabins:
            description_parts = []
            if title:
                description_parts.append(title)
            if source_url:
                description_parts.append(f"Подробнее о размещении и домиках: {source_url}")

            description = " — ".join(description_parts) if description_parts else None

            cur.execute(
                """
                INSERT INTO cabins (reserve_id, name, description, capacity, price_per_night, source_url)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    reserve_id,
                    cabin["name"],
                    description,
                    cabin.get("capacity"),
                    cabin.get("price_per_night"),
                    source_url,
                ),
            )
def init_db():
    """Инициализация базы данных (создание таблиц и загрузка данных из интернета)."""
    conn = get_db_connection()
    cur = conn.cursor()

    # Таблица животных, привязанных к заповеднику
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS animals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reserve_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            species TEXT NOT NULL,
            description TEXT
        )
        """
    )

    # Таблица домиков, привязанных к заповеднику
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS cabins (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reserve_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            capacity INTEGER,
            price_per_night REAL,
            source_url TEXT
        )
        """
    )

    # Таблица бронирований домиков
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            reserve_id INTEGER NOT NULL,
            cabin_name TEXT NOT NULL,
            guest_name TEXT NOT NULL,
            guest_email TEXT NOT NULL,
            start_date TEXT NOT NULL,
            end_date TEXT NOT NULL,
            guests INTEGER NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )

    # Загрузка информации о животных из интернета (если таблица пока пуста)
    cur.execute("SELECT COUNT(*) AS cnt FROM animals")
    count = cur.fetchone()["cnt"]
    if count == 0:
        seed_animals_from_web(cur)

    # Загрузка информации о домиках из интернета (если таблица пока пуста)
    cur.execute("SELECT COUNT(*) AS cnt FROM cabins")
    cabins_count = cur.fetchone()["cnt"]
    if cabins_count == 0:
        seed_cabins_from_web(cur)

    conn.commit()
    conn.close()


# Данные о заповедниках Беларуси (пока храним в памяти)
RESERVES_DATA = [
    {
        "id": 1,
        "name": "Беловежская пуща",
        "description": "Крупнейший остаток реликтового первобытного равнинного леса, который в доисторические времена произрастал на территории Европы. Включен в список Всемирного наследия ЮНЕСКО.",
        "area": "150000",
        "location": {
            "lat": 52.5736,
            "lng": 23.7994
        },
        "established": "1939",
        "image": "/images/reserves/belovezhskaya-pushcha.jpg",
        "gallery": [
            "/images/reserves/belovezhskaya-pushcha-1.jpg",
            "/images/reserves/belovezhskaya-pushcha-2.jpg",
            "/images/reserves/belovezhskaya-pushcha-3.jpg"
        ],
        "features": ["Бизоны", "Древние дубы", "Биосферный заповедник"]
    },
    {
        "id": 2,
        "name": "Березинский биосферный заповедник",
        "description": "Старейший заповедник Беларуси, созданный для охраны уникальных болотных экосистем. Включен в международную сеть биосферных резерватов ЮНЕСКО.",
        "area": "85100",
        "location": {
            "lat": 54.7333,
            "lng": 28.2833
        },
        "established": "1925",
        "image": "/images/reserves/berezinsky.jpg",
        "gallery": [
            "/images/reserves/berezinsky-1.jpg",
            "/images/reserves/berezinsky-2.jpg",
            "/images/reserves/berezinsky-3.jpg"
        ],
        "features": ["Болотные экосистемы", "Бобры", "Редкие птицы"]
    },
    {
        "id": 3,
        "name": "Припятский национальный парк",
        "description": "Крупнейший национальный парк Беларуси, расположенный в пойме реки Припять. Известен своими пойменными лугами и дубравами.",
        "area": "85841",
        "location": {
            "lat": 52.1167,
            "lng": 27.8667
        },
        "established": "1996",
        "image": "/images/reserves/pripyatsky.jpg",
        "gallery": [
            "/images/reserves/pripyatsky-1.jpg",
            "/images/reserves/pripyatsky-2.jpg",
            "/images/reserves/pripyatsky-3.jpg"
        ],
        "features": ["Пойменные луга", "Дубравы", "Водно-болотные угодья"]
    },
    {
        "id": 4,
        "name": "Нарочанский национальный парк",
        "description": "Парк создан для охраны уникальных озерных экосистем. На его территории находится более 40 озер, включая самое большое озеро Беларуси - Нарочь.",
        "area": "97300",
        "location": {
            "lat": 54.9167,
            "lng": 26.7167
        },
        "established": "1999",
        "image": "/images/reserves/narochansky.jpg",
        "gallery": [
            "/images/reserves/narochansky-1.jpg",
            "/images/reserves/narochansky-2.jpg",
            "/images/reserves/narochansky-3.jpg"
        ],
        "features": ["Озера", "Рыбные ресурсы", "Рекреация"]
    },
    {
        "id": 5,
        "name": "Браславские озера",
        "description": "Национальный парк, созданный для сохранения уникального комплекса озер ледникового происхождения. Известен своей живописной природой.",
        "area": "69115",
        "location": {
            "lat": 55.6333,
            "lng": 27.0333
        },
        "established": "1995",
        "image": "/images/reserves/braslavskie.jpg",
        "gallery": [
            "/images/reserves/braslavskie-1.jpg",
            "/images/reserves/braslavskie-2.jpg",
            "/images/reserves/braslavskie-3.jpg"
        ],
        "features": ["Ледниковые озера", "Острова", "Рыбалка"]
    },
    {
        "id": 6,
        "name": "Полесский радиационно-экологический заповедник",
        "description": "Создан после аварии на Чернобыльской АЭС для изучения последствий радиационного загрязнения и восстановления экосистем.",
        "area": "216093",
        "location": {
            "lat": 51.8333,
            "lng": 28.3333
        },
        "established": "1988",
        "image": "/images/reserves/polesky.jpg",
        "gallery": [
            "/images/reserves/polesky-1.jpg",
            "/images/reserves/polesky-2.jpg",
            "/images/reserves/polesky-3.jpg"
        ],
        "features": ["Радиоэкология", "Восстановление природы", "Научные исследования"]
    }
]


@app.route('/api/reserves', methods=['GET'])
def get_reserves():
    """Получить список всех заповедников"""
    return jsonify(RESERVES_DATA)


@app.route('/api/reserves/<int:reserve_id>', methods=['GET'])
def get_reserve(reserve_id):
    """Получить информацию о конкретном заповеднике"""
    reserve = next((r for r in RESERVES_DATA if r['id'] == reserve_id), None)
    if reserve:
        return jsonify(reserve)
    return jsonify({"error": "Заповедник не найден"}), 404


@app.route('/api/reserves/<int:reserve_id>/animals', methods=['GET'])
def get_reserve_animals(reserve_id):
    """Получить список животных для конкретного заповедника из базы данных."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, name, species, description FROM animals WHERE reserve_id = ?",
        (reserve_id,),
    )
    rows = cur.fetchall()
    conn.close()

    animals = [
        {
            "id": row["id"],
            "name": row["name"],
            "species": row["species"],
            "description": row["description"],
        }
        for row in rows
    ]
    return jsonify(animals)


@app.route('/api/reserves/<int:reserve_id>/cabins', methods=['GET'])
def get_reserve_cabins(reserve_id):
    """Получить список доступных домиков для выбранного заповедника из базы данных."""
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        "SELECT id, name, description, capacity, price_per_night, source_url FROM cabins WHERE reserve_id = ?",
        (reserve_id,),
    )
    rows = cur.fetchall()
    conn.close()

    cabins = [
        {
            "id": row["id"],
            "name": row["name"],
            "description": row["description"],
            "capacity": row["capacity"],
            "price_per_night": row["price_per_night"],
            "source_url": row["source_url"],
        }
        for row in rows
    ]
    return jsonify(cabins)


@app.route('/api/reserves/<int:reserve_id>/bookings', methods=['POST'])
def create_booking(reserve_id):
    """Создать бронирование домика в заповеднике и сохранить его в БД."""
    data = request.get_json() or {}

    required_fields = [
        "cabin_name",
        "guest_name",
        "guest_email",
        "start_date",
        "end_date",
        "guests",
    ]
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return (
            jsonify(
                {
                    "error": "Отсутствуют обязательные поля",
                    "missing": missing,
                }
            ),
            400,
        )

    try:
        guests = int(data.get("guests"))
    except (TypeError, ValueError):
        return jsonify({"error": "Поле 'guests' должно быть числом"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        """
        INSERT INTO bookings (
            reserve_id,
            cabin_name,
            guest_name,
            guest_email,
            start_date,
            end_date,
            guests,
            created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            reserve_id,
            data.get("cabin_name"),
            data.get("guest_name"),
            data.get("guest_email"),
            data.get("start_date"),
            data.get("end_date"),
            guests,
            datetime.utcnow().isoformat(),
        ),
    )
    conn.commit()
    conn.close()

    return jsonify({"status": "ok", "message": "Бронирование сохранено"}), 201

@app.route('/api/health', methods=['GET'])
def health_check():
    """Проверка работоспособности API"""
    return jsonify({"status": "ok", "message": "API работает корректно"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    # При старте приложения убедимся, что база инициализирована
    init_db()
    app.run(debug=True, host='0.0.0.0', port=port)

