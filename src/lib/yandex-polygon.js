import { inject, watch, onBeforeUnmount } from 'vue';

export default {
  props: {
    coord: {
      type: Array,
      required: true
    },
    properties: {
      type: Object,
      default: () => {}
    },
    options: {
      type: Object,
      default: () => {}
    },
    edit: {
      type: Boolean,
      default: false
    },
    draw: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    'update:coord',
    'update:options',
    'update:properties',
    'dragend',
    'optionschange',
    'propertieschange',
    'vertexadd',
    'vertexdragend'
  ],
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
      },
      editor_vertexadd(event) {
        const coord = event.get('target').geometry.getCoordinates();
        emit('update:coord', coord);
        emit('vertexadd', event);
      },
      editor_vertexdragend(event) {
        const coord = event.get('target').geometry.getCoordinates();
        emit('update:coord', coord);
        emit('vertexdragend', event);
      }
    };

    const polygon = new ymaps.Polygon(props.coord, props.properties, props.options);
    Object.keys(events).forEach(event => {
      if (/^editor_/.test(event)) {
        const eventName = event.replace(/^editor_/, '');
        polygon.editor.events.add(eventName, events[event]);
      } else {
        polygon.events.add(event, events[event]);
      }
    });
    map.geoObjects.add(polygon);

    watch(
      () => props.coord,
      value => {
        polygon.geometry.setCoordinates(value);
      }
    );

    watch(
      () => ({ ...props.options }),
      value => {
        polygon.options.set(value);
      }
    );

    watch(
      () => ({ ...props.properties }),
      value => {
        polygon.properties.set(value);
      }
    );

    watch(
      () => props.edit,
      value => {
        if (value) {
          polygon.editor.startEditing();
        } else {
          polygon.editor.stopEditing();
        }
      },
      {
        immediate: true
      }
    );

    watch(
      () => props.draw,
      value => {
        if (value) {
          polygon.editor.startDrawing();
        } else {
          polygon.editor.stopDrawing();
        }
      },
      {
        immediate: true
      }
    );

    onBeforeUnmount(() => {
      Object.keys(events).forEach(event => {
        if (/^editor_/.test(event)) {
          const eventName = event.replace(/^editor_/, '');
          polygon.editor.events.remove(eventName, events[event]);
        } else {
          polygon.events.remove(event, events[event]);
        }
      });
      map.geoObjects.remove(polygon);
    });

    return () => null;
  }
};
