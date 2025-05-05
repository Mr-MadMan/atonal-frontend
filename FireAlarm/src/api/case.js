import request from '@/utils/request'

// 创建病例
export function api_case_create(data) {
    return request({
        url: "/api/case",
        method: 'post',
        data,
    })
}

// 获取病例列表
export function api_case_list(params) {
    return request({
        url: "/api/case",
        method: 'get',
        params,
    })
}
// 获取病例详情
export function api_case_detail(case_id,params){
    return request({
        url: `/api/case/${case_id}`,
        method: 'get',
        params,
    })
}

// 更新病例信息
export function api_case_update(case_id, data) {
    return request({
        url: `/api/case/${case_id}`,
        method: 'put',
        data,
    })
}

// 删除病例
export function api_case_delete(case_id) {
    return request({
        url: `/api/case/${case_id}`,
        method: 'delete',
    })
}