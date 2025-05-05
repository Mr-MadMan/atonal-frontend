import request from '@/utils/request'

// 查询我关联的病人
export function api_link(params){
    return request({
        url: "/api/link",
        method: 'get',
        params,
    })
}

// 查询指定的病人关联的信息
export function api_link_query(user_id,params) {
    return request({
        url: "/api/link/" + user_id,
        method: 'get',
        params,
    })
}

// 修改关联的医生和护士
export function api_link_update(user_id,data){
    return request({
        url: "/api/link/" + user_id,
        method: 'put',
        data,
    })
}