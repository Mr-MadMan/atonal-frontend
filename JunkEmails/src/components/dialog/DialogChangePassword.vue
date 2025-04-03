<template>
  <t-dialog class="dialog-change-password" header="修改密码" :visible.sync="formVisible" :width="680" :footer="false">
    <div slot="body">
      <!-- 表单内容 -->
      <t-form :data="formData" ref="form" :rules="rules" @submit="onSubmit" :labelWidth="100">
        <t-form-item label="昵称" name="nickname">
          <t-input :style="{ width: '480px' }" v-model="formData.nickname" placeholder="请输入昵称"></t-input>
        </t-form-item>
        <t-form-item label="旧密码" name="old_password">
          <t-input :style="{ width: '480px' }" v-model="formData.old_password" placeholder="请输入旧密码"></t-input>
        </t-form-item>
        <t-form-item label="新密码" name="new_password">
          <t-input :style="{ width: '480px' }" v-model="formData.new_password" placeholder="请输入新密码"></t-input>
        </t-form-item>
        <t-form-item style="float: right">
          <t-button variant="outline" @click="onClickCloseBtn">取消</t-button>
          <t-button theme="primary" type="submit">确定</t-button>
        </t-form-item>
      </t-form>
    </div>
  </t-dialog>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'DialogChangePassword',
  data() {
    return {
      formVisible: false,
      formData: {
        nickname: '',
        old_password: '',
        new_password: '',
      },
      rules: {
        nickname: [{ required: true, message: '请输入昵称', type: 'error' }],
        old_password: [{ required: true, message: '请输入旧密码', type: 'error' }],
        new_password: [{ required: true, message: '请输入新密码', type: 'error' }],
      },
    };
  },
  computed: {
    ...mapState('user', ['userInfo']),
  },
  methods: {
    showDialog() {
      this.formVisible = true;
      this.formData.nickname = this.userInfo.nickname || '';
    },
    async onSubmit() {
      await this.$store.dispatch('user/changePassword', this.formData);
      this.formVisible = false;
      this.$message.success('修改密码成功');
      this.$router.replace('/login');
    },
    onClickCloseBtn() {
      this.formVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped></style>
