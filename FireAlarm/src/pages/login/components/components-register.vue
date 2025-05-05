<template>
  <t-form
    ref="form"
    :class="['item-container', `register-phone`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
  <template>
      <t-form-item name="username">
        <t-input v-model="formData.username" type="text" size="large" placeholder="请输入您的用户名">
          <template #prefix-icon>
          <user-icon />
          </template>
        </t-input>
      </t-form-item>
    </template>


    <t-form-item name="password">
      <t-input
        v-model="formData.password"
        size="large"
        :type="showPsw ? 'text' : 'password'"
        clearable
        placeholder="请输入登录密码"
      >
        <template #prefix-icon>
          <lock-on-icon />
        </template>
        <template #suffix-icon>
          <browse-icon v-if="showPsw" key="browse" @click="showPsw = !showPsw" />
          <browse-off-icon v-else key="browse-off" @click="showPsw = !showPsw" />
        </template>
      </t-input>
    </t-form-item>

    

    <template >
      <t-form-item name="telphone">
        <t-input v-model="formData.telphone" :maxlength="11" size="large" placeholder="请输入您的手机号">
          <template #prefix-icon>
            <mobile-vibrate-icon />
          </template>
        </t-input>
      </t-form-item>
    </template>


    <template >
      <t-form-item name="realname">
        <t-input v-model="formData.realname" :maxlength="11" size="large" placeholder="请输入您的姓名">
          <template #prefix-icon>
            <user-icon />

          </template>
        </t-input>
      </t-form-item>
    </template>


    <template >
      <t-form-item class="verification-code" name="randcode">
        <t-input v-model="formData.randcode" size="large" placeholder="请输入验证码" />
        <t-button type="button" :loading="btn_captcha" variant="outline" :disabled="countDown > 0" @click.prevent="onhandleCaptchaClick">
          {{ countDown == 0 ? '发送验证码' : `${countDown}秒后可重发` }}
        </t-button>
      </t-form-item>
    </template>

 

    <t-form-item>
      <t-button :loading="btn_reg" block size="large" type="submit"> 注册 </t-button>
    </t-form-item>

    <div id="aliyun-captcha-element"></div>
    <button type="button" id="aliyun-captcha-button" ref="captchaButton" style="display:none"></button>

  </t-form>
</template>
<script lang="ts">
import Vue from 'vue';
import {api_user_captcha_config,api_user_reg_v2,api_user_recaptcha} from '@/api/user';
import { UserIcon, BrowseIcon,MobileVibrateIcon, BrowseOffIcon, LockOnIcon } from 'tdesign-icons-vue';
import SHA1 from 'crypto-js/sha1';

const INITIAL_DATA = {
  username: '',
  password: '',
  realname:'',
  telphone: '',
  randcode: '',
};

const FORM_RULES = {
  username: [
    { required: true, message: '用户名必填' },
    { min: 5, message: '用户名至少5个字符' }
  ],
  realname: [
    { required: true, message: '正式姓名必填' },
    { 
      validator: (val) => /^[\u4e00-\u9fa5·]+$/.test(val),
      message: '姓名必须为中文'
    }
  ],
  // 密码规则
  password: [
    { required: true, message: '密码必填' },
    {
      validator: (val) => {
        const hasNumber = /\d/.test(val);
        const hasLower = /[a-z]/.test(val);
        const hasUpper = /[A-Z]/.test(val);
        const hasSpecial = /[^a-zA-Z\d]/.test(val);
        return val.length >= 8 && 
          [hasNumber, hasLower, hasUpper, hasSpecial].filter(Boolean).length >= 3;
      },
      message: '需包含数字、大小写字母、特殊符号中至少三种'
    }
  ],
 
  telphone: [{ required: true, message: '手机号必填', type: 'error' }],
  randcode: [{ required: true, message: '验证码必填', type: 'error' }],
};

