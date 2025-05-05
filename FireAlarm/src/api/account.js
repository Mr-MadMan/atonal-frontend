import request from '@/utils/request';

// 查询数据字典中的信息
export function api_account_query(params) {
  return request({
    url: '/api/account',
    method: 'get',
    params,
  });
}

// 查询用户信息
export function api_account_detail(user_id, params) {
  return request({
    url: `/api/account/info/${user_id}`,
    method: 'get',
    params,
  });
}

// 修改用户信息
export function api_account_update(user_id, data) {
  return request({
    url: `/api/account/info/${user_id}`,
    method: 'put',
    data,
  });
}

//  修改制定用户的密码
export function api_account_update_pasword(user_id, data) {
  return request({
    url: `/api/account/admin/${user_id}/password`,
    method: 'put',
    data,
  });
}

//  修改制定用户的密码
export function api_account_update_role(user_id, data) {
  return request({
    url: `/api/account/admin/${user_id}/role`,
    method: 'put',
    data,
  });
}
