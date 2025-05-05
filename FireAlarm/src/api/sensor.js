import request from '@/utils/request'

// 查询数据字典中的信息
export function api_sensor_create(data) {
    return request({
        url: "/api/sensor",
        method: 'post',
        data,
    })
}


export function api_sensor_list(params){
    return request({
        url: "/api/sensor",
        method: 'get',
        params,
    })
}

export function api_sensor_delete(sensor_id,data){
    return request({
        url: "/api/sensor/" + sensor_id,
        method: 'delete',
        data,
    })
}

export function api_sensor_update(sensor_id,data){
    return request({
        url: "/api/sensor/" + sensor_id,
        method: 'put',
        data,
    })
}

export function api_sensor_log(params){
    return request({
        url: "/api/sensor/log",
        method: 'get',
        params,
    })
}