/** 高级详情 */
export default Vue.extend({
  name: 'Register',
  components: {
    UserIcon,
    MobileVibrateIcon,
    BrowseIcon,
    BrowseOffIcon,
    LockOnIcon,
  },
  data() {
    return {
      FORM_RULES,
      formData: { ...INITIAL_DATA },
      showPsw: false,
      countDown: 0,
      captcha_mode:"reg",
      captcha_token:"",
      intervalTimer: null,
      captcha_response:{},
      captcahConfig:{
        captcha_prefix:"",
        captcha_sceneid:"",
      },
      btn_captcha:false,
      btn_reg:false,
    };
  },
  mounted(){
    this.getCaptchaConfig();
  },
  beforeDestroy() {
    clearInterval(this.intervalTimer);
  },
  methods: {
    // 获得服务器上的验证码配置信息
    async getCaptchaConfig(){
      let res = await api_user_captcha_config();
      this.captcahConfig = res.data;
      window.initAliyunCaptcha({
        SceneId: this.captcahConfig.captcha_sceneid, 
        prefix: this.captcahConfig.captcha_prefix,
        mode: 'popup', // 验证码模式。popup表示要集成的验证码模式为弹出式。
        element: '#aliyun-captcha-element', 
        button: '#aliyun-captcha-button',
        captchaVerifyCallback: this.captchaVerifyCallback, // 业务请求(带验证码校验)回调函数
        onBizResultCallback: this.onBizResultCallback, // 业务请求结果回调函数，无需修改
        getInstance: this.getInstance,
        slideStyle: {
          width: 360,
          height: 40,
        }, 
        language: 'cn', 
    });
    },
    async onSubmit({ validateResult }: { validateResult: boolean }) {
       if (!validateResult) return;
       let payload = {captcha_mode:"",captcha_code:"",captcha_token:""};
       payload.captcha_mode = "reg";
       payload.captcha_code = this.formData.randcode;
       payload.captcha_token = this.captcha_token;
       this.btn_reg = true;
       let res = await api_user_recaptcha(payload);
        if(res.code == 0) {
          this.$message.success("注册成功，请登录");
          this.$router.go(0) ;
        }
        else this.$message.error(res.msg);
        this.btn_reg = false;
    },
    async onhandleCaptchaClick(){
        let res = await this.$refs.form.validate({fields:['username', 'telphone', 'realname','password']});
        if(typeof res == 'boolean' && res){
            this.$refs.captchaButton.click();
        }
    },
    getInstance(instance) {
      this.captcha = instance;
    },
    // 获得验证参数
    async captchaVerifyCallback(captchaVerifyParam){
      let res = null;
      this.btn_captcha = true;
      console.log(captchaVerifyParam);
      // 注册的逻辑
      if(this.captcha_mode == "reg"){
        let payload = {...this.formData}
        payload.aliyun_captcha = captchaVerifyParam;
        payload.password = SHA1(payload.password).toString();
        res = await api_user_reg_v2(payload);
      }
      // 重新发送验证码的逻辑
      else{
        let payload = {
          captcha_token:this.captcha_token,
          captcha_mode:this.captcha_mode,
          aliyun_captcha:captchaVerifyParam
        }
         res = await api_user_recaptcha(payload);
      }
      this.btn_captcha = false;
      // 后端风控认证完成
      if (res.code !== 501) {
          this.captcha_token = res.data?.captcha_token;
          this.captcha_response = res;
          return {captchaResult:true,bizResult:true};
        }
        else {
          console.log(res);
          return new Promise((resolve) => {
            this.$message.error({
              content: res.msg,
              duration: 1500,
              onClose: () => {
                resolve({captchaResult:false,bizResult:false});
              }
            });
          });
        }
    },
    // 验证通过后的返回函数
    async onBizResultCallback(){
      if(this.captcha_response.code != 0){
        this.$message.error(this.captcha_response.msg);
      }
      else{
        this.$message.success('验证码发送成功!');
        this.captcha_mode = "reset-reg"
        this.countDown = 60;
        this.intervalTimer = setInterval(() => {
          if (this.countDown > 0) {
            this.countDown -= 1;
          } else {
            clearInterval(this.intervalTimer);
            this.countDown = 0;
          }
        }, 1000);
      }
    }
    
  },
});
</script>