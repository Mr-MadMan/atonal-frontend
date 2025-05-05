<template>
  <div>
    <t-dialog
      :visible="visible"
      :header="header"
      :footer="null"
      width="800px"
      placement="center"
      :close-on-overlay-click="false"
      :close-on-esc-keydown="false"
      class="user-edit-modal"
      @close="$emit('close')"
    >
      <div class="user-info-container">
        <t-card>
          <!-- 基础信息表单 -->
          <t-form :disabled="!edit" @submit="handleSubmit" style="position: relative; top: -20px">
            <t-form-item label="用户名">
              <t-input v-model="formData.username" readonly placeholder="请输入用户名" />
            </t-form-item>
            <t-form-item label="姓名">
              <t-input v-model="formData.realname" placeholder="请输入姓名" />
            </t-form-item>
            <t-form-item label="性别">
              <t-radio-group v-model="formData.sex">
                <t-radio value="1">男</t-radio>
                <t-radio value="0">女</t-radio>
              </t-radio-group>
            </t-form-item>

            <t-form-item
              label="电话"
              :rules="[
                {
                  validator: (val) => !this.validatePhone(val),
                  message: '请输入有效的手机号',
                },
              ]"
            >
              <t-input v-model="formData.telphone" placeholder="请输入11位手机号" />
            </t-form-item>
            <t-form-item label="年龄">
              <t-input v-model="formData.age" placeholder="请输入年龄" />
            </t-form-item>
            <t-form-item label="角色">
              <t-tag>{{ roleMap[formData.role] || formData.role }}</t-tag>
            </t-form-item>
            <t-form-item label="应急联系人">
              <t-input v-model="formData.emergency_contact" placeholder="请输入应急联系人姓名" />
            </t-form-item>
            <t-form-item label="应急联系人电话">
              <t-input v-model="formData.emergency_phone" placeholder="请输入应急联系人电话" />
            </t-form-item>
            <t-form-item v-if="edit" class="flex justify-end">
              <div style="position: relative; right: -80%">
                <t-button theme="primary" type="submit">保存</t-button>
                <t-button style="margin-left: 16px" variant="outline" @click="$emit('close')">取消</t-button>
              </div>
            </t-form-item>
          </t-form>

          <!-- 管理员功能按钮 -->
          <template v-if="isAdmin" #actions>
            <t-tooltip content="修改密码" placement="top" style="margin-right: 8px">
              <t-button variant="outline" size="small" @click="showPasswordDialog = true">
                <t-icon name="lock-on" />
              </t-button>
            </t-tooltip>
            <t-tooltip content="修改角色" placement="top" style="margin-right: 8px">
              <t-button variant="outline" size="small" @click="showRoleDialog = true">
                <t-icon name="user-setting" />
              </t-button>
            </t-tooltip>
          </template>
        </t-card>
      </div>
    </t-dialog>

    <!-- 修改密码弹窗 -->
    <t-dialog
      :visible="showPasswordDialog"
      header="修改密码"
      attach="body"
      :on-confirm="
        () => {
          handleChangePassword();
          showPasswordDialog = false;
        }
      "
      @close="showPasswordDialog = false"
    >
      <t-form label-width="120px">
        <t-form-item label="新密码">
          <t-input v-model="passwordForm.new_pasword" type="password" placeholder="请输入新密码" />
        </t-form-item>
      </t-form>
    </t-dialog>

    <!-- 修改角色弹窗 -->
    <t-dialog
      :visible="showRoleDialog"
      header="修改角色"
      attach="body"
      :on-confirm="
        () => {
          handleChangeRole();
          showRoleDialog = false;
        }
      "
      @close="showRoleDialog = false"
      @cancel="showRoleDialog = false"
    >
      <t-form label-width="120px">
        <t-form-item label="新角色">
          <t-select v-model="roleForm.newRole" placeholder="请选择角色" style="width: 200px">
            <t-option v-for="item in roleOptions" :key="item.value" :value="item.value" :label="item.label" />
          </t-select>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script>
import {
  api_account_detail,
  api_account_update,
  api_account_update_pasword,
  api_account_update_role,
} from '@/api/account.js';

