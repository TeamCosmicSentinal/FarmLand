from flask import Blueprint, jsonify
import sqlite3
import os
from datetime import datetime, timezone
import jwt

superuser_bp = Blueprint('superuser', __name__)

MARKET_DB = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'marketplace.db')
AUTH_JWT_SECRET = os.getenv('JWT_SECRET', 'change-me-in-prod')
JWT_ALG = 'HS256'


def token_from_header(request):
    auth = request.headers.get('Authorization') or ''
    if auth.lower().startswith('bearer '):
        return auth.split(' ', 1)[1].strip()
    return None


def require_superuser(request):
    token = token_from_header(request)
    if not token:
        return None, (jsonify({'error': 'Missing token'}), 401)
    try:
        payload = jwt.decode(token, AUTH_JWT_SECRET, algorithms=[JWT_ALG])
    except Exception:
        return None, (jsonify({'error': 'Invalid token'}), 401)
    if (payload or {}).get('role') != 'superuser':
        return None, (jsonify({'error': 'forbidden'}), 403)
    return payload, None


@superuser_bp.route('/verify-crop/<int:item_id>', methods=['POST'])
def verify_crop(item_id: int):
    from flask import request
    payload, err = require_superuser(request)
    if err:
        return err
    conn = sqlite3.connect(MARKET_DB)
    try:
        now = datetime.now(timezone.utc).isoformat()
        cur = conn.execute('UPDATE listings SET verified_by_superuser = 1, verified_at = ?, verified_by_sub = ? WHERE id = ?', (now, str(payload.get('sub')), item_id))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True, 'verified_at': now})
    finally:
        conn.close()


@superuser_bp.route('/delete-crop/<int:item_id>', methods=['DELETE'])
def delete_crop(item_id: int):
    from flask import request
    payload, err = require_superuser(request)
    if err:
        return err
    conn = sqlite3.connect(MARKET_DB)
    try:
        cur = conn.execute('DELETE FROM listings WHERE id = ?', (item_id,))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True})
    finally:
        conn.close()

# Equipment verification requests table (minimal) for demo
# We'll store equipment requests in marketplace.db if not exists

def init_equipment_table():
    conn = sqlite3.connect(MARKET_DB)
    try:
        conn.execute(
            '''CREATE TABLE IF NOT EXISTS equipment_requests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                equipment_id TEXT,
                equipment_name TEXT,
                brand TEXT,
                origin TEXT,
                compliance_info TEXT,
                created_by_sub TEXT,
                created_at TEXT,
                verified_by_superuser INTEGER DEFAULT 0,
                verified_at TEXT,
                verified_by_sub TEXT
            )'''
        )
        conn.commit()
    finally:
        conn.close()

init_equipment_table()


@superuser_bp.route('/verify-equipment/<int:req_id>', methods=['POST'])
def verify_equipment(req_id: int):
    from flask import request
    payload, err = require_superuser(request)
    if err:
        return err
    conn = sqlite3.connect(MARKET_DB)
    try:
        now = datetime.now(timezone.utc).isoformat()
        cur = conn.execute('UPDATE equipment_requests SET verified_by_superuser = 1, verified_at = ?, verified_by_sub = ? WHERE id = ?', (now, str(payload.get('sub')), req_id))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True, 'verified_at': now})
    finally:
        conn.close()


@superuser_bp.route('/delete-equipment/<int:req_id>', methods=['DELETE'])
def delete_equipment(req_id: int):
    from flask import request
    payload, err = require_superuser(request)
    if err:
        return err
    conn = sqlite3.connect(MARKET_DB)
    try:
        cur = conn.execute('DELETE FROM equipment_requests WHERE id = ?', (req_id,))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({'error': 'Not found'}), 404
        return jsonify({'success': True})
    finally:
        conn.close()


@superuser_bp.route('/equipment-requests', methods=['GET'])
def list_equipment_requests():
    from flask import request
    payload, err = require_superuser(request)
    if err:
        return err
    conn = sqlite3.connect(MARKET_DB)
    try:
        cur = conn.execute('SELECT id, equipment_id, equipment_name, brand, origin, compliance_info, created_by_sub, created_at, verified_by_superuser, verified_at, verified_by_sub FROM equipment_requests ORDER BY datetime(created_at) DESC')
        rows = cur.fetchall()
        items = []
        for r in rows:
            items.append({
                'id': r[0],
                'equipment_id': r[1],
                'equipment_name': r[2],
                'brand': r[3],
                'origin': r[4],
                'compliance_info': r[5],
                'created_by_sub': r[6],
                'created_at': r[7],
                'verified_by_superuser': bool(r[8] or 0),
                'verified_at': r[9],
                'verified_by_sub': r[10],
            })
        return jsonify(items)
    finally:
        conn.close()