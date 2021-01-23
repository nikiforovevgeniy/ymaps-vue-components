import { createApp } from 'vue';
import App from './App.vue';
import ymapsVueComponents from './lib';

const app = createApp(App);

app.use(ymapsVueComponents);
app.mount('#app');
