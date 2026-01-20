"""
Backend API для информационного ресурса 'Экология и мир'
Включает данные о заповедниках Республики Беларусь
"""

from flask import Flask, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

# Данные о заповедниках Беларуси
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

@app.route('/api/health', methods=['GET'])
def health_check():
    """Проверка работоспособности API"""
    return jsonify({"status": "ok", "message": "API работает корректно"})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)

