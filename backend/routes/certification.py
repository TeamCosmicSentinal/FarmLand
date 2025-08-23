from flask import Blueprint, request, jsonify
import os
import sqlite3
from datetime import datetime, timezone
import jwt

from services.gemini_service import verify_product_certification

certification_bp = Blueprint('certification', __name__)

# Reuse auth settings
JWT_SECRET = os.getenv('JWT_SECRET', 'change-me-in-prod')
JWT_ALG = 'HS256'

# Use marketplace.db for demo reports to avoid adding a new DB file
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'marketplace.db')


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute(
            '''CREATE TABLE IF NOT EXISTS certification_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                product_id TEXT,
                crop_name TEXT,
                reason TEXT,
                details TEXT,
                reporter_sub TEXT,
                created_at TEXT NOT NULL
            )'''
        )
        conn.commit()
    finally:
        conn.close()


init_db()


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


@certification_bp.route('/verify', methods=['POST'])
def verify():
    # Protect endpoint
    payload, err = require_auth_payload()
    if err:
        return err

    body = request.get_json(silent=True) or {}
    # Accept equipment fields; fallback to legacy product fields
    equipment_id = (body.get('equipment_id') or body.get('product_id') or '').strip()
    equipment_name = (body.get('equipment_name') or body.get('crop_name') or '').strip()
    brand = (body.get('brand') or '').strip()
    origin = (body.get('origin') or '').strip()
    compliance_info = (body.get('compliance_info') or '').strip()
    extra = body.get('extra') or {}

    if not equipment_id and not equipment_name:
        return jsonify({'error': 'Provide equipment_id or equipment_name'}), 400

    # Do not persist certification requests; operate fully dynamically
    # (Previously stored a row in equipment_requests for analytics.)

    try:
        result = verify_product_certification({
            'equipment_id': equipment_id,
            'equipment_name': equipment_name,
            'brand': brand,
            'origin': origin,
            'compliance_info': compliance_info,
            'extra': extra,
        })
        # Normalize response
        status = result.get('status') or 'unknown'
        explanation = result.get('explanation') or 'No explanation provided.'
        confidence = result.get('confidence')
        return jsonify({
            'equipment_id': equipment_id,
            'equipment_name': equipment_name,
            'status': status,
            'confidence': confidence,
            'explanation': explanation,
        })
    except Exception as e:
        return jsonify({'error': 'verification_failed', 'details': str(e)}), 500


@certification_bp.route('/report', methods=['POST'])
def report():
    # Protect endpoint
    payload, err = require_auth_payload()
    if err:
        return err

    body = request.get_json(silent=True) or {}
    product_id = (body.get('product_id') or '').strip()
    crop_name = (body.get('crop_name') or '').strip()
    reason = (body.get('reason') or '').strip() or 'Suspicious product'
    details = (body.get('details') or '').strip()

    conn = sqlite3.connect(DB_PATH)
    try:
        created_at = datetime.now(timezone.utc).isoformat()
        conn.execute(
            'INSERT INTO certification_reports (product_id, crop_name, reason, details, reporter_sub, created_at) VALUES (?, ?, ?, ?, ?, ?)',
            (product_id, crop_name, reason, details, str(payload.get('sub')) if payload else None, created_at)
        )
        conn.commit()
        return jsonify({'success': True, 'created_at': created_at})
    finally:
        conn.close()


@certification_bp.route('/reports', methods=['GET'])
def list_reports():
    # Protected but simple
    payload, err = require_auth_payload()
    if err:
        return err

    conn = sqlite3.connect(DB_PATH)
    try:
        cur = conn.execute('SELECT id, product_id, crop_name, reason, details, reporter_sub, created_at FROM certification_reports ORDER BY datetime(created_at) DESC')
        rows = cur.fetchall()
        items = []
        for r in rows:
            items.append({
                'id': r[0],
                'product_id': r[1],
                'crop_name': r[2],
                'reason': r[3],
                'details': r[4],
                'reporter_sub': r[5],
                'created_at': r[6],
            })
        return jsonify(items)
    finally:
        conn.close()