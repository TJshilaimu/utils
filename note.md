[top]
## 百度地图API获取地点
```javascript
//  方法一 
<script type="text/javascript" src="//api.map.baidu.com/api?v=2.0&ak=h4miPh0yoHmDRN162Lalxr2vkDOZ8gT0"></script>
<script type="text/javascript">
    function test() {
        var geolocation = new BMap.Geolocation();
        let addr = geolocation.getCurrentPosition(function (r) {
            console.log(r.address.city);
            let addr = r.address.city
            let dom = document.getElementById("app");
            dom.innerText = addr     
        })
    }
    test()
</script>
// 方法二，回调模式 
export default {
  init: function () {
    const AK = '9g50YSfhNddNDH32FOuaadUPVId7SPyb';
    const BMap_URL = 'https://api.map.baidu.com/api?v=2.0&ak=”+ AK +"&s=1&callback=onBMapCallback';
    return new Promise((resolve, reject) => {
      // 如果已加载直接返回
      if (typeof BMap !== 'undefined') {
        resolve(BMap);
        return true;
      }
      // 百度地图异步加载回调处理
      window.onBMapCallback = function () {
        resolve(BMap);
      };
      let getCurrentCityName = function () {
        return new Promise(function (resolve, reject) {
          let myCity = new BMap.LocalCity()
          myCity.get(function (result) {
            resolve(result.name)
          })
        })
      }
      // 插入script脚本
      let scriptNode = document.createElement('script');
      scriptNode.setAttribute('type', 'text/javascript');
      scriptNode.setAttribute('src', BMap_URL);
      document.body.appendChild(scriptNode);
    });
  }
}
    // 在组件中调用，点击时获取定位
    getCurrentCity() {
      getCurrentCityName.init().then((BMap) => {
        const geolcation = new BMap.Geolocation();
        let _this = this;
        geolcation.getCurrentPosition(
          function getinfo(position) {
            let city = position.address.city;
            _this.city = city;
          },
          function (e) {}
        );
      });
    },
```

## base64->blod->文件流
```javascript
    /**
     * base64转文件
   * @param {base64} dataurl 
   * @param {文件名} fileName 
   */
  base64ToFile(dataurl, fileName) {
    //将base64转换为文件
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], 'img.png', {
      type: mime
    });
  },
   /**
   * 
   * @param {base64 地址} dataurl 
   * @param {文件名} filename 
   * base64 转bold/file
   * 经过转换后得到的是blod格式
   */
  dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = window.atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    var blob = null;
    try {
      blob = new Blob([u8arr.buffer], {
        type: mime
      });
    } catch (e) {
      var BlobBuilder = window.BlobBuilder = (
        window.BlobBuilder ||
        window.WebKitBlobBuilder ||
        window.MozBlobBuilder ||
        window.MSBlobBuilder
      );
      if (e.name === "TypeError" && BlobBuilder) {
        var builder = new BlobBuilder();
        builder.append(buff);
        blob = builder.getBlob(fileType);
      }
    }
    return blob
    // return new File([u8arr], filename, {
    //   type: mime
    // });
  },
 /**
   * @param {bold地址} theBlob 
   * @param {文件名} fileName 
   * 因为传输给后台的通常都是文件流格式，因为base64格式太
   */
  boldToFile(theBlob, fileName) {
    let files = new window.File([theBlob], 'img.png', {
      type: theBlob.type
    })
    return files;
  },

  //测试案例
   this.imgUrl = this.$refs.canvasF.toDataURL(); //生成签名img回传后台
      this.Watermark.init({
        imgUrl: this.imgUrl,
        success: (base64Url) => {
          this.shuiyinwenjian = base64Url;
          let form = new FormData();
          form.append(
            "files",
            this.Util.boldToFile(this.Util.dataURLtoFile(base64Url))
          );
          this.Request.commonRequest.uploadFile({
            isPublic: true,
            file: form,
            success: (res) => {}
          })
        }
      })
```

