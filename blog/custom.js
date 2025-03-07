// 检查当前页面是否是首页
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
  // 延时 2 秒执行
  setTimeout(() => {
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
        // 获取目标元素
        const hitokotoElement = document.querySelector('small.text-center');
        if (hitokotoElement) {
          // 替换元素内容为获取的句子
          hitokotoElement.innerText = data.hitokoto;
          console.log("默认一言已替换");
        }
      })
      .catch(error => {
        console.error('请求失败：', error);
      });
  }, 200); // 200 毫秒 = 0.2 秒
}
