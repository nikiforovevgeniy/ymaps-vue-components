import { inject, watch, onBeforeUnmount } from 'vue';

export default {
  props: {
    coord: {
      type: Array,
      required: true
    },
    fitToViewport: {
      type: Boolean,
      default: false
    },
    edit: {
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
  setup(props, { emit }) {
    const getYmaps = inject('getYmaps');
    const ymaps = getYmaps();

    const getMap = inject('getMap');
    const map = getMap();

    const setBoundsToViewport = () => {
      const bounds = polygon.geometry.getBounds();
      map.setBounds(bounds);
    };

    const polygon = new ymaps.Polygon(props.coord, props.properties, props.options);
    map.geoObjects.add(polygon);
    if (props.fitToViewport) setBoundsToViewport();

    const editorEvents = {
      vertexadd(event) {
        emit('vertexAdd', event);
      },
      vertexdragend(event) {
        emit('vertexDragEnd', event);
      }
    };

    const addEditorEvents = () => {
      Object.keys(editorEvents).forEach(event => {
        polygon.editor.events.add(event, editorEvents[event]);
      });
    };

    const removeEditorEvents = () => {
      Object.keys(editorEvents).forEach(event => {
        polygon.editor.events.add(event, editorEvents[event]);
      });
    };

    watch(
      () => props.coord,
      value => {
        polygon.geometry.setCoordinates(value);
        if (props.fitToViewport) setBoundsToViewport();
      }
    );

    watch(
      () => props.edit,
      value => {
        if (value) {
          polygon.editor.startEditing();
          polygon.editor.startDrawing();
          addEditorEvents();
        } else {
          polygon.editor.stopEditing();
          polygon.editor.stopDrawing();
          removeEditorEvents();
        }
      },
      {
        immediate: true
      }
    );

    onBeforeUnmount(() => {
      removeEditorEvents();
      map.geoObjects.remove(polygon);
    });

    return () => null;
  }
};