import SHA1 from 'crypto-js/sha1';

import store from '@/store';

export default {
  name: 'UserInfo',
  props: {
    user_id: {
      type: [String, Number],
      required: true,
    },
    edit: {
      type: Boolean,
      default: false,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    header: {
      type: String,
      default: '编辑用户信息',
    },
  },
  data() {
    return {
      roleMap: {
        user: '值班员',
        admin: '管理员',
      },
      roleOptions: [
        { value: 'user', label: '值班员' },
        { value: 'admin', label: '管理员' },
      ],
      formData: {
        username: '',
        realname: '',
        telphone: '',
        email: '',
        gender: '',
        birthday: '',
        role: '',
        emergency_contact: '',
        emergency_phone: '',
      },
      passwordForm: {
        new_pasword: '',
      },
      roleForm: {
        newRole: '',
      },
      staffForm: {
        doctorId: '',
        nurseId: '',
      },
      nurseList: [],
      isAdmin: store.getters['user/role'] === 'admin',
      showPasswordDialog: false,
      showRoleDialog: false,
      bloodTypeOptions: [],
    };
  },
  watch: {
    user_id() {
      this.fetchUserInfo();
    },
  },
  created() {
    this.fetchUserInfo();
  },
  methods: {
    handleCancel() {
      // this.$emit('close');
      console.log('cancel');
    },
    async fetchUserInfo() {
      try {
        const res = await api_account_detail(this.user_id);
        this.formData = res.data;
        this.roleForm.newRole = res.data.role;
        this.staffForm.doctorId = res.data.doctor_id;
        this.staffForm.nurseId = res.data.nurse_id;
      } catch (error) {
        this.$message.error('获取用户信息失败');
      }
    },
    async handleSubmit() {
      // 校验必填字段
      if (!this.formData.realname) {
        this.$message.warning('请输入姓名');
        return;
      }

      const phoneError = this.validatePhone(this.formData.telphone);
      if (phoneError) {
        this.$message.warning(phoneError);
        return;
      }

      const emergencyPhoneError = this.validatePhone(this.formData.emergency_phone);
      if (emergencyPhoneError) {
        this.$message.warning(emergencyPhoneError);
        return;
      }

      try {
        await api_account_update(this.user_id, this.formData);
        this.$message.success('用户信息更新成功');
        this.$emit('success');
      } catch (error) {
        this.$message.error(error.message || '更新失败');
      }
    },
    validatePassword(password) {
      if (!password) return '请输入密码';
      if (password.length < 8) return '密码长度不能少于8位';
      if (!/[a-zA-Z]/.test(password)) return '密码必须包含字母';
      if (!/\d/.test(password)) return '密码必须包含数字';
      return '';
    },

    validatePhone(phone) {
      if (!phone) return '';
      if (!/^1[3-9]\d{9}$/.test(phone)) return '请输入有效的手机号';
      return '';
    },

    async handleChangePassword() {
      const passwordError = this.validatePassword(this.passwordForm.new_pasword);
      if (passwordError) {
        this.$message.warning(passwordError);
        return;
      }
      try {
        await api_account_update_pasword(this.user_id, {
          new_password: SHA1(this.passwordForm.new_pasword).toString(),
        });
        this.$message.success('密码修改成功');
        this.passwordForm.new_pasword = '';
      } catch (error) {
        this.$message.error('密码修改失败');
      }
    },
    async handleChangeRole() {
      if (!this.roleForm.newRole) {
        this.$message.warning('请选择角色');
        return;
      }
      try {
        await api_account_update_role(this.user_id, {
          role: this.roleForm.newRole,
        });
        this.$message.success('角色修改成功');
        this.fetchUserInfo();
      } catch (error) {
        this.$message.error('角色修改失败');
      }
    },
  },
};
</script>

<style scoped>
.user-info-container {
  padding: 0;
  max-height: 70vh;
  overflow-y: auto;
}

.t-form {
  padding: 20px;
}

.t-form-item {
  margin-bottom: 20px;
}

.admin-functions {
  margin-top: 30px;
  padding: 0 20px 20px;
}

.t-divider {
  margin: 20px 0;
}
</style>
