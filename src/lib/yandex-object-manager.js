import { inject, watch, onBeforeUnmount } from 'vue';

export default {
  props: {
    items: {
      type: Array,
      default() {
        return [];
      }
    },
    visible: {
      type: Boolean,
      default: true
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

    const events = {
      click(event) {
        emit('click', event);
      }
    };

    const objectManager = new ymaps.ObjectManager(props.options);
    objectManager.add({
      type: 'FeatureCollection',
      features: props.items
    });
    Object.keys(events).forEach(event => {
      objectManager.events.add(event, events[event]);
    });

    watch(
      () => props.items,
      value => {
        objectManager.removeAll();
        objectManager.add({
          type: 'FeatureCollection',
          features: value
        });
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
      },
      {
        immediate: true
      }
    );

    onBeforeUnmount(() => {
      objectManager.removeAll();
      Object.keys(events).forEach(event => {
        objectManager.events.remove(event, events[event]);
      });
      map.geoObjects.remove(objectManager);
    });

    return () => null;
  }
};
