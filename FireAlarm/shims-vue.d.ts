declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

// 全局 API 响应类型声明
declare interface ApiResponse {
  code: number;
  data: any;
  msg?: string;
}

