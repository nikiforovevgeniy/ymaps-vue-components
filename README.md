# ymaps-vue-components (vue 3)

## Introduction

ymaps-vue-components is a library for vue.js version 3. The library consists of components. You can use them to connect and work with the yandex map api.

The library is currently under active development. Components for working with the placemark, polygon, and object manager are already available.

## Install

run command

```bash
npm install ymaps-vue-components
```

add lines "import plugin" and "using a plugin" in your src/main.js file

```javascript
// src/main.js

import { createApp } from 'vue';
import App from './App.vue';
import ymapsVueComponents from 'ymaps-vue-components'; // import plugin

const app = createApp(App);

app.use(ymapsVueComponents); // using a plugin
app.mount('#app');
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

## Examples

Base usage: https://codesandbox.io/s/ymap-vue-components-base-usage-uzqdw