## 水印
```javascript
// 水印
export default class Watermark {
  // 初始化水印画板
  init(opations) {
    let obj = {
      text: '仅用xx资料认证，他用无效', //水印文字
      imgUrl: '', //图片地址
      font: '20px 黑体', //字体样式
      fillStyle: 'rgba(0,0,0,0.1)', //字体颜色
      rotateAngle: -20 * Math.PI / 180, //旋转角度
    }
    Object.assign(obj, opations); //合并参数
    const cw = document.createElement("canvas"); //生成水印文字
    var ctx = cw.getContext("2d"); //返回一个用于在画布上绘图的环境
    ctx.clearRect(0, 0, cw.width, cw.height); //绘制之前画布清除
    ctx.font = obj.font;
    ctx.rotate(obj.rotateAngle);
    ctx.fillStyle = obj.fillStyle;
    ctx.fillText(obj.text, -20, 120);
    ctx.rotate(-obj.rotateAngle); //坐标系还原
    this.render(obj, cw); //将水印跟图片绘制到新画板中
  }
  // 生成水印
  render(obj, cw) {
    const img = new Image();
    img.src = obj.imgUrl;
    img.crossOrigin = "anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      const ctxr = canvas.getContext("2d");
      let _ix = img.width;
      let _iy = img.height;
      canvas.width = _ix;
      canvas.height = _iy;
      ctxr.clearRect(0, 0, canvas.width, canvas.height); //清除整个画布 
      ctxr.drawImage(img, 0, 0);
      var pat = ctxr.createPattern(cw, "repeat"); //在指定的方向上重复指定的元素 
      ctxr.fillStyle = pat;
      ctxr.fillRect(0, 0, canvas.width, canvas.height);
      const base64Url = canvas.toDataURL();
      obj.success && obj.success(base64Url);
    };
  }
}
```

## 本地LocalStorage操作
```javascript
  /**
   * 写入localStroge
   * @param {Object} val 
   */
  setLocalStorage(val) {
    // let val = {
    //   key:"",//键值
    //   value:"",//内容
    //   success:"",//写入成功回调
    //   fail:""//写入失败回调
    // }
    try {
      localStorage.setItem(val.key, JSON.stringify(val.value));
      val.success && val.success(val); //写入成功
    } catch (error) {
      val.fail && val.fail(val); //写入失败
    }
  },
  /**
   * 获取localStroge
   * @param {Object} val
   */
  getLocalStorage(val) {
    // let val = {
    //   key:"",//键值
    //   value:"",//内容
    //   success:"",//获取成功回调
    //   fail:""//获取失败回调
    // }
    try {
      val.value = JSON.parse(localStorage.getItem(val.key));
      val.success && val.success(val); //获取成功
    } catch (error) {
      val.fail && val.fail(val); //获取失败
    }
  },
```

## 转换时间
```javascript
    // 时间转换
  transformDate(nows, type) {
    let now = new Date(nows);
    var year = now.getFullYear();
    var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
    var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
    var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
    switch (type) {
      case 'year': {
        return year
      }
      break;
    case 'month': {
      return year + "-" + month
    }
    break;
    case 'day': {
      return year + "-" + month + "-" + date
    }
    break;
    case 'hour': {
      return year + "-" + month + '-' + date + ' ' + hour
    }
    break;
    case 'minute': {
      return year + "-" + month + '-' + date + ' ' + hour + ':' + minute
    }
    break;
    case 'second': {
      return year + "-" + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
    }
    }
  },


 /**
   * 转换时间
   * 得到过去的某个时间的显示
   * @param {Date} time 
   */
  fnTime(time) {
    let ptime = new Date(time).getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const fortyEightHours = 24 * 60 * 60 * 1000 * 2;
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const todayHour = `${hour}:${minute}:${second}`
    const today = `${year}-${month}-${day}`;
    const todayTime = new Date(today).getTime();
    const yesterdayTime = new Date(todayTime - twentyFourHours).getTime();
    const lastYesterdayTime = new Date(todayTime - fortyEightHours).getTime();

    if (ptime >= todayTime) {
      return this.transformDate(ptime, 'minute').split(' ')[1]
    } else if (ptime < todayTime && yesterdayTime <= ptime) {
      return '昨天 ' + this.transformDate(ptime, 'minute').split(' ')[1]
    } else if (ptime < yesterdayTime && lastYesterdayTime <= ptime) {
      return '前天 ' + this.transformDate(ptime, 'minute').split(' ')[1]
    } else {
      return this.transformDate(ptime, 'day');
    }
  },
```

