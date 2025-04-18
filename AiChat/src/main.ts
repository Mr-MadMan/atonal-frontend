import { createApp } from 'vue';
import App from './App.vue';
import './styles/global.scss';
import { createPinia } from 'pinia';

const app = createApp(App);

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err);
  // 这里可以添加错误上报逻辑
};

app.use(createPinia()).mount('#app');
