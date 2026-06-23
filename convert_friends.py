  import requests
  import logging
  from typing import Optional

  logging.basicConfig(
      level=logging.INFO,
      format='%(asctime)s - %(levelname)s - %(message)s'
  )
  logger = logging.getLogger(__name__)


  def convert_friends_data() -> Optional[dict]:
      """从 trfox API 获取友链数据"""
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
              response = requests.get(
                  base_url,
                  params={"page": page},
                  headers=headers,
                  timeout=10
              )
              response.raise_for_status()
              data = response.json()

              # 首次请求获取总数
              if total_pages is None:
                  pagination = data.get("meta", {}).get("pagination", {})
                  total_pages = pagination.get("total_pages", 1)
                  total = pagination.get("total", 0)
                  logger.info(f"API 返回: 共 {total} 个友链，{total_pages} 页")

              # 处理当前页
              friends_on_page = 0
              for friend in data.get("data", []):
                  if friend.get("hide", False):
                      continue

                  name = friend.get("name", "")
                  url = friend.get("url", "")
                  avatar = friend.get("avatar") or ""
                  description = friend.get("description") or ""
                  email = friend.get("email")

                  if name and url:
                      all_friends.append({
                          "name": name,
                          "url": url,
                          "avatar": avatar,
                          "description": description,
                          "email": email
                      })
                      friends_on_page += 1

              logger.info(f"第 {page}/{total_pages} 页: 解析 {friends_on_page} 个友链")

              if page >= total_pages:
                  break
              page += 1

          logger.info(f"✅ 完成: 共获取 {len(all_friends)} 个友链")
          return {"friends": all_friends}

      except requests.exceptions.Timeout:
          logger.error("请求超时")
          return None
      except requests.exceptions.HTTPError as e:
          logger.error(f"HTTP 错误: {e.response.status_code}")
          return None
      except requests.exceptions.RequestException as e:
          logger.error(f"网络错误: {e}")
          return None
      except (ValueError, json.JSONDecodeError):
          logger.error("响应解析失败")
          return None


  if __name__ == "__main__":
      result = convert_friends_data()
      if result:
          import json
          print(json.dumps(result, ensure_ascii=False, indent=2))
