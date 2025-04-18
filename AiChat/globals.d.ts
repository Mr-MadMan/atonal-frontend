// 通用声明
declare type ClassName = { [className: string]: any } | ClassName[] | string;

declare interface ImportMeta {
  env: {
    MODE: 'mock' | 'dev' | 'prod';
  };
}

declare module '*.svg' {
  const content: string;
  export default content;
}
