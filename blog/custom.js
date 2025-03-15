// 检查是否是 blog 子域名
const isBlogSubdomain = () => window.location.hostname === 'blog.trfox.top';
// 检查是否是博客首页
const isHomePage = () => ['/', '/index.html'].includes(window.location.pathname);

// 获取并替换一言
const replaceHitokoto = async () => {
  try {
    const hitokotoElement = document.querySelector('small.text-center');
    // 先检查元素是否存在
    if (!hitokotoElement) return;

    // 默认文本检查
    const DEFAULT_TEXT = "当第一颗卫星飞向大气层外，我们便以为自己终有一日会征服宇宙。";
    if (hitokotoElement.innerText.trim() !== DEFAULT_TEXT) {
      console.log('检测到非默认文本，跳过替换');
      return;
    }

    const response = await fetch('https://v1.hitokoto.cn');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    hitokotoElement.innerText = data.hitokoto;
    console.log("默认一言已替换");
  } catch (error) {
    console.error('请求失败：', error);
  }
};

// 主逻辑
if (window.location.hostname.endsWith('.trfox.top')) {
  if (!isBlogSubdomain()) {
    console.log('哎呀,本js文件仅供Teror Fox的网站使用,请自己适配啦');
    return;
  }
  }
  
  if (isHomePage()) {
    // 改用 DOMContentLoaded 确保元素存在
    document.addEventListener('DOMContentLoaded', () => {
      replaceHitokoto();
    });
  }
