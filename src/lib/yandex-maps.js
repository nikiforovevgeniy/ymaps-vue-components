import { load } from './loader';
import { h, ref, provide, onMounted } from 'vue';

export default {
  setup(_, { slots }) {
    let ymaps = null;
    provide('getYmaps', () => ymaps);

    const isInit = ref(false);
    const loading = ref(false);

    onMounted(async () => {
      loading.value = true;
      ymaps = await load();
      loading.value = false;
      isInit.value = true;
    });

    return () => {
      const slot = () => {
        if (isInit.value) {
          return h(slots.default);
        }
      };
      return h(
        'div',
        {
          class: {
            loading: loading.value
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
