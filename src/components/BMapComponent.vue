<template>
  <baidu-map class="map" :center="{lng: 116.404, lat: 39.915}" :zoom="15">
  </baidu-map>
</template>
<script>
import {BaiduMap} from 'vue-baidu-map'
export default {
  components: {
    BaiduMap
  }
}
</script>
