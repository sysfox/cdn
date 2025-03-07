// 检查当前页面是否是首页
if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
  axios.get('https://v1.hitokoto.cn')
    .then(({ data }) => {
      // 获取目标元素
      const hitokotoElement = document.querySelector('small.text-center');
      if (hitokotoElement) {
        // 替换元素内容为获取的句子
        hitokotoElement.innerText = data.hitokoto;
        console.log("默认一言已替换");
      }
    })
    .catch(console.error);
}
