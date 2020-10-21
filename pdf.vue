

<template>
<!-- 预览 这里为父组件的代码，即调用时用到 ，注意ref的methods方法调用就好
    previewContract(url) {
      this.$refs.pdf.contractPdf(url);
    }, -->

  <div class="pdf-con" v-if="pdfUrl">
    <div class="pdf-container">
      <span class="close-btn" @click="closeClick()">
        <i class="el-icon-close"></i>
      </span>
      <span class="page">{{currentPage}} / {{pageCount}}</span>
      <span @click="changePdfPage(0)" class="pre im-btn" :class="{grey: currentPage==1}">
        <i class="el-icon-arrow-left"></i>上一页
      </span>
      <pdf
        :src="pdfUrl"
        :page="currentPage"
        @num-pages="pageCount=$event"
        @page-loaded="currentPage=$event"
        @loaded="loadPdfHandler"
      ></pdf>
      <span
        @click="changePdfPage(1)"
        class="next im-btn"
        :class="{grey: currentPage==pageCount}"
      >
        下一页
        <i class="el-icon-arrow-right"></i>
      </span>
    </div>
  </div>
</template>
<script>
import pdf from "vue-pdf";
export default {
  components: {
    pdf
  },
  data() {
    return {
      // http://oss.whalefor.cn/dkg1obqm.g50.pdf
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: "pdf", // 文件类型
      pdfUrl: "" // pdf文件地址
    };
  },
  created() {
    // 有时PDF文件地址会出现跨域的情况,这里最好处理一下=
    this.clauseTitle = "合同";
  },
  methods: {
    contractPdf(url) {
      this.pdfUrl = url;
    },
    changePdfPage(val) {
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--;
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++;
      }
    },
    // pdf加载时
    loadPdfHandler(e) {
      this.currentPage = 1; // 加载的时候先加载第一页
    },
    closeClick(){
      this.pdfUrl = ''
      this.currentPage = 0 // pdf文件页码
      this.pageCount = 0 // pdf文件总页数
    }
  },
  mounted() {}
};
</script>
<style lang="less">
.pdf-con {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: @maskColor;
  z-index: 2;
  .pdf-container {
    width: 32%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .pre {
      position: absolute;
      top: 50%;
      left: -100px;
      background: white;
      color: @banner-color;
      transform: translateY(-50%);
      cursor: pointer;
      z-index: 222;
    }
    .next {
      position: absolute;
      top: 50%;
      right: -100px;
      background: white;
      color: @banner-color;
      cursor: pointer;
      transform: translateY(-50%);
      z-index: 222;
    }
    .page {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 222;
    }
  }
}
</style>