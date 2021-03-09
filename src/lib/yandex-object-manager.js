import { computed, inject, watch, onBeforeUnmount } from 'vue';

export default {
  props: {
    items: {
      type: Array,
      default() {
        return [];
      }
    },
    options: {
      type: Object,
      default() {
        return {};
      }
    },
    fitToViewport: {
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
      if (bounds) {
        map.setBounds(bounds, props.fitToViewport);
      }
    };

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
    map.geoObjects.add(objectManager);
    if (fitToViewport.value) setBoundsToViewport();
    Object.keys(events).forEach(event => {
      objectManager.objects.events.add(event, events[event]);
    });

    watch(
      () => props.items,
      value => {
        objectManager.removeAll();
        objectManager.add({
          type: 'FeatureCollection',
          features: value
        });
        if (fitToViewport.value) setBoundsToViewport();
      }
    );

    onBeforeUnmount(() => {
      objectManager.removeAll();
      Object.keys(events).forEach(event => {
        objectManager.objects.events.remove(event, events[event]);
      });
      map.geoObjects.remove(objectManager);
    });

    return () => null;
  }
};
