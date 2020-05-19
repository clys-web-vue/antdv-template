<template>
  <div>
    <div>
      <a-button type="link" size="small" @click="back">
        <a-icon type="left"/>
        返回
      </a-button>
      <span>水槽</span>
    </div>
    <a-divider style="margin: 15px 0"/>
    <svg class="icon" style="width: 10em; height: 10em;vertical-align: middle;fill: currentColor;overflow: hidden;" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3810"><path d="M984 427.2s-97.6 44.8-427.2 51.2c-323.2 4.8-518.4-54.4-518.4-54.4 8 30.4 24 100.8 30.4 110.4 360 76.8 851.2 19.2 902.4-14.4 4.8-24 11.2-73.6 12.8-92.8z" fill="#FFD2B0" p-id="3811"></path><path d="M1000 398.4c0-86.4-468.8-88-488-88s-488 1.6-488 88v3.2c0 184 112 384 291.2 384h412.8c179.2 0 273.6-193.6 273.6-384V400c-1.6 0-1.6 0-1.6-1.6zM956.8 512c-16 22.4-164.8 57.6-440 57.6-329.6 0-436.8-36.8-448-56-6.4-25.6-11.2-51.2-12.8-78.4 107.2 51.2 438.4 52.8 456 52.8 16 0 348.8 0 456-52.8-1.6 25.6-4.8 51.2-11.2 76.8zM512 342.4c267.2 0 436.8 32 456 56-19.2 24-187.2 56-456 56s-436.8-32-456-56c19.2-22.4 188.8-56 456-56z m214.4 411.2H315.2c-110.4 0-192-88-232-196.8 91.2 36.8 300.8 43.2 435.2 43.2 158.4 0 347.2-12.8 428.8-46.4-35.2 113.6-108.8 200-220.8 200z" fill="#4C4C4C" p-id="3812"></path></svg>
  </div>
</template>

<script>


  export default {
    name: "sc",
    data() {
      return {
      }
    },
    methods:{
      back(){
        this.$router.back();
      }
    }
  }
</script>

<style scoped>

</style>
