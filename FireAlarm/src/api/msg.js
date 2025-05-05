import request from '@/utils/request';

// 查询消息列表
export function api_msg_query(params) {
  return request({
    url: '/api/msg/query',
    method: 'get',
    params,
  });
}

// 设置消息为已读
export function api_msg_set_read(msg_id) {
  return request({
    url: `/api/msg/${msg_id}`,
    method: 'put',
  });
}

// 查询事件列表
export function api_event_query(params) {
  return request({
    url: '/api/event',
    method: 'get',
    params,
  });
}

// 查询事件详情
export function api_event_detail(event_id) {
  return request({
    url: `/api/event/${event_id}`,
    method: 'get',
  });
}

// 修改事件状态
export function api_event_modify(event_id, data) {
  return request({
    url: `/api/event/${event_id}`,
    method: 'put',
    data,
  });
}
