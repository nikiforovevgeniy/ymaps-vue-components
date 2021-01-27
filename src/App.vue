<template>
  <div class="map-box">
    <yandex-maps>
      <yandex-map v-model:center="mapCenter" v-model:zoom="mapZoom" :options="mapOptions">
        <yandex-placemark v-model:coord="placemarkCoord" :options="placemarkOptions" />
        <yandex-polygon v-model:coord="polygonCoord" :options="{ draggable: true }" edit />
      </yandex-map>
    </yandex-maps>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  setup() {
    const mapCenter = ref([58.01045, 56.229434]);
    const mapZoom = ref(10);
    const mapOptions = reactive({
      suppressMapOpenBlock: true
    });

    const placemarkCoord = ref([58.01045, 56.229434]);
    const placemarkOptions = reactive({
      draggable: true,
      preset: 'islands#blueCircleDotIcon'
    });

    const polygonCoord = ref([
      [
        [58.00571185464624, 56.26445292089842],
        [58.01792041153826, 56.3059949741211],
        [58.00079080650377, 56.319384561523435],
        [57.99204059972061, 56.27852915380859],
        [58.00571185464624, 56.26445292089842]
      ]
    ]);

    return {
      mapCenter,
      mapZoom,
      mapOptions,
      placemarkCoord,
      placemarkOptions,
      polygonCoord
    };
  }
};
</script>

<style>
html,
body,
#app {
  min-height: 100%;
  margin: 0;
}

.map-box {
  height: 400px;
}
</style>
