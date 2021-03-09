import { load } from './loader';
import { getPresets } from './index';
import { h, ref, provide, onMounted } from 'vue';

export default {
  props: {
    loadingClass: {
      type: String,
      default: ''
    }
  },
  emits: ['load', 'error'],
  setup(props, { emit, slots }) {
    let ymaps = null;
    provide('getYmaps', () => ymaps);

    const isInit = ref(false);
    const loading = ref(false);

    onMounted(async () => {
      try {
        loading.value = true;
        ymaps = await load();
        const presets = getPresets();
        presets.forEach((presetFn, storageKey) => {
          const preset = presetFn(ymaps);
          ymaps.option.presetStorage.add(storageKey, preset);
        });
        isInit.value = true;
        emit('load', ymaps);
      } catch (error) {
        emit('error', error);
      } finally {
        loading.value = false;
      }
    });

    return () => {
      const slot = () => {
        if (isInit.value) {
          return slots.default();
        }
      };
      return h(
        'div',
        {
          class: {
            [props.loadingClass]: loading.value
          },
          style: {
            height: '100%',
            width: '100%'
          }
        },
        slot()
      );
    };
  }
};
