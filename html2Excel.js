let XLSX = require('xlsx');

let downloadExl = (json, downName, type,input,cb)=>{
  let keyMap = []; // 获取键
  for (let k in json[0]) {
    keyMap.push(k)
  }
  console.info( keyMap, json);
  let tmpdata = []; // 用来保存转换好的json
  json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
    v: v[k],
    position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
  }))).reduce((prev, next) => prev.concat(next)).forEach(function (v) {
    tmpdata[v.position] = {
      v: v.v
    }
  });
  let outputPos = Object.keys(tmpdata); // 设置区域,比如表格从A1到D10

  let title = getTime().year;

  let Sheets = {};
  Sheets[title] = Object.assign({},
    tmpdata, // 内容
    {
      '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] // 设置填充区域
    });
  let tmpWB = {
    SheetNames: [title], // 保存的表标题
    Sheets: {
      ...Sheets
    }
  };
  let tmpDown = new Blob([s2ab(XLSX.write(tmpWB, {
      bookType: (type === undefined ? 'xlsx' : type),
      bookSST: false,
      type: 'binary'
    } // 这里的数据是用来定义导出的格式类型
  ))], {
    type: ''
  }); // 创建二进制对象写入转换好的字节流
  let href = URL.createObjectURL(tmpDown); // 创建对象超链接
  console.log(href);
  input.download = downName + '.xlsx'; // 下载名称
  input.href = href;   // 绑定a标签
  input.click(); // 模拟点击实现下载
  let self = this;
  setTimeout(function () { // 延时释放
    URL.revokeObjectURL(tmpDown); // 用URL.revokeObjectURL()来释放这个object URL
    cb&&cb()
  }, 100)
};

let getCharCol = (n)=>{
  let s = '';
  let m = 0;
  while (n > 0) {
    m = n % 26 + 1;
    s = String.fromCharCode(m + 64) + s;
    n = (n - m) / 26
  }
  return s
};
let s2ab = (s)=>{ // 字符串转字符流
  let buf = new ArrayBuffer(s.length);
  let view = new Uint8Array(buf);
  for (let i = 0; i !== s.length; ++i) {
    view[i] = s.charCodeAt(i) & 0xFF
  }
  return buf
};

let getTime = ()=>{
  let date = new Date(),
    year = date.getFullYear(),
    month = date.getMonth() + 1,
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    s = date.getSeconds();
  month = month > 9 ? month : '0' + month;
  day = day > 9 ? day : '0' + day;
  hour = hour > 9 ? hour : '0' + hour;
  min = min > 9 ? min : '0' + min;
  s = s > 9 ? s : '0' + s;
  return {
    all: year + '-' + month + '-' + day + ' ' + hour + '_' + min + '_' + s,
    year: year + '-' + month + '-' + day
  }
};


export default function html2Excel(config) {
  let data = [{}];
  for (let k in config.lists[0]) {
    data[0][k] = k
  }
  data = data.concat(config.lists);
  downloadExl(data, config.title+'-' + getTime().all,'xlsx',config.input,config.cb)
}

