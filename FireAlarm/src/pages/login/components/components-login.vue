<template>
  <t-form
    ref="form"
    :class="['item-container', `login-${type}`]"
    :data="formData"
    :rules="FORM_RULES"
    label-width="0"
    @submit="onSubmit"
  >
    <template v-if="type == 'password'">
      <t-form-item name="username">
        <t-input v-model="formData.username" size="large" placeholder="请输入用户名">
          <template #prefix-icon>
            <user-icon />
          </template>
        </t-input>
      </t-form-item>

      <t-form-item name="password">
        <t-input
          v-model="formData.password"
          size="large"
          :type="showPsw ? 'text' : 'password'"
          clearable
          key="password"
          placeholder="请输入登录密码"
        >
          <template #prefix-icon>
            <lock-on-icon />
          </template>
          <template #suffix-icon>
            <browse-icon v-if="showPsw" @click="showPsw = !showPsw" key="browse" />
            <browse-off-icon v-else @click="showPsw = !showPsw" key="browse-off" />
          </template>
        </t-input>
      </t-form-item>

      <template v-if="showCaptcha">
        <t-form-item class="verification-code" name="randcode">
          <t-input v-model="formData.randcode" size="large" placeholder="请输入验证码" />
          <t-button
            type="button"
            :loading="btn_captcha"
            variant="outline"
            :disabled="countDown > 0"
            @click.prevent="onhandleCaptchaClick"
          >
            {{ countDown == 0 ? '发送验证码' : `${countDown}秒后可重发` }}
          </t-button>
        </t-form-item>
      </template>
    </template>

    <t-form-item v-if="type !== 'qrcode'" class="btn-container">
      <t-button :loading="btn_login" block size="large" type="submit"> 登录 </t-button>
    </t-form-item>

    <div id="aliyun-captcha-element"></div>
    <button type="button" id="aliyun-captcha-button" ref="captchaButton" style="display: none"></button>
  </t-form>
</template>
<script lang="ts">
import Vue from 'vue';
import { UserIcon, LockOnIcon, BrowseOffIcon, BrowseIcon } from 'tdesign-icons-vue';
import { api_user_captcha_config, api_user_recaptcha, api_user_login_v2 } from '@/api/user.js';
import SHA1 from 'crypto-js/sha1';
import webSocketService from '@/utils/websocket';

const INITIAL_DATA = {
  username: '',
  password: '',
  randcode: '',
};

const FORM_RULES = {
  username: [{ required: true, message: '用户名必填', type: 'error' }],
  password: [
    { required: true, message: '密码必填', type: 'error' },
    {
      validator: (val) => val.length >= 6,
      message: '密码长度不能少于6位',
      type: 'error',
    },
    {
      validator: (val) => /[a-zA-Z]/.test(val) && /[0-9]/.test(val),
      message: '密码必须包含字母和数字',
      type: 'error',
    },
    {
      validator: (val) => !/\s/.test(val),
      message: '密码不能包含空格',
      type: 'error',
    },
  ],
  randcode: [{ required: true, message: '验证码必填', type: 'error' }],
};

