<template>
  <t-dialog :header="isEdit ? '编辑用户' : '新建用户'" :visible.sync="formVisible" :width="680" :footer="false">
    <div slot="body">
      <t-form :data="formData" ref="form" :rules="rules" @submit="onSubmit" :labelWidth="100">
        <t-form-item label="用户名" name="username" v-if="!isEdit">
          <t-input :style="{ width: '480px' }" v-model="formData.username" placeholder="请输入用户名"></t-input>
        </t-form-item>
        <t-form-item label="密码" name="password" v-if="!isEdit">
          <t-input :style="{ width: '480px' }" v-model="formData.password" placeholder="请输入密码"></t-input>
        </t-form-item>
        <t-form-item label="昵称" name="nickname">
          <t-input :style="{ width: '480px' }" v-model="formData.nickname" placeholder="请输入昵称"></t-input>
        </t-form-item>
        <t-form-item label="是否为管理员" name="is_admin">
          <t-switch size="large" v-model="formData.is_admin"></t-switch>
        </t-form-item>
        <t-form-item style="float: right">
          <t-button variant="outline" @click="onClickCloseBtn">取消</t-button>
          <t-button theme="primary" type="submit" style="margin-left: 10px">确定</t-button>
        </t-form-item>
      </t-form>
    </div>
  </t-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'CreateUser',
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      initialData: {
        username: '',
        password: '',
        nickname: '',
        is_admin: false,
      },
      formData: {},
      rules: {
        username: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }],
        nickname: [{ required: true, message: '请输入昵称' }],
        is_admin: [{ required: true, message: '请选择角色' }],
      },
      formVisible: false,
    };
  },
  methods: {
    ...mapActions(['userManagement/addUser', 'userManagement/editUser']),
    show(userInfo) {
      this.formVisible = true;
      this.$refs.form.clearValidate();
      this.formData = userInfo ? { ...userInfo } : { ...this.initialData };
    },
    onClickCloseBtn() {
      this.formVisible = false;
    },
    async onSubmit() {
      await (this.isEdit
        ? this['userManagement/editUser'](this.formData)
        : this['userManagement/addUser'](this.formData));
      this.onClickCloseBtn();
      this.$emit('submit');
    },
  },
};
</script>

<style lang="scss" scoped></style>
