import os
import json
from app import app

def run():
    client = app.test_client()

    # 1) Register
    r = client.post('/api/auth/register', json={
        'name': 'Test User',
        'email': 'test@example.com',
        'password': 'secret123'
    })
    print('REGISTER:', r.status_code, r.get_data(as_text=True))

    # 2) Login
    r = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'secret123'
    })
    print('LOGIN:', r.status_code, r.get_data(as_text=True))
    token = None
    try:
        token = r.get_json().get('token')
    except Exception:
        pass

    # 3) Me (if token)
    if token:
        r = client.get('/api/auth/me', headers={'Authorization': f'Bearer {token}'})
        print('ME:', r.status_code, r.get_data(as_text=True))

if __name__ == '__main__':
    run()