## 隐藏滚动条
```javascript
//给某个元素添加样式类名即可

/*隐藏滚动条兼容谷歌*/
.scrollbar-overflow::-webkit-scrollbar {
  display: none; //兼容谷歌
}

/*隐藏滚动条兼容IE10+,兼容火狐*/
.scrollbar-overflow {
  scrollbar-width: none; //兼容火狐
  -ms-overflow-style: none; //兼容IE10
}
```

## 引入阿里字体图标库
```javascript
// 采用的是Symbol引入
//1.首先建立项目，在入口html文件中引入js文件
   <script src="//at.alicdn.com/t/font_2110606_zqppu0vf3lj.js"></script>
//2. 再在全局css中引入样式，即：
  .icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
//3.在元素中使用
<svg class="icon" aria-hidden="true">
  <use xlink:href="#icon-keyongyue" />
</svg>
```
## 页面滚动到底部
```javascript
    // 容器滚动到底部
    // val = {
    // id : 'xx',
    // scrollBottom:function(options){},
    // scrollTop:function(options){},
    // }
  containerScroll(val) {
    const el = document.getElementById(val.id); //获取节点
    el.onscroll = function () {
      var nScrollHight = el.scrollHeight; //滚动距离总长(注意不是滚动条的长度)
      var nScrollTop = el.scrollTop; //滚动到的当前位置
      var nDivHight = el.offsetHeight; //容器高度
      //滚动到顶部
      if (nScrollTop + nDivHight >= nScrollHight) {
        val.scrollBottom && val.scrollBottom({
          scrollHight: nScrollHight,
          scrollTop: nScrollTop,
          el: el
        });
        return
      }
      //滚动到底部
      if (nScrollTop == 0) {
        val.scrollTop && val.scrollTop({
          scrollHight: nScrollHight,
          scrollTop: nScrollTop,
          el: el
        });
        return
      }

    }
  },
```

## 通过生日算年龄
```javascript
 /**
   * 通过生日算年龄
   * @param {Date} strBirthday 
   */
  jsGetAge(strBirthday) {
    let Birthday = new Date(strBirthday);
    var returnAge;
    var birthYear = Birthday.getFullYear();
    var birthMonth = Birthday.getMonth() + 1;
    var birthDay = Birthday.getDay();

    let d = new Date();
    var nowYear = d.getFullYear();
    var nowMonth = d.getMonth() + 1;
    var nowDay = d.getDate();

    if (nowYear == birthYear) {
      returnAge = 0; //同年 则为0岁
    } else {
      var ageDiff = nowYear - birthYear; //年之差
      if (ageDiff > 0) {
        if (nowMonth == birthMonth) {
          var dayDiff = nowDay - birthDay; //日之差
          if (dayDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        } else {
          var monthDiff = nowMonth - birthMonth; //月之差
          if (monthDiff < 0) {
            returnAge = ageDiff - 1;
          } else {
            returnAge = ageDiff;
          }
        }
      } else {
        returnAge = -1; //返回-1 表示出生日期输入错误 晚于今天
      }
    }
    return returnAge; //返回周岁年龄
  }
```

## 获取明天时间
```javascript
  /**
   * 获取明天时间
   * @param {Number} AddDayCount 
   */
  getTomorrow(AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1; //获取当前月份的日期
    var d = dd.getDate();
    return y + "-" + m + "-" + d;
  },
```

