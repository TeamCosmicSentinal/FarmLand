from flask import Blueprint, request, jsonify
import sqlite3
import os
from datetime import datetime

marketplace_bp = Blueprint('marketplace', __name__)

# Database path within backend folder
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'marketplace.db')

# Ensure DB and table exist
def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute(
            '''CREATE TABLE IF NOT EXISTS listings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                crop_name TEXT NOT NULL,
                quantity TEXT NOT NULL,
                price REAL NOT NULL,
                location TEXT NOT NULL,
                contact TEXT NOT NULL,
                created_at TEXT NOT NULL
            )'''
        )
        conn.commit()
    finally:
        conn.close()

init_db()


def row_to_dict(row):
    return {
        'id': row[0],
        'crop_name': row[1],
        'quantity': row[2],
        'price': row[3],
        'location': row[4],
        'contact': row[5],
        'created_at': row[6],
    }

@marketplace_bp.route('/', methods=['GET'])
def list_listings():
    conn = sqlite3.connect(DB_PATH)
    try:
        cur = conn.execute('SELECT id, crop_name, quantity, price, location, contact, created_at FROM listings ORDER BY datetime(created_at) DESC')
        rows = cur.fetchall()
        return jsonify([row_to_dict(r) for r in rows])
    finally:
        conn.close()

@marketplace_bp.route('/<int:item_id>', methods=['GET'])
def get_listing(item_id: int):
    conn = sqlite3.connect(DB_PATH)
    try:
        cur = conn.execute('SELECT id, crop_name, quantity, price, location, contact, created_at FROM listings WHERE id = ?', (item_id,))
        row = cur.fetchone()
        if not row:
            return jsonify({'error': 'Not found'}), 404
        return jsonify(row_to_dict(row))
    finally:
        conn.close()

@marketplace_bp.route('/', methods=['POST'])
def create_listing():
    data = request.get_json(silent=True) or {}
    crop_name = (data.get('crop_name') or '').strip()
    quantity = (data.get('quantity') or '').strip()
    price = data.get('price')
    location = (data.get('location') or '').strip()
    contact = (data.get('contact') or '').strip()

    # Basic validation
    errors = []
    if not crop_name:
        errors.append('crop_name is required')
    if not quantity:
        errors.append('quantity is required')
    try:
        price = float(price)
    except Exception:
        errors.append('price must be a number')
    if not location:
        errors.append('location is required')
    if not contact:
        errors.append('contact is required')

    if errors:
        return jsonify({'error': 'Validation failed', 'details': errors}), 400

    created_at = datetime.utcnow().isoformat()

    conn = sqlite3.connect(DB_PATH)
    try:
        cur = conn.execute(
            'INSERT INTO listings (crop_name, quantity, price, location, contact, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            (crop_name, quantity, price, location, contact, created_at)
        )
        conn.commit()
        new_id = cur.lastrowid
        return jsonify({'id': new_id, 'crop_name': crop_name, 'quantity': quantity, 'price': price, 'location': location, 'contact': contact, 'created_at': created_at}), 201
    finally:
        conn.close()

@marketplace_bp.route('/<int:item_id>', methods=['DELETE'])
def delete_listing(item_id: int):
    conn = sqlite3.connect(DB_PATH)
    try:
        cur = conn.execute('DELETE FROM listings WHERE id = ?', (item_id,))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True})
    finally:
        conn.close()