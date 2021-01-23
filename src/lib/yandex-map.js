import { h, ref, provide, inject, onMounted, watch, onBeforeUnmount } from 'vue';

export default {
  props: {
    center: {
      type: Array,
      required: true
    },
    zoom: {
      type: Number,
      default: 10
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
  setup(props, { emit, slots }) {
    const mapId = `map-${Math.random()}`;

    const getYmaps = inject('getYmaps');
    const ymaps = getYmaps();

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

    const events = {
      boundschange(event) {
        const oldCenter = event.get('oldCenter');
        const newCenter = event.get('newCenter');
        const oldZoom = event.get('oldZoom');
        const newZoom = event.get('newZoom');

        if (!ymaps.util.math.areEqual(oldCenter, newCenter)) {
          emit('update:center', newCenter);
        }

        if (oldZoom !== newZoom) {
          emit('update:zoom', newZoom);
        }
      },
      click(event) {
        emit('click', event);
      }
    };

    const isInit = ref(false);

    let map = null;
    provide('getMap', () => map);

    onMounted(() => {
      map = new ymaps.Map(
        mapId,
        {
          center: props.center,
          zoom: props.zoom,
          controls: props.controls
        },
        {
          suppressMapOpenBlock: true,
          ...props.options
        }
      );
      Object.keys(events).forEach(event => {
        map.events.add(event, events[event]);
      });
      isInit.value = true;
    });

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