## 下载文件  
```javascript
 /**
   * 下载文件 此处为了防止下载时有些文件格式出问题，所以采用ajax方式下载
   * @param {String} url 
   * @param {String} fileName 
   */
  download(url, fileName) {
    var x = new XMLHttpRequest();
    const that= this;
    url = that.transferUrl(url);
    x.open("GET", url, true);
    x.responseType = "blob";
    x.onload = function (e) {
      var url = window.URL.createObjectURL(x.response);
      var a = document.createElement("a");
      a.href = url;
      a.download = fileName ? fileName : "未命名";
      a.click();
    };
    x.send();
  },
  //处理url，将http装换成https
  transferUrl(url){
    let httpHead = url.substring(0,6); 
    let finallytUrl= url.slice(6);
    if(!(/s/.test(httpHead))){  
        httpHead =httpHead.slice(0,4)+'s'+httpHead.slice(4)  
    } 
    return httpHead + finallytUrl;
  },
```

## 添加水印
```javascript
  // 添加水印
  addShuiyin(obj) {
    const img = new Image();
    img.src = obj.url;
    img.crossOrigin = "anonymous";
    img.onload = function () {
      const canvas = document.createElement("canvas");
      let _ix = img.width;
      let _iy = img.height;
      canvas.width = _ix;
      canvas.height = _iy;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      ctx.textAlign = obj.textAlign;
      ctx.textBaseline = obj.textBaseline;
      ctx.font = obj.font;
      ctx.fillStyle = obj.fillStyle;
      ctx.translate(0, 0);
      ctx.rotate((-20 * Math.PI) / 180); //旋转角度
      //水印密度
      for (let i = 0; i < _iy / 130; i++) {
        for (let j = 0; j < _ix / 50; j++) {
          ctx.fillText(obj.content, i * 240, j * 50, _ix);
        }
      }
      const base64Url = canvas.toDataURL()
      obj.cb && obj.cb(base64Url);
    };
  }
```

## vue图片懒加载
```javascript
  //1.安装
 // cnpm install vue-lazyload --save-dev
 // 2.main.js加载
import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyload, {
  preLoad: 1, //预加载高度的比例
  error: '', //图像的src加载失败
  loading: '', //src的图像加载
  attempt: 1, //尝试计数
  listenEvents: ['scroll', 'mousewheel'] //你想要监听的事件,我个人喜欢全部监听，方便
});
//3.组件中使用
<img v-lazy="url" alt="" style="width: 768px;"> 
```
 
## element-ui引入使用
```javascript
//部分引入  main.js中进行
 import 'element-ui/lib/theme-chalk/index.css'
import {
  Input,
  Button,
  Option,
  OptionGroup,
  MenuItem,
  MenuItemGroup,
  Select,
  Form,
  FormItem,
  Upload,
  DatePicker,
  Rate,
  Message,
  Radio,
  RadioGroup,
  TimePicker,
  Checkbox,
  CheckboxGroup,
  Collapse,
  CollapseItem,
  Table,
  TableColumn,
  MessageBox,
  Dialog,
  Backtop,
  Icon,
  Tabs,
  TabPane,
  InputNumber,
  Autocomplete,
  DropdownItem,
  DropdownMenu,
  Dropdown,
  Badge,
  Notification,
  Switch,
  Progress,
  Cascader,
  Popover
} from 'element-ui'
//注意此时message得单独引入
Message.install = function (Vue, options) {
  Vue.prototype.$message = Message
}
MessageBox.install = function (Vue, options) {
  Vue.prototype.$MessageBox = MessageBox
}
Notification.install = function (Vue, options) {
  Vue.prototype.$Notification = Notification
}
// 引入后得vue进行use挂载
Vue.use(Input)
Vue.use(Button)
Vue.use(Option)
Vue.use(OptionGroup)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Select)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Upload)
Vue.use(DatePicker)
Vue.use(Rate)
Vue.use(Message)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(TimePicker)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(MessageBox)
Vue.use(Dialog)
Vue.use(Backtop)
Vue.use(Icon)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(InputNumber)
Vue.use(Autocomplete)
Vue.use(DropdownItem)
Vue.use(DropdownMenu)
Vue.use(Dropdown)
Vue.use(Badge)
Vue.use(Notification)
Vue.use(Switch)
Vue.use(Progress)
Vue.use(Cascader)
Vue.use(Popover)
```

