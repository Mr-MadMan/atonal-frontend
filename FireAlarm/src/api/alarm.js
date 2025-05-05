import request from '@/utils/request';

/**
 * 分页查询所有视频流
 * @param {number} params.page 当前页码
 * @param {number} params.row 每页条数
 * @param {string} params.status -1查询所有 0未启用 1已启用
 * @param {string} params.stream_title 视频流名称
 * @returns
 */
export function api_video_list(params) {
  return request({
    url: '/api/video',
    method: 'get',
    params,
  });
}

/**
 * 新增视频流
 * @param {string} data.stream_title 视频流名称
 * @param {string} data.stream_url 视频流地址
 * @returns
 */
export function api_video_add(data) {
  return request({
    url: '/api/video',
    method: 'post',
    data,
  });
}

// 查询视频流详情
export function api_video_detail(video_id) {
  return request({
    url: `/api/video/${video_id}`,
    method: 'get',
  });
}

/**
 * 删除视频流
 * @param {number} params.video_id 视频流id
 * @returns
 */
export function api_video_delete(video_id) {
  return request({
    url: `/api/video/${video_id}`,
    method: 'delete',
  });
}

/**
 * 更新视频流
 * @param {Number} video_id 视频流id
 * @param {Object} data 更新数据
 * @returns
 */
export function api_video_update(video_id, data) {
  return request({
    url: `/api/video/${video_id}`,
    method: 'put',
    data,
  });
}
