import { setOptions } from './loader';
import yandexMaps from './yandex-maps.js';
import yandexMap from './yandex-map.js';
import yandexPlacemark from './yandex-placemark.js';
import yandexPolygon from './yandex-polygon.js';
import yandexObjectManager from './yandex-object-manager.js';

export default {
  install: (app, options = {}) => {
    setOptions(options);

    app.component('yandex-maps', yandexMaps);
    app.component('yandex-map', yandexMap);
    app.component('yandex-placemark', yandexPlacemark);
    app.component('yandex-polygon', yandexPolygon);
    app.component('yandex-object-manager', yandexObjectManager);
  }
};
