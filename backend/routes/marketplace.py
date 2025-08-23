from flask import Blueprint, request, jsonify
import sqlite3
import os
from datetime import datetime
import jwt

marketplace_bp = Blueprint('marketplace', __name__)

# Database path within backend folder
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'marketplace.db')

JWT_SECRET = os.getenv('JWT_SECRET', 'change-me-in-prod')
JWT_ALG = 'HS256'

def token_from_header():
    auth = request.headers.get('Authorization') or ''
    if auth.lower().startswith('bearer '):
        return auth.split(' ', 1)[1].strip()
    return None

def require_auth_payload():
    token = token_from_header()
    if not token:
        return None, (jsonify({'error': 'Missing token'}), 401)
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        return payload, None
    except Exception:
        return None, (jsonify({'error': 'Invalid token'}), 401)

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
        # Migrations: add owner/verification columns if missing
        try:
            conn.execute('ALTER TABLE listings ADD COLUMN owner_sub TEXT')
        except Exception:
            pass
        try:
            conn.execute('ALTER TABLE listings ADD COLUMN verified_by_superuser INTEGER DEFAULT 0')
        except Exception:
            pass
        try:
            conn.execute('ALTER TABLE listings ADD COLUMN verified_at TEXT')
        except Exception:
            pass
        try:
            conn.execute('ALTER TABLE listings ADD COLUMN verified_by_sub TEXT')
        except Exception:
            pass
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
        cur = conn.execute('SELECT id, crop_name, quantity, price, location, contact, created_at, owner_sub, verified_by_superuser, verified_at, verified_by_sub FROM listings ORDER BY datetime(created_at) DESC')
        rows = cur.fetchall()
        return jsonify([{
            'id': r[0],
            'crop_name': r[1],
            'quantity': r[2],
            'price': r[3],
            'location': r[4],
            'contact': r[5],
            'created_at': r[6],
            'owner_sub': r[7],
            'verified_by_superuser': bool(r[8] or 0),
            'verified_at': r[9],
            'verified_by_sub': r[10],
        } for r in rows])
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
    payload, err = require_auth_payload()
    if err:
        return err

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
            'INSERT INTO listings (crop_name, quantity, price, location, contact, created_at, owner_sub, verified_by_superuser, verified_at, verified_by_sub) VALUES (?, ?, ?, ?, ?, ?, ?, 0, NULL, NULL)',
            (crop_name, quantity, price, location, contact, created_at, str(payload.get('sub')) if payload else None)
        )
        conn.commit()
        new_id = cur.lastrowid
        return jsonify({'id': new_id, 'crop_name': crop_name, 'quantity': quantity, 'price': price, 'location': location, 'contact': contact, 'created_at': created_at, 'owner_sub': str(payload.get('sub'))}), 201
    finally:
        conn.close()

@marketplace_bp.route('/<int:item_id>', methods=['DELETE'])
def delete_listing(item_id: int):
    payload, err = require_auth_payload()
    if err:
        return err

    conn = sqlite3.connect(DB_PATH)
    try:
        cur = conn.execute('SELECT owner_sub FROM listings WHERE id = ?', (item_id,))
        row = cur.fetchone()
        if not row:
            return jsonify({'error': 'Not found'}), 404
        owner_sub = row[0]
        # Only owner can delete via this route; superuser has separate route
        if str(payload.get('sub')) != (owner_sub or ''):
            return jsonify({'error': 'forbidden'}), 403
        cur = conn.execute('DELETE FROM listings WHERE id = ?', (item_id,))
        conn.commit()
        return jsonify({'success': True})
    finally:
        conn.close()