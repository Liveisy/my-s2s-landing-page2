// 这是Cloudflare Pages Functions的标准格式
export async function onRequest(context) {
  // 从请求中获取数据。对于POST请求，我们需要这样解析。
  const { request } = context;

  // 只处理POST请求
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const body = await request.json();
    const clickId = body.taboola_click_id;

    if (!clickId) {
      return new Response('Missing click_id', { status: 400 });
    }

    // --- 核心逻辑开始 (和之前完全一样) ---
    const eventName = 'cf_s2s_purchase_click'; // 您在Taboola后台定义的事件名
    const accountId = '1879135';            // 您的Taboola账户ID

    const taboolaUrl = `https://trc.taboola.com/actions-handler/log/3/s2s-action?click-id=${clickId}&name=${eventName}&account-id=${accountId}`;

    // 直接使用内置的fetch，无需安装任何依赖
    await fetch(taboolaUrl);
    // --- 核心逻辑结束 ---

    // 准备一个成功的响应，并添加CORS头，允许跨域访问
    const successResponse = new Response(JSON.stringify({ message: 'S2S event processed' }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' // 允许任何来源访问
      },
    });

    return successResponse;

  } catch (error) {
    console.error('Cloudflare Function error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}