使用方式



```JavaScript
npm i xlsx
```



```html
        <button  @click="downloadFile" >导出EXCEL</button>
         <a ref="downloadBtn"></a>
```

```JavaScript

import html2Excel from 'html2Excel';




export default{
    data:{
        list:[],
        outFile:null,
    },
    methods:{
                  getMsg(item){
                    let _item= item;
                    let info = {
                      '标题1':_item.text1,
                      '标题2':this.text2,
                      '标题3':_item.text3 ,
                    };
                    return info;
                  },
                  // 导出到excel
                  downloadFile: function() { // 点击导出按钮

         
                    let list = [];
                    this.list.forEach(item => {
                      list.push(this.getMsg(item));
                    });
                    let self = this;
                    html2Excel({
                      lists: list, // 需要转为excel的数据(需要自己提前处理成合适的格式)
                      title: '导出EXCEL', // excel的名称 格式为:XXXX-2018-02-12 16_56_22
                      input: this.outFile, // 触发下载的按钮,必须是a标签
                      cb() { // 触发下载后的回调

                      }
                    })
                  },
        },
        mounted(){
            this.outFile = this.$refs.downloadBtn;
        }

}
```