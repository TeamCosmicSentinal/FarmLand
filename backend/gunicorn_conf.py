# Basic gunicorn config for Render
workers = 2
threads = 4
worker_class = 'gthread'
bind = '0.0.0.0:8000'
timeout = 120