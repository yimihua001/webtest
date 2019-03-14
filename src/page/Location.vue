<template>
  <div>
    <location-header :text="text"></location-header>
    <baidu-map class="locationMap"  :center="{lng: lng, lat: lat}" :zoom="15" :scroll-wheel-zoom="true">
        <bm-marker :position="{lng: lng, lat: lat}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
        </bm-marker>
    </baidu-map>
  </div>
</template>

<script>
import {BaiduMap,BmMarker} from 'vue-baidu-map'
import LocationHeader from '../components/LocationHeader'
export default {
  data () {
    return {
      text:'地理位置',
      lng:this.$route.query.lng,
      lat:this.$route.query.lat
    }
  },
  components:{
    BaiduMap,
    BmMarker,
    LocationHeader
  },
  mounted (){
      var h = $('.header').height();
      $('.locationMap').css({
						'height':$(window).height()-h,
						'margin-top':h
			})
  },
}
</script>