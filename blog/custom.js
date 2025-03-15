// 域名检查函数
const isBlogSubdomain = () => window.location.hostname === 'blog.trfox.top';
const isHomePage = () => ['/', '/index.html'].includes(window.location.pathname);

// SPA 路由监听逻辑 (带内存泄漏防护)
let observer = null;
const observeSPARouteChange = () => {
  // 清理旧监听器
  if (observer) {
    observer.disconnect();
    observer = null;
  }

  const targetNode = document.documentElement;
  const config = { childList: true, subtree: true };
  
  const callback = (mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        clearTimeout(window._spaDebounce);
        window._spaDebounce = setTimeout(() => {
          checkAndReplaceHitokoto();
        }, 100);
      }
    }
  };

  observer = new MutationObserver(callback);
  observer.observe(targetNode, config);
};

// 带重试机制的替换逻辑
const checkAndReplaceHitokoto = async () => {
  let retryCount = 0;
  const maxRetries = 3;
  const DEFAULT_TEXT = "当第一颗卫星飞向大气层外，我们便以为自己终有一日会征服宇宙。";

  while (retryCount < maxRetries) {
    const hitokotoElement = document.querySelector('small.text-center');
    
    // 元素存在性检查
    if (!hitokotoElement) {
      console.log(`元素未找到，正在重试 (${retryCount + 1}/${maxRetries})`);
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 500));
      continue;
    }

    // 默认文本检查
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
      break; // 成功时退出循环
    } catch (error) {
      console.error(`请求失败 (尝试 ${retryCount + 1}/${maxRetries}):`, error);
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

// 主执行逻辑
if (typeof window !== 'undefined' && window.location.hostname.endsWith('.trfox.top')) {
  // 服务端渲染保护
  if (typeof document === 'undefined') return;

  // 域名过滤
  if (!isBlogSubdomain()) {
    console.log('本脚本仅限 blog 子域名使用');
    return;
  }

  // 初始化流程
  const init = () => {
    checkAndReplaceHitokoto();
    observeSPARouteChange();
    document.addEventListener('scroll', checkAndReplaceHitokoto);
  };

  // 加载时机处理
  if (document.readyState === 'complete') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

  // 清理逻辑
  window.addEventListener('beforeunload', () => {
    observer?.disconnect();
    document.removeEventListener('scroll', checkAndReplaceHitokoto);
  });

  // Next.js 快速刷新处理
  if (module.hot) {
    module.hot.dispose(() => {
      window.location.reload();
    });
  }
}