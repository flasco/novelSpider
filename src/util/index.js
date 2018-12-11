const fs = require('fs');
const path = require('path');
const axios = require('axios');

function appendContent(file, content) {
  fs.appendFile(file, content, function (err) {
    if (err) throw err;
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function crawlPage(url) {
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

const checkDirExist = (folderpath) => {
  const pathArr=folderpath.split('/');
  let _path='';
  for(let i=0;i<pathArr.length;i++){
    if(pathArr[i]){
      _path +=`/${pathArr[i]}`;
      if (!fs.existsSync(_path)) {
        fs.mkdirSync(_path);
      }
    }
  }
}

const isDocker = !!process.env.IS_DOCKER;

const checkDir = () => {
  if (isDocker) {
    checkDirExist('/data/xs');
    checkDirExist('/data/biqu');
  } else {
    checkDirExist(path.resolve(__dirname, '../../fetched/xs'));
    checkDirExist(path.resolve(__dirname, '../../fetched/biqu'));
  }
}

exports.sleep = sleep;
exports.crawlPage = crawlPage;
exports.isDocker = isDocker;
exports.appendContent = appendContent;
exports.checkDir = checkDir;