## axios的请求用法
```javascript
//get 请求
// 为给定 ID 的 user 创建请求
axios.get('/user?ID=12345')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

// 上面的请求也可以这样做
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

  // post请求
  axios.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });

  //多个并发请求
  function getUserAccount() {
  return axios.get('/user/12345');
}

function getUserPermissions() {
  return axios.get('/user/12345/permissions');
}

axios.all([getUserAccount(), getUserPermissions()])
  .then(axios.spread(function (acct, perms) {
    // 两个请求现在都执行完成
  }));
  //axios.all([axios.get('url1'),axios.get('url2')]).then(axios.spead(res1,res2)={
 //  这里执行两个请求都完成的处理 
 // })
```

## axios请求、响应拦截
```javascript
//首先进行npm install
  import Axios from 'axios'
  import Vue from 'vue'
Axios.defaults.baseURL = 'https://www.xxx.xx'; //配置公共域名
Axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8'; //设置请求参数格式
// 请求拦截
Axios.interceptors.request.use(function(config){
  //成功阶段做的事
  //例如对参数进行统一处理
 let config = {
    ...config,
    params:{
        appkey:'xxxxx',
    }
  };
  // 还可以判断缓存中是否有token,如果存在则每次请求带上token
  if(localStorage.getItem('xxToken')){
     config.headers.Authorization = "Bearer " + JSON.parse(localStorage.getItem("FuChengToken")).token; // 设置请求头
  }
  
  return config;  //最后记得返回config
},function(error){
  //失败阶段做的事
  //例如，若此时挂载了elementui，
  Vue.prototype.$message({
    message:'系统服务器维护中',
    type:'w0000arning'
  })
})

// 响应拦截
Axios.interceptors.response.use(function (config) {
  // 下面的功能都是可选的。根据实际需求进行删减。
  endLoading() //关闭loading框
  if (config.data.message == 'The access token is invalid!!!' && config.data.code === 3000) {
    Vue.prototype.$message({
      message: '登录已过期!请重新登录',
      type: 'warning'
    })
    Util.loginOut(); //退出登录
    return
  }
  return config;
}, function (error) {
  // 捕获响应出错
  Vue.prototype.$message({
    message: '系统服务器维护中...',
    type: 'warning'
  })
  endLoading() //关闭loading框
  // 对响应错误做些什么
  return Promise.reject(error);
});
export default {
  //对axios进行处理，这样调用的时候可以统一格式调用
  install(Vue, options) {
    Vue.prototype.post = function (url, data, callBack) {
        Axios.post(url, JSON.stringify({
            ...data
          })).then(res => {
            callBack && callBack(res)
          })
          .catch(error => {

          })
      },
      Vue.prototype.get = function (url, data, callBack) {
        Axios.get(url, {
            params: {
              ...data
            }
          }, ).then(res => {
            //请求成功返回的值
            callBack && callBack(res)
          })
          .catch(error => {

          })
      },
      Vue.prototype.arrPost = function (url, data, callBack) {
        Axios.post(url, JSON.stringify(data)).then(res => {
            callBack && callBack(res)
          })
          .catch(error => {

          })
      }
  }
}
// 定义loading
let loading;
// 打开loading框
function startLoading() { //使用Element loading-start 方法。注意这里得进行import { Loading } from element-ui
  loading = Loading.service({
    lock: true,
    text: '加载中……',
    background: 'rgba(0, 0, 0, 0.5)'
  })
}
// 关闭loading框
function endLoading() {
  loading.close()
}


//在main.js中进行挂载
import service from 'axios/index.js'
vue.use(service);
//同时还可以在Vue原型上进行二次挂载，这里导入的axios依旧有拦截.
vue.prototype.$axios = axios //这里的axios为 import axios from 'axios' 导入



//例子， requset调用。工具API调用
// 获取待审核，草稿
getAuditList(obj) {
  Vue.prototype.get(Api.b_Api.audit_list, {
    status: obj.status
  }, res => {
    obj.success && obj.success(res)
  })
},
// 任务保存为草稿
tasksDraft(obj) {
  Vue.prototype.post(Api.b_Api.tasks_draft, {
    ...obj.data
  }, res => {
    obj.success && obj.success(res)
  })
},

```

