import request from '@/utils/request'

// 查询数据字典中的信息
export function api_kobject_query(params) {
    return request({
        url: "/api/kobject/query",
        method: 'get',
        params,
    })
}

// 批量查询数据字典
export function api_kobject_query_items(keys,params) {
    params["keys"] = ",".join(keys)
    return request({
        url: "/api/kobject/query/items",
        method: 'get',
        params
    })
}