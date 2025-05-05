import request from '@/utils/request'

// 查询数据字典中的信息
export function api_file_sha256_query(sha256,params) {
    return request({
        url: "/api/file/sha256/" + sha256,
        method: 'get',
        params,
    })
}