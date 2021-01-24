# ymaps-vue-components (vue 3)

## Introduction

ymaps-vue-components is a library for vue.js version 3. The library consists of components. You can use them to connect and work with the yandex map api.

The library is currently under active development. Components for working with the placemark, polygon, and object manager are already available.

## Install

```bash
npm install ymaps-vue-components
```

## Base usage

```javascript
<template>
  <div class="map-box">
    <yandex-maps>
      <yandex-map v-model:center="mapCenter">
        <yandex-placemark v-model:coord="placemark" />
      </yandex-map>
    </yandex-maps>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const mapCenter = ref([58.01045, 56.229434]);
    const placemark = ref([58.01045, 56.229434]);

    return {
      mapCenter,
      placemark
    }
  }
};
</script>

<style>
.map-box {
  height: 400px;
}
</style>
```
