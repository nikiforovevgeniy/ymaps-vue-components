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
  emits: ['update:coord', 'update:options', 'dragend', 'click', 'optionschange'],
  setup(props, { emit }) {
    const getYmaps = inject('getYmaps');
    const ymaps = getYmaps();

    const getMap = inject('getMap');
    const map = getMap();

    const events = {
      click(event) {
        emit('click', event);
      },
      dragend(event) {
        const coord = event.get('target').geometry.getCoordinates();
        emit('update:coord', coord);
        emit('dragend', event);
      },
      optionschange(event) {
        const options = event.get('target').options.getAll();
        emit('update:options', options);
        emit('optionschange', event);
      },
      propertieschange(event) {
        const options = event.get('target').properties.getAll();
        emit('update:properties', options);
        emit('propertieschange', event);
      }
    };

    const placemark = new ymaps.Placemark(props.coord, props.properties, props.options);
    Object.keys(events).forEach(event => {
      placemark.events.add(event, events[event]);
    });
    map.geoObjects.add(placemark);

    watch(
      () => props.coord,
      value => {
        placemark.geometry.setCoordinates(value);
      }
    );

    watch(
      () => ({ ...props.options }),
      value => {
        placemark.options.set(value);
      }
    );

    watch(
      () => ({ ...props.properties }),
      value => {
        placemark.properties.set(value);
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
      Object.keys(events).forEach(event => {
        placemark.events.remove(event, events[event]);
      });
      map.geoObjects.remove(placemark);
    });

    return () => null;
  }
};
