import store from '@/store';
import proxy from '@/config/host';
import { api_msg_query } from '@/api/msg';
import { MessagePlugin } from 'tdesign-vue';

const env = import.meta.env.MODE || 'development';
const API_HOST = env === 'mock' ? '/' : proxy[env].API;

class WebSocketService {
  constructor() {
    this.socket = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3000; // 3秒重试间隔
    this.url = `${API_HOST}/api/msg/websocket`;
    this.client_id = '';
    this.heartInterval = null;
  }

  init() {
    this.token = store.getters['user/token'];
    this.user_id = store.getters['user/userInfo'].user_id;
    if (!this.token) {
      console.warn('当前客户端未登录,token 不存在,跳过连接!');
      return;
    }

    if (this.socket) {
      this.close();
    }

    const wsUrl = `${this.url}?token=${encodeURIComponent(this.token)}`;
    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = () => {
      console.log('WebSocket 会话连接成功');
      this.reconnectAttempts = 0;
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket 会话已被关闭', event);
      this.handleReconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket 会话出现错误:', error);
      this.handleReconnect();
    };

    this.socket.onmessage = (event) => {
      console.log('WebSocket 收到消息:', event.data);
      // 处理收到的消息
      this.handleMessage(event.data);
    };

    // 添加页面刷新监听
    window.addEventListener('beforeunload', () => {
      if (this.socket) {
        this.socket.close();
      }
    });
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.init(), this.reconnectInterval);
    } else {
      console.warn('Max reconnection attempts reached');
    }
  }

  handleMessage(data) {
    try {
      const message = JSON.parse(data);
      switch (message.action) {
        case 'auth':
          this.send_auth_msg(message.data);
          break;
        case 'login_response':
          this.heartInterval = setInterval(() => {
            this.send('ping', null);
          }, 15000);
          break;
        case 'pong':
          console.log('收到服务器返回的心跳包');
          break;
        case 'msg':
          this.recv_msg_event(message.data);
          break;
        default:
          console.warn(`收到未知的action:${message.action}`);
      }
    } catch (error) {
      console.error('解析 WebSocket 消息发生错误', error);
    }
  }

  send_auth_msg(data) {
    this.client_id = data.client_id;
    const payload = {
      user_id: this.user_id,
      token: this.token,
    };
    this.send('login', payload);
  }

  async recv_msg_event(data) {
    MessagePlugin.error({ content: `[${data.type}]${data.content}`, duration: 5000 });
    const res = await api_msg_query({ page: 1, row: 1000, status: -1 });
    store.commit('notification/setMsgData', res.data.data);
  }

  close() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  send(action, data, msg = '') {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const payload = { action, client_id: this.client_id, msg, data };
      this.socket.send(JSON.stringify(payload));
    } else {
      console.warn('WebSocket 尚未连接');
    }
  }
}

// 创建全局单例
const webSocketService = new WebSocketService();

// 导出单例
export default webSocketService;
