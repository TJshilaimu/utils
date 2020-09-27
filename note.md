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