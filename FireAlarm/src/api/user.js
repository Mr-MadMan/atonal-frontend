import request from '@/utils/request'

// 获取验证码配置信息
export function api_user_captcha_config(params) {
    return request({
        url: "/api/user/captcha",
        method: 'get',
        params,
    })
}

// 用户注册接口
export function api_user_reg_v2(data){
    return request({
        url: "/api/user/regv2",
        method: 'post',
        data,
    })
}

// 验证码效验重发接口
export function api_user_recaptcha(data){
    return request({
        url: "/api/user/recaptcha",
        method: 'post',
        data,
    })
}

// 用户登录接口
export function api_user_login_v2(data){
    return request({
        url: "/api/user/loginv2",
        method:"post",
        data
    })
}

// 获取每日一言的接口
export function api_user_oneday(params){
    return request({
        url:"/api/user/oneday",
        method:"get",
        params
    })
}


// 获取用户的信息 
export function api_user_info(params){
    return request({
        url:"/api/user",
        method:"get",
        params
    })
}

// 用户退出登录
export function api_user_login_out(params){
    if(window.websocket) window.websocket.close()
    return request({
        url:"/api/user",
        method:"delete",
        params
    })
}

// 用户更新信息
export function api_user_update_info(data){
    return request({
        url:"/api/user",
        method:"post",
        data
    })
}

// 修改用户的密码
export function api_user_update_password(data){
    return request({
        url:"/api/user",
        method:"put",
        data
    })
}