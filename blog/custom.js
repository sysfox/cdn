// SPA 路由监听逻辑
const observeSPARouteChange = () => {
  const targetNode = document.documentElement;
  const config = { childList: true, subtree: true };
  
  const callback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        // 防抖处理快速路由切换
        clearTimeout(window._spaDebounce);
        window._spaDebounce = setTimeout(() => {
          checkAndReplaceHitokoto();
        }, 100);
      }
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
};

// 整合检查与替换逻辑
const checkAndReplaceHitokoto = async () => {
  const hitokotoElement = document.querySelector('small.text-center');
  if (!hitokotoElement) return;

  const DEFAULT_TEXT = "当第一颗卫星飞向大气层外，我们便以为自己终有一日会征服宇宙。";
  if (hitokotoElement.innerText.trim() !== DEFAULT_TEXT) {
    console.log('检测到非默认文本，跳过替换');
    return;
  }

  try {
    const response = await fetch('https://v1.hitokoto.cn');
    if (!response.ok) throw new Error(`HTTP 错误! 状态码: ${response.status}`);
    
    const data = await response.json();
    hitokotoElement.innerText = data.hitokoto;
    console.log("默认一言已替换");
  } catch (error) {
    console.error('请求失败：', error);
  }
};

// 主逻辑改造
if (typeof window !== 'undefined' && window.location.hostname.endsWith('.trfox.top')) {
  if (!isBlogSubdomain()) {
    console.log('本脚本仅限 blog 子域名使用');
    return;
  }

  // 初始执行
  checkAndReplaceHitokoto();
  
  // 监听 SPA 路由变化
  observeSPARouteChange();
  
  // 兼容 Next.js 快速刷新
  if (module.hot) {
    module.hot.dispose(() => {
      window.location.reload();
    });
  }
}