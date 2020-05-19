<template>
  <div>
    <a-carousel arrows autoplay>
      <div
        slot="prevArrow"
        slot-scope="props"
        class="custom-slick-arrow"
        style="left: 10px;zIndex: 1"
      >
        <a-icon type="left-circle"/>
      </div>
      <div slot="nextArrow" slot-scope="props" class="custom-slick-arrow" style="right: 10px">
        <a-icon type="right-circle"/>
      </div>
      <div><h3>1</h3></div>
      <div><h3>2</h3></div>
      <div><h3>3</h3></div>
      <div><h3>4</h3></div>
    </a-carousel>
    <br>
    <a-alert
      message="ip地址"
      :description="ipInfo"
      type="info"
    />
  </div>

</template>

<script>
  import IpService from "@/api/IpService";

  export default {
    name: "home",
    data() {
      return {
        ipInfo: ''
      };
    },
    mounted() {
      IpService.GetApi.json().then((res) => {
        let code = '';
        for (let resKey in res) {
          if (!res.hasOwnProperty(resKey)) continue;
          code += '---' + res[resKey] + '';
        }
        this.ipInfo = JSON.stringify(code, null, 2);
      })
    },
    methods: {}
  }
</script>

<style scoped>
  .ant-carousel >>> .slick-slide {
    text-align: center;
    height: 160px;
    line-height: 160px;
    background: #364d79;
    overflow: hidden;
  }

  .ant-carousel >>> .custom-slick-arrow {
    width: 25px;
    height: 25px;
    font-size: 25px;
    color: #fff;
    background-color: rgba(31, 45, 61, 0.11);
    opacity: 0.3;
  }

  .ant-carousel >>> .custom-slick-arrow:before {
    display: none;
  }

  .ant-carousel >>> .custom-slick-arrow:hover {
    opacity: 0.5;
  }

  .ant-carousel >>> .slick-slide h3 {
    color: #fff;
  }
</style>
