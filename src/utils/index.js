import axios from 'axios';

export async function crawlPage(url) {
  try {
    return await axios.get(url, {
      responseType: 'arraybuffer',//不对抓取的数据进行编码解析
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
        'Connection': 'keep-alive',
        'Referer': 'https://www.baidu.com',
      },
    });
  } catch (err) {
    return { err: 'fetch err', data: 'null' };
  }
}


export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
