<template>
  <div class="esign-component">
    <div class="esign-component-container">
      <span class="close-btn" @click="closeClick()">
        <i class="el-icon-close"></i>
      </span>
      <!-- 签名画板 -->
      <div class="esign-component-content scrollbar-overflow">
        <p class="esign-component-content-title">请使用鼠标在下面白框中签名</p>
        <div class="canvasBox" ref="canvasHW" id="canvasHW">
          <canvas
            ref="canvasF"
            @touchstart="touchStart"
            @touchmove="touchMove"
            @touchend="touchEnd"
            @mousedown="mouseDown"
            @mousemove="mouseMove"
            @mouseup="mouseUp"
            @mouseleave="mouseleave"
          ></canvas>
        </div>
        <p class="canvasBox-btns">
          <span class="mi-btn" @click="overwrite()">重写</span>
          <span class="im-btn" @click="commit()">提交</span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "EsignComponent",
  data() {
    return {
      stageInfo: "",
      imgUrl: "",
      client: {},
      points: [],
      canvasTxt: null,
      startX: 0,
      startY: 0,
      moveY: 0,
      moveX: 0,
      endY: 0,
      endX: 0,
      w: null,
      h: null,
      isDown: false,
      shuiyinwenjian: "",
    };
  },
  created() {},
  mounted() {
    let canvas = this.$refs.canvasF;
    let canvasHW = document.getElementById("canvasHW");
    canvas.width = canvasHW.offsetWidth;
    canvas.height = canvasHW.offsetHeight;
    this.canvasTxt = canvas.getContext("2d");
    this.canvasTxt.fillStyle = "transparent"; //背景色
    this.canvasTxt.lineWidth = 4; //线条粗细
    this.canvasTxt.strokeStyle = "black"; //黑色
    this.stageInfo = canvas.getBoundingClientRect();
  },
  methods: {
    //   关闭
    closeClick() {
      this.$emit("close", "");
    },
    //   移动
    touchStart(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clienX,
          y: ev.targetTouches[0].clientY,
        };
        this.startX = obj.x;
        this.startY = obj.y;
        this.canvasTxt.beginPath();
        this.canvasTxt.moveTo(this.startX, this.startY);
        this.canvasTxt.lineTo(obj.x, obj.y);
        this.canvasTxt.stroke();
        this.canvasTxt.closePath();
        this.points.push(obj);
      }
    },
    touchMove(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clientX - this.stageInfo.left,
          y: ev.targetTouches[0].clientY - this.stageInfo.top,
        };
        this.moveY = obj.y;
        this.moveX = obj.x;
        this.canvasTxt.beginPath();
        this.canvasTxt.moveTo(this.startX, this.startY);
        this.canvasTxt.lineTo(obj.x, obj.y);
        this.canvasTxt.stroke();
        this.canvasTxt.closePath();
        this.startY = obj.y;
        this.startX = obj.x;
        this.points.push(obj);
      }
    },
    touchEnd(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (ev.touches.length == 1) {
        let obj = {
          x: ev.targetTouches[0].clientX - this.stageInfo.left,
          y: ev.targetTouches[0].clientY - this.stageInfo.top,
        };
        this.canvasTxt.beginPath();
        this.canvasTxt.moveTo(this.startX, this.startY);
        this.canvasTxt.lineTo(obj.x, obj.y);
        this.canvasTxt.stroke();
        this.canvasTxt.closePath();
        this.points.push(obj);
      }
    },
    //pc
    mouseDown(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (1) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY,
        };
        this.startX = obj.x;
        this.startY = obj.y;
        this.canvasTxt.beginPath();
        this.canvasTxt.moveTo(this.startX, this.startY);
        this.canvasTxt.lineTo(obj.x, obj.y);
        this.canvasTxt.stroke();
        this.canvasTxt.closePath();
        this.points.push(obj);
        this.isDown = true;
      }
    },
    mouseMove(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (this.isDown) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY,
        };
        this.moveY = obj.y;
        this.moveX = obj.x;
        this.canvasTxt.beginPath();
        this.canvasTxt.moveTo(this.startX, this.startY);
        this.canvasTxt.lineTo(obj.x, obj.y);
        this.canvasTxt.stroke();
        this.canvasTxt.closePath();
        this.startY = obj.y;
        this.startX = obj.x;
        this.points.push(obj);
      }
    },
    mouseUp(ev) {
      ev = ev || event;
      ev.preventDefault();
      if (1) {
        let obj = {
          x: ev.offsetX,
          y: ev.offsetY,
        };
        this.canvasTxt.beginPath();
        this.canvasTxt.moveTo(this.startX, this.startY);
        this.canvasTxt.lineTo(obj.x, obj.y);
        this.canvasTxt.stroke();
        this.canvasTxt.closePath();
        this.points.push(obj);
        this.points.push({ x: -1, y: -1 });
        this.isDown = false;
      }
    },
    mouseleave(ev) {
      ev = ev || event;
      ev.preventDefault();
      this.canvasTxt.closePath(); //结束绘制
      this.isDown = false;
    },
    //重写
    overwrite() {
      this.canvasTxt.clearRect(
        0,
        0,
        this.$refs.canvasF.width,
        this.$refs.canvasF.height
      );
      this.points = [];
    },
    //提交签名
    commit() {
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
            success: (res) => {
              if (res.data.code === 7000) {
                this.$message({
                  message: res.data.message,
                  type: "success",
                });
                this.$emit("close", res.data.data.OssUrl);
                return;
              }
              this.$message({
                message: res.data.message,
                type: "warning",
              });
            },
          });
        },
      });
    },
  },
  components: {},
};
</script>
<style lang="less">
.esign-component {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9;
  .esign-component-container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 60%;
    height: 60%;
    background: white;
    border-radius: 15px;
    overflow: hidden;
    .esign-component-content {
      width: 100%;
      height: 100%;
      overflow-y: scroll;
      box-sizing: border-box;
      padding: 40px;
      .esign-component-content-title {
        text-align: center;
        color: @banner-color;
        font-weight: bolder;
        margin-bottom: 20px;
      }
      .canvasBox {
        width: 100%;
        height: 300px;
        box-sizing: border-box;
        flex: 1;
        canvas {
          border: 2px solid @border-color;
          border-radius: 10px;
        }
      }
      .canvasBox-btns {
        display: flex;
        justify-content: center;
        align-items: center;
        span {
          margin: 10px;
        }
      }
    }
  }
}
</style>