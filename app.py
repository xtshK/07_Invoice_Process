from flask import Flask, jsonify, send_from_directory
import os

app = Flask(__name__, static_folder='.')

# Mock User Data
users = [
    {
        "id": 1,
        "name": "Alex Chen",
        "email": "alex.chen@procureflow.com",
        "role": "Engineering Manager",
        "department": "Engineering",
        "status": "Active",
        "avatar_color": "#6366f1"
    },
    {
        "id": 2,
        "name": "Sarah Smith",
        "email": "sarah.smith@procureflow.com",
        "role": "Director",
        "department": "Engineering",
        "status": "Active",
        "avatar_color": "#10b981"
    },
    {
        "id": 3,
        "name": "Mike Johnson",
        "email": "mike.j@procureflow.com",
        "role": "Designer",
        "department": "Design",
        "status": "Away",
        "avatar_color": "#f59e0b"
    },
    {
        "id": 4,
        "name": "Emily Davis",
        "email": "emily.d@procureflow.com",
        "role": "Product Owner",
        "department": "Product",
        "status": "Active",
        "avatar_color": "#ec4899"
    },
    {
        "id": 5,
        "name": "David Wilson",
        "email": "david.w@procureflow.com",
        "role": "DevOps Engineer",
        "department": "IT",
        "status": "Offline",
        "avatar_color": "#64748b"
    }
]

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/users')
def get_users():
    return jsonify(users)

@app.route('/api/current_user')
def get_current_user():
    # Mocking the currently logged-in user (Alex Chen)
    current_user = users[0]
    return jsonify(current_user)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