export default Vue.extend({
  name: 'Login',
  components: {
    UserIcon,
    LockOnIcon,
    BrowseOffIcon,
    BrowseIcon,
  },
  data() {
    return {
      FORM_RULES,
      type: 'password',
      formData: { ...INITIAL_DATA },
      showPsw: false,
      showCaptcha: false,
      countDown: 0,
      intervalTimer: null,
      captcha_mode: 'login',
      captcha_token: '',
      captcha_response: {},
      captcahConfig: {
        captcha_prefix: '',
        captcha_sceneid: '',
      },
      btn_captcha: false,
      btn_login: false,
    };
  },
  mounted() {
    this.getCaptchaConfig();
  },
  beforeDestroy() {
    clearInterval(this.intervalTimer);
  },
  methods: {
    async getCaptchaConfig() {
      const res = await api_user_captcha_config();
      this.captcahConfig = res.data;
      window.initAliyunCaptcha({
        SceneId: this.captcahConfig.captcha_sceneid,
        prefix: this.captcahConfig.captcha_prefix,
        mode: 'popup',
        element: '#aliyun-captcha-element',
        button: '#aliyun-captcha-button',
        captchaVerifyCallback: this.captchaVerifyCallback,
        onBizResultCallback: this.onBizResultCallback,
        getInstance: this.getInstance,
        slideStyle: {
          width: 360,
          height: 40,
        },
        language: 'cn',
      });
    },
    async onSubmit({ validateResult }) {
      if (!validateResult) return;
      if (!this.showCaptcha) {
        this.$refs.captchaButton.click();
      } else {
        const payload = {
          captcha_mode: this.captcha_mode,
          captcha_code: this.formData.randcode,
          captcha_token: this.captcha_token,
        };
        this.btn_login = true;
        const res = await api_user_recaptcha(payload);
        if (res.code == 0) {
          await this.$store.commit('user/setToken', res.data.session_id);
          await this.$store.commit('user/setUserInfo', res.data.session);
          this.$message.success('登录成功');
          // 初始化WebSocket连接
          window.websocket = webSocketService;
          webSocketService.init();

          this.$router.push('/user/index');
        } else {
          this.$message.error({ content: res.msg, duration: 1500 });
        }
        this.btn_login = false;
      }
    },
    async onhandleCaptchaClick() {
      const res = await this.$refs.form.validate({ fields: ['username', 'password'] });
      if (typeof res === 'boolean' && res) {
        this.$refs.captchaButton.click();
      }
    },
    getInstance(instance) {
      this.captcha = instance;
    },
    async captchaVerifyCallback(captchaVerifyParam) {
      try {
        // 登录的时候不通过 重发接口下发
        // 而是直接重新登录 AI 考虑的有道理
        this.btn_captcha = true;
        const payload = {
          username: this.formData.username,
          password: SHA1(this.formData.password).toString(),
          aliyun_captcha: captchaVerifyParam,
        };
        const res = await api_user_login_v2(payload);
        this.btn_captcha = false;

        if (res.code !== 501) {
          this.captcha_token = res.data?.captcha_token;
          this.captcha_response = res;
          return { captchaResult: true, bizResult: true };
        }
        return new Promise((resolve) => {
          this.$message.error({
            content: res.msg,
            duration: 1500,
            onClose: () => {
              resolve({ captchaResult: false, bizResult: false });
            },
          });
        });
      } catch (error) {
        this.btn_captcha = false;
        return { captchaResult: false, bizResult: false };
      }
    },
    async onBizResultCallback() {
      if (this.captcha_response.code != 0) {
        this.$message.error(this.captcha_response.msg);
      } else {
        this.showCaptcha = true;
        this.$message.success('验证码发送成功!');
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
    },
  },
});
</script>

<style lang="less" scoped>
@import '@/style/variables.less';

.item-container {
  padding: 0;
  width: 400px;
  margin-top: var(--td-comp-margin-xl);
  border-radius: var(--td-radius-medium);

  .verification-code {
    display: flex;
    align-items: center;
    gap: 8px;

    :deep(.t-input) {
      flex: 1;
    }

    :deep(.t-button) {
      flex-shrink: 0;
      width: 120px;
      height: 40px;
    }
  }

  .check-container {
    display: flex;
    align-items: center;
    margin-bottom: 24px;

    :deep(.t-checkbox__label) {
      color: var(--td-text-color-secondary);
    }

    .tip {
      color: var(--td-brand-color);
      cursor: pointer;
    }

    &.remember-pwd {
      margin-bottom: 0;
      justify-content: space-between;
    }
  }

  .btn-container {
    margin-top: 48px;
  }
}

#aliyun-captcha-element {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
</style>
