import { h, ref, provide, inject, onMounted, watch, onBeforeUnmount } from 'vue';

export default {
  props: {
    center: {
      type: Array
    },
    zoom: {
      type: Number,
      default: 10
    },
    bounds: {
      type: Array
    },
    controls: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  emits: ['click', 'optionschange', 'update:center', 'update:zoom', 'update:bounds', 'update:options'],
  setup(props, { emit, slots }) {
    const mapId = `map-${Math.random()}`;

    const getYmaps = inject('getYmaps');
    const ymaps = getYmaps();

    const events = {
      boundschange(event) {
        const oldCenter = event.get('oldCenter');
        const newCenter = event.get('newCenter');
        const oldZoom = event.get('oldZoom');
        const newZoom = event.get('newZoom');
        const newBounds = event.get('newBounds');

        if (!ymaps.util.math.areEqual(oldCenter, newCenter)) {
          emit('update:center', newCenter);
        }

        if (oldZoom !== newZoom) {
          emit('update:zoom', newZoom);
        }

        emit('update:bounds', newBounds);
      },
      click(event) {
        emit('click', event);
      },
      optionschange(event) {
        const options = event.get('target').options.getAll();
        emit('update:options', options);
        emit('optionschange', event);
      }
    };

    const isInit = ref(false);

    let map = null;
    provide('getMap', () => map);

    onMounted(() => {
      map = new ymaps.Map(
        mapId,
        {
          bounds: props.bounds,
          center: props.center,
          zoom: props.zoom,
          controls: props.controls
        },
        { ...props.options }
      );
      Object.keys(events).forEach(event => {
        map.events.add(event, events[event]);
      });
      isInit.value = true;
    });

    watch(
      () => props.center,
      newCenter => {
        map.setCenter(newCenter);
      }
    );

    watch(
      () => props.zoom,
      newZoom => {
        map.setZoom(newZoom);
      }
    );

    watch(
      () => ({ ...props.options }),
      value => {
        map.options.set(value);
      }
    );

    onBeforeUnmount(() => {
      Object.keys(events).forEach(event => {
        map.events.remove(event, events[event]);
      });
      map.destroy();
    });

    return () => {
      const slot = () => {
        if (isInit.value && slots.default) {
          return h(slots.default);
        }
      };
      return h(
        'div',
        {
          id: mapId,
          style: {
            height: '100%',
            width: '100%',
            position: 'relative'
          }
        },
        slot()
      );
    };
  }
};
