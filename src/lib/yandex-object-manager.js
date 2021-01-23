import { inject, computed, watch, onBeforeUnmount } from 'vue';

export default {
  props: {
    items: {
      type: Array,
      default() {
        return [];
      }
    },
    filter: {
      type: Function,
      default: function() {
        return true;
      }
    },
    visible: {
      type: Boolean,
      default: true
    },
    fitToViewport: {
      type: Object,
      default() {
        return {};
      }
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  setup(props, { emit }) {
    const getYmaps = inject('getYmaps');
    const ymaps = getYmaps();

    const getMap = inject('getMap');
    const map = getMap();

    const fitToViewport = computed(() => {
      return Object.keys(props.fitToViewport).length;
    });

    const setBoundsToViewport = () => {
      const bounds = objectManager.getBounds();
      if (bounds) map.setBounds(bounds, props.fitToViewport);
    };

    const objectManager = new ymaps.ObjectManager(props.options);
    objectManager.add({
      type: 'FeatureCollection',
      features: props.items
    });
    objectManager.setFilter(object => {
      return props.filter(object);
    });

    if (props.visible) map.geoObjects.add(objectManager);

    if (fitToViewport.value) setBoundsToViewport();

    const onClick = event => {
      emit('click', event);
    };
    objectManager.objects.events.add('click', onClick);

    watch(
      () => props.items,
      value => {
        objectManager.removeAll();
        objectManager.add({
          type: 'FeatureCollection',
          features: value
        });
        if (fitToViewport.value) {
          setBoundsToViewport();
        }
      }
    );

    watch(
      () => props.visible,
      value => {
        if (value && map.geoObjects.indexOf(objectManager) === -1) {
          map.geoObjects.add(objectManager);
        } else {
          map.geoObjects.remove(objectManager);
        }
      }
    );

    onBeforeUnmount(() => {
      objectManager.removeAll();
      objectManager.objects.events.remove('click', onClick);
      map.geoObjects.remove(objectManager);
    });

    return () => null;
  }
};
