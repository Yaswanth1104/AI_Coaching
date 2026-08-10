import requests

url = "http://127.0.0.1:5000/analyze"

data = {
    "message": "My internet has been down since yesterday."
}

response = requests.post(url, json=data)

print(response.status_code)

print(response.json())