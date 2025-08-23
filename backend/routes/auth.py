from flask import Blueprint, request, jsonify
import sqlite3
import os
from datetime import datetime, timedelta, timezone
import jwt
from werkzeug.security import generate_password_hash, check_password_hash

from flask_cors import CORS

auth_bp = Blueprint('auth', __name__)
CORS(auth_bp)

# Database path within backend folder
DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'auth.db')

# JWT secret and settings
JWT_SECRET = os.getenv('JWT_SECRET', 'change-me-in-prod')
JWT_ALG = 'HS256'
JWT_TTL_DAYS = int(os.getenv('JWT_TTL_DAYS', '7'))


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    try:
        conn.execute(
            '''CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL
            )'''
        )
        # Migration: add role column if missing
        try:
            conn.execute('ALTER TABLE users ADD COLUMN role TEXT DEFAULT "user"')
        except Exception:
            pass
        conn.commit()
    finally:
        conn.close()


init_db()


def get_conn():
    return sqlite3.connect(DB_PATH)


def issue_token(user):
    now = datetime.now(timezone.utc)
    payload = {
        'sub': str(user['id']),
        'email': user['email'],
        'name': user['name'],
        'role': user.get('role') or 'user',
        'iat': int(now.timestamp()),
        'exp': int((now + timedelta(days=JWT_TTL_DAYS)).timestamp()),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALG)


def token_from_header():
    auth = request.headers.get('Authorization') or ''
    if auth.lower().startswith('bearer '):
        return auth.split(' ', 1)[1].strip()
    return None


@auth_bp.route('/register', methods=['POST', 'OPTIONS'])
def register():
    if request.method == 'OPTIONS':
        # CORS preflight response
        return ('', 204)

    data = request.get_json(silent=True) or {}
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    errors = []
    if not name:
        errors.append('name is required')
    if not email:
        errors.append('email is required')
    if not password or len(password) < 6:
        errors.append('password must be at least 6 characters')
    if errors:
        return jsonify({'error': 'Validation failed', 'details': errors}), 400

    conn = get_conn()
    try:
        cur = conn.execute('SELECT id FROM users WHERE email = ?', (email,))
        if cur.fetchone():
            return jsonify({'error': 'Email already registered'}), 409
        ph = generate_password_hash(password)
        created_at = datetime.utcnow().isoformat()
        # Default role = user
        cur = conn.execute(
            'INSERT INTO users (name, email, password_hash, created_at, role) VALUES (?, ?, ?, ?, ?)',
            (name, email, ph, created_at, 'user')
        )
        conn.commit()
        user_id = cur.lastrowid
        user = {'id': user_id, 'name': name, 'email': email, 'role': 'user'}
        token = issue_token(user)
        return jsonify({'token': token, 'user': user}), 201
    finally:
        conn.close()


@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return ('', 204)

    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({'error': 'email and password are required'}), 400

    conn = get_conn()
    try:
        cur = conn.execute('SELECT id, name, email, password_hash, role FROM users WHERE email = ?', (email,))
        row = cur.fetchone()
        if not row or not check_password_hash(row[3], password):
            return jsonify({'error': 'Invalid credentials'}), 401
        user = {'id': row[0], 'name': row[1], 'email': row[2], 'role': row[4] or 'user'}
        token = issue_token(user)
        return jsonify({'token': token, 'user': user})
    finally:
        conn.close()


@auth_bp.route('/me', methods=['GET'])
def me():
    token = token_from_header()
    if not token:
        return jsonify({'error': 'Missing token'}), 401
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALG])
        return jsonify({'user': {'id': payload.get('sub'), 'name': payload.get('name'), 'email': payload.get('email'), 'role': payload.get('role', 'user')}})
    except Exception:
        return jsonify({'error': 'Invalid token'}), 401


@auth_bp.route('/logout', methods=['POST', 'OPTIONS'])
def logout():
    if request.method == 'OPTIONS':
        return ('', 204)
    # Stateless JWT: client should discard token. Endpoint provided for symmetry.
    return jsonify({'success': True})


# Admin-only: set user role using a shared secret (set ADMIN_SECRET in environment)
@auth_bp.route('/set-role', methods=['POST'])
def set_role():
    data = request.get_json(silent=True) or {}
    admin_secret_env = os.getenv('ADMIN_SECRET')
    provided = request.headers.get('X-Admin-Secret') or data.get('admin_secret')
    if not admin_secret_env or provided != admin_secret_env:
        return jsonify({'error': 'forbidden'}), 403

    email = (data.get('email') or '').strip().lower()
    role = (data.get('role') or '').strip().lower()
    if role not in ('user', 'superuser'):
        return jsonify({'error': 'invalid role'}), 400
    if not email:
        return jsonify({'error': 'email required'}), 400

    conn = get_conn()
    try:
        cur = conn.execute('UPDATE users SET role = ? WHERE email = ?', (role, email))
        conn.commit()
        if cur.rowcount == 0:
            return jsonify({'error': 'user not found'}), 404
        return jsonify({'success': True, 'email': email, 'role': role})
    finally:
        conn.close()


@auth_bp.route('/su-login', methods=['POST'])
def su_login():
    data = request.get_json(silent=True) or {}
    admin_secret_env = os.getenv('ADMIN_SECRET')
    provided = request.headers.get('X-Admin-Secret') or data.get('admin_secret')
    if not admin_secret_env or provided != admin_secret_env:
        return jsonify({'error': 'forbidden'}), 403
    # Issue a superuser token without user record (ephemeral admin)
    user = {'id': 'su-admin', 'name': 'Superuser', 'email': 'superuser@local', 'role': 'superuser'}
    token = issue_token(user)
    return jsonify({'token': token, 'user': user})