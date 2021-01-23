let options = {
  v: '2.1',
  lang: 'ru_RU',
  coordorder: 'latlong'
};
let loading = false;
let wait = [];

export const load = () => {
  return new Promise((resolve, reject) => {
    if (window.ymaps) return resolve(window.ymaps);
    if (!loading) {
      loading = true;
      const scriptTag = document.createElement('script');
      scriptTag.onload = () => {
        window.ymaps.ready(() => {
          loading = false;
          wait.forEach(item => {
            item.resolve(window.ymaps);
          });
          wait = [];
          resolve(window.ymaps);
        });
      };
      scriptTag.onerror = () => {
        loading = false;
        const error = new Error('Ошибка загрузки');
        wait.forEach(item => {
          item.reject(error);
        });
        wait = [];
        reject(error);
      };
      scriptTag.setAttribute(
        'src',
        `https://api-maps.yandex.ru/${options.v}?lang=${options.lang}&coordorder=${options.coordorder}`
      );
      document.body.appendChild(scriptTag);
    } else {
      wait.push({
        resolve,
        reject
      });
    }
  });
};

export const setOptions = data => {
  options = {
    ...options,
    ...data
  };
};
