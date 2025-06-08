import requests
import json
from datetime import datetime

def convert_friends_data():
    # 获取原始API数据
    api_url = "https://mx.trfox.top/api/v2/links"
    
    # 添加常见的请求头
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.9",
        "Referer": "https://mx.trfox.top/",
        "Origin": "https://mx.trfox.top",
        "Connection": "keep-alive",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-origin"
    }
    
    try:
        response = requests.get(api_url, headers=headers, timeout=10)
        response.raise_for_status()  # 如果请求失败会抛出HTTPError
        
        data = response.json()
        
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
    
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {str(e)}")
        return None
    except json.JSONDecodeError:
        print("Error decoding JSON response")
        return None

def save_to_file(data, filename="blog/friends.json"):
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        return True
    except IOError as e:
        print(f"Error saving file: {str(e)}")
        return False

if __name__ == "__main__":
    print(f"Starting conversion at {datetime.now().isoformat()}")
    converted_data = convert_friends_data()
    if converted_data:
        if save_to_file(converted_data):
            print("Conversion and save completed successfully")
        else:
            print("Conversion succeeded but save failed")
    else:
        print("Conversion failed")
