// function transformDate(nows, type) {
//     let now = new Date(nows);
//     var year = now.getFullYear();
//     var month = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
//     var date = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
//     var hour = now.getHours() < 10 ? '0' + now.getHours() : now.getHours();
//     var minute = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes();
//     var second = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds();
//     switch (type) {
//       case 'year': {
//         return year
//       }
//       break;
//     case 'month': {
//       return year + "-" + month
//     }
//     break;
//     case 'day': {
//       return year + "-" + month + "-" + date
//     }
//     break;
//     case 'hour': {
//       return year + "-" + month + '-' + date + ' ' + hour
//     }
//     break;
//     case 'minute': {
//       return year + "-" + month + '-' + date + ' ' + hour + ':' + minute
//     }
//     break;
//     case 'second': {
//       return year + "-" + month + '-' + date + ' ' + hour + ':' + minute + ':' + second
//     }
//     }
//   }

// function   fnTime(time) {
//     let ptime = new Date(time).getTime();
//     const todayTime = new Date().getTime();
//     let t1 = Math.floor((todayTime - ptime)/1000)
//     if(t1<60){
//       return `${t1}秒`
//     }
//     let t2  = Math.floor((todayTime - ptime)/(1000*60))
//     if(t2<60){
//       return `${t2}分钟`
//     }
//     let t3  = Math.floor((todayTime - ptime)/(1000*60*60))
//     if(t3<24){
//       return `${t3}小时`
//     }
//     let sumDate = Math.floor((todayTime - ptime)/(1000*60*60*24))
//     if(sumDate == '-0'){
//         return `${sumDate}天`
//     }
//     return `${sumDate}天`
//   }

// function countDown(time) {
//   var nowTime = +new Date(time) + 2*24*60*60*1000; // 返回的是当前时间总的毫秒数
//   console.log('',nowTime)
//   var inputTime = +new Date(); // 返回的是用户输入时间总的毫秒数
//   console.log(inputTime)

//   var times = ( nowTime -inputTime) / 1000; // times是剩余时间总的秒数 
//   console.log(times)
//   if(times > 0){
//     var d = parseInt(times / 60 / 60 / 24); // 天
//     d = d < 10 ? '0' + d : d;
//     var h = parseInt(times / 60 / 60 % 24); //时
//     h = h < 10 ? '0' + h : h;
//     var m = parseInt(times / 60 % 60); // 分
//     m = m < 10 ? '0' + m : m;
//     // var s = parseInt(times % 60); // 当前的秒
//     // s = s < 10 ? '0' + s : s;
//     return d + '天' + h + '时' + m + '分';
//   }else{
//     return '已过时'
//   }
 
// }

// function countDown(time) {
//   var nowTime = +new Date(time) + 7*24*60*60*1000; // 返回的是当前时间总的毫秒数
//   var inputTime = +new Date(); // 返回的是用户输入时间总的毫秒数
//   var times = ( nowTime -inputTime) / 1000; // times是剩余时间总的秒数 
//   if(times > 0){
//     var d = parseInt(times / 60 / 60 / 24); // 天
//     d = d < 10 ? '0' + d : d;
//     var h = parseInt(times / 60 / 60 % 24); //时
//     h = h < 10 ? '0' + h : h;
//     var m = parseInt(times / 60 % 60); // 分
//     m = m < 10 ? '0' + m : m;
//     var s = parseInt(times % 60); // 当前的秒
//     s = s < 10 ? '0' + s : s;
//     return (+d*24 + +h) + ':' + m + ':'+ s;
//   }else{
//     return '已过时'
//   }
 
// }
//   let time = transformDate(1607686261000,'day');
//   // let show = fnTime(time)
//   console.log(time);
  

// let arr1=[1,2,3]
// let arr2 = [1,2,4,6,6,7]

// let flag =  arr2.filter(item =>{
//   if(arr1.indexOf(item) == '-1'){
//     return true;
//   }else{
//     return false
//   }
// })

// console.log(flag)

// if(this.isEdit){
//   let arr = this.$refs.uUploadMultiple.lists;
//   let arr2 = this.fileList;
//   let arr3=[];
//   let arr4 =[];
//   arr.forEach(item =>{
//     arr3.push(item.url)
//   })
//   arr2.forEach(item =>{
//     arr4.push(item.url)
//   })
//   let arr1 = this.filterData(arr4,arr3)
  
//   // console.log('list',this.$refs.uUploadMultiple.lists)
//   // console.log('listop',this.fileList)
//   // this.multipleUpload(this.$refs.uUploadMultiple.lists, 2)
//   //this.educationForm.projectLevel = this.projectLevel
//   console.log('arr1',arr1)
//   if(arr1.length>0){
//     this.uploadImgs(0, arr1.length, 0, arr1)
//   }
// }

// 	//过滤已经上传了的图片
//   filterData(arr1,arr2){//arr1为新的列表，arr2为本身已经上传了的列表
//     let newArr =  arr2.filter(item =>{
//       if(arr1.indexOf(item) == '-1'){
//         return true;
//       }else{
//         return false
//       }
//     })
//     return newArr
//   },let 

function clone(obj){
  if(obj instanceof Array){
    return arrClone(obj)
  }else if(obj instanceof Object){
    return objClone(obj)
  }else{
    return obj
  }
}

function arrClone(obj){
  let result = [];
  for (let i = 0; i < obj.length; i++) {
    result[i] = clone(obj[i]);
    
  }
  return result;
}

function objClone(obj){
  let result = {};
  for(let prop in obj){
    result[prop] = clone(obj[prop])
  }               
  return result;
}
let b={x:1,y:[1,2,3],z:undefined,p:function test(){}}
let a = clone(b)
console.log(a,b,a==b)
b=[1,2,3];
console.log(a,b,a==b)


// let a={x:1,y:{q:1,w:2},z:undefined};
// let b = JSON.parse(JSON.stringify(a));
// b.y.q=4
// console.log(a,b,a==b)