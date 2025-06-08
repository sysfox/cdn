import requests
import json
from datetime import datetime

def convert_friends_data():
    # 获取原始API数据
    api_url = "https://mx.trfox.top/api/v2/links"
    response = requests.get(api_url)
    if response.status_code != 200:
        print(f"Error fetching data: {response.status_code}")
        return None
    
    try:
        data = response.json()
    except json.JSONDecodeError:
        print("Error decoding JSON response")
        return None
    
    # 转换数据格式
    converted = {"friends": []}
    
    for friend in data.get("data", []):
        if friend.get("hide", False):
            continue
        
        name = friend.get("name", "")
        url = friend.get("url", "")
        avatar = friend.get("avatar", "")
        
        if name and url:  # 确保必要字段存在
            converted["friends"].append([name, url, avatar])
    
    return converted

def save_to_file(data, filename="friends.json"):
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    print(f"Starting conversion at {datetime.now().isoformat()}")
    converted_data = convert_friends_data()
    if converted_data:
        save_to_file(converted_data, "blog/friends.json")
        print("Conversion completed successfully")
    else:
        print("Conversion failed")
