// 创建定时器，每两秒检测一次
setInterval(() => {
  // 检查当前页面是否是首页
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    // 获取目标元素
    const hitokotoElement = document.querySelector('small.text-center');
    
    if (hitokotoElement) {
      // 检查内容是否为默认文本
      if (hitokotoElement.innerText === '当第一颗卫星飞向大气层外，我们便以为自己终有一日会征服宇宙。') {        
        // 使用 fetch 请求数据
        fetch('https://v1.hitokoto.cn')
          .then(response => {
            // 检查响应是否成功
            if (!response.ok) {
              throw new Error('网络响应失败');
            }
            return response.json(); // 解析 JSON 数据
          })
          .then(data => {
            // 替换元素内容为获取的句子
            hitokotoElement.innerText = data.hitokoto;
            console.log("默认文本已替换为一言:", data.hitokoto);
          })
          .catch(error => {
            console.error('一言请求失败：', error);
          });
      }
    } 
  } 
}, 1000); // 1000 毫秒 = 1 秒
