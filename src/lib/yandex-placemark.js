import { inject, watch, onBeforeUnmount } from 'vue';

export default {
  props: {
    coord: {
      type: Array,
      required: true
    },
    openBalloon: {
      type: Boolean,
      default: false
    },
    properties: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  setup(props) {
    const getYmaps = inject('getYmaps');
    const ymaps = getYmaps();

    const getMap = inject('getMap');
    const map = getMap();

    const placemark = new ymaps.Placemark(props.coord, props.properties, props.options);
    map.geoObjects.add(placemark);

    watch(
      () => props.coord,
      value => {
        placemark.geometry.setCoordinates(value);
      }
    );

    watch(
      () => props.openBalloon,
      value => {
        if (value) {
          placemark.balloon.open();
        } else {
          placemark.balloon.close();
        }
      },
      {
        immediate: true
      }
    );

    onBeforeUnmount(() => {
      map.geoObjects.remove(placemark);
    });

    return () => null;
  }
};
