import requests
import json
from datetime import datetime

def convert_friends_data():
    base_url = "https://mx.trfox.top/api/v3/links"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "application/json, text/plain, */*",
        "Referer": "https://mx.trfox.top/",
        "Origin": "https://mx.trfox.top"
    }
    
    all_friends = []
    page = 1
    total_pages = None

    try:
        while True:
            # 带分页参数请求
            response = requests.get(base_url, params={"page": page}, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            
            # 首次请求时获取总页数
            if total_pages is None:
                total_pages = data.get("meta", {}).get("pagination", {}).get("total_pages", 1)
            
            # 处理当前页数据
            for friend in data.get("data", []):
                if not friend.get("hide", False):  # 过滤隐藏的链接
                    name = friend.get("name", "")
                    url = friend.get("url", "")
                    avatar = friend.get("avatar", "")
                    if name and url:  # 确保必要字段存在
                        all_friends.append([name, url, avatar])
            
            # 判断是否还有下一页
            if page >= total_pages:
                break
            page += 1
        
        return {"friends": all_friends}
    
    except Exception as e:
        print(f"Error fetching data: {str(e)}")
        return None
