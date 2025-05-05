<template>
  <t-row :gutter="[16, 16]">
    <t-col :flex="3">
      <div class="user-left-greeting">
        <div>
          <div>{{ getGreeting() }}{{ originalUserData.realname }}</div>
          <div class="regular" style="margin-top: 16px">
            {{ oneday_msg.content }}
            <template v-if="oneday_msg.author">by {{ oneday_msg.author }} </template>
          </div>
        </div>
      </div>

      <t-card class="user-info-list" title="个人信息" :bordered="false">
        <template #actions>
          <t-button theme="default" shape="square" variant="text" @click="showEditDialog = true">
            <edit-icon size="18" />
          </t-button>
          <t-button theme="default" shape="square" variant="text" @click="showPasswordDialog = true">
            <lock-on-icon size="18" />
          </t-button>
        </template>
        <t-dialog :visible="showEditDialog" header="编辑个人信息" :on-confirm="saveUserInfo" :on-close="closeDialog">
          <t-form ref="editFormRef" :data="editForm" :rules="formRules" :colon="true" label-align="left">
            <t-form-item label="姓名" name="realname">
              <t-input v-model="editForm.realname" placeholder="请输入姓名" />
            </t-form-item>
            <t-form-item label="电话" name="telphone">
              <t-input v-model="editForm.telphone" placeholder="请输入电话" />
            </t-form-item>
            <t-form-item label="性别" name="sex">
              <t-select v-model="editForm.sex" placeholder="请选择性别">
                <t-option value="1" label="男" />
                <t-option value="0" label="女" />
              </t-select>
            </t-form-item>
            <t-form-item label="年龄" name="age">
              <t-input v-model="editForm.age" placeholder="请输入年龄" />
            </t-form-item>
            <t-form-item label="紧急联系人" name="emergency_contact">
              <t-input v-model="editForm.emergency_contact" placeholder="请输入紧急联系人" />
            </t-form-item>
            <t-form-item label="紧急电话" name="emergency_phone">
              <t-input v-model="editForm.emergency_phone" placeholder="请输入紧急电话" />
            </t-form-item>
          </t-form>
        </t-dialog>

        <!-- 密码修改对话框 -->
        <t-dialog
          header="修改密码"
          :visible="showPasswordDialog"
          :on-confirm="handlePasswordSubmit"
          @close="handlePasswordClose"
        >
          <t-form :data="passwordForm">
            <t-form-item label="旧密码" name="old_password">
              <t-input v-model="passwordForm.old_password" type="password" placeholder="请输入旧密码" />
            </t-form-item>
            <t-form-item label="新密码" name="new_password">
              <t-input v-model="passwordForm.new_password" type="password" placeholder="请输入新密码" />
            </t-form-item>
            <t-form-item label="确认新密码" name="confirm_password">
              <t-input v-model="passwordForm.confirm_password" type="password" placeholder="请再次输入新密码" />
            </t-form-item>
          </t-form>
        </t-dialog>
        <t-row class="content" justify="space-between">
          <t-col v-for="(item, index) in user_info" :key="index" class="contract" :span="item.span || 3">
            <div class="contract-title">
              {{ item.title }}
            </div>
            <t-tooltip :content="item.content" placement="top" :disabled="!item.content || item.content.length <= 15">
              <div
                class="contract-detail"
                style="max-width: 90%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap"
              >
                {{ item.content }}
              </div>
            </t-tooltip>
          </t-col>
        </t-row>
      </t-card>
    </t-col>
  </t-row>
</template>
<script>
import { EditIcon, LockOnIcon } from 'tdesign-icons-vue';
import { api_user_oneday, api_user_info, api_user_update_password, api_user_update_info } from '@/api/user';
import SHA1 from 'crypto-js/sha1';

export default {
  name: 'UserIndex',

  components: {
    EditIcon,
    LockOnIcon,
  },
  data() {
    return {
      user_info: [],
      oneday_msg: {
        content: '',
        date: '',
        author: '',
      },
      realname: '',
      showEditDialog: false,
      formRules: {
        telphone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
        ],
        emergency_phone: [{ pattern: /^1[3-9]\d{9}$/, message: '请输入正确的紧急电话格式', trigger: 'blur' }],
      },
      editForm: {
        realname: '',
        telphone: '',
        people_card_id: '',
        medical_card_id: '',
        bloodtype: '',
        sex: '',
        age: '',
        homeaddress: '',
        emergency_contact: '',
        emergency_phone: '',
      },
      originalUserData: { realname: '' },
      showPasswordDialog: false,
      blood_types: [],
      passwordForm: {
        old_password: '',
        new_password: '',
        confirm_password: '',
      },
    };
  },
  mounted() {
    this.get_oneday_data();
    this.get_user_info();
  },
  methods: {
    handlePasswordClose() {
      this.showPasswordDialog = false;
      this.passwordForm = {
        old_password: '',
        new_password: '',
        confirm_password: '',
      };
    },
    async handlePasswordSubmit() {
      if (this.passwordForm.new_password !== this.passwordForm.confirm_password) {
        this.$message.error('新密码与确认密码不一致');
        return;
      }

      const hasNumber = /\d/.test(this.passwordForm.new_password);
      const hasLower = /[a-z]/.test(this.passwordForm.new_password);
      const hasUpper = /[A-Z]/.test(this.passwordForm.new_password);
      const hasSpecial = /[^a-zA-Z\d]/.test(this.passwordForm.new_password);
      const complexityCount = [hasNumber, hasLower, hasUpper, hasSpecial].filter(Boolean).length;

      if (this.passwordForm.new_password.length < 8) {
        this.$message.error('密码长度不能少于8位');
        return;
      }

      if (complexityCount < 3) {
        this.$message.error('密码需包含数字、大小写字母、特殊符号中至少三种');
        return;
      }

      try {
        // 这里调用修改密码的API
        const payload = { ...this.passwordForm };
        payload.old_password = SHA1(payload.old_password).toString();
        payload.new_password = SHA1(payload.new_password).toString();
        const res = await api_user_update_password(payload);
        if (res.code == 0) {
          this.$message.success('密码修改成功');
          this.$router.push('/login');
        } else this.$message.error(res.msg);
      } catch (error) {
        this.$message.error(error.message || '密码修改失败');
      }
    },
    async get_oneday_data() {
      const res = await api_user_oneday();
      this.oneday_msg = res.data;
    },
    async get_user_info() {
      const res = await api_user_info();
      this.originalUserData = res.data;
      await this.$store.commit('user/setUserInfo', this.originalUserData);

      this.user_info = [
        { title: '姓名', content: res.data.realname || '未设置' },
        { title: '用户名', content: res.data.username || '未设置' },
        { title: '电话', content: res.data.telphone || '未设置' },
        {
          title: '角色',
          content:
            {
              user: '值班员',
              admin: '管理员',
            }[res.data.role] ||
            res.data.role ||
            '未设置',
        },
        { title: '年龄', content: res.data.age || '未设置' },
        { title: '紧急联系人', content: res.data.emergency_contact || '未设置' },
        { title: '紧急电话', content: res.data.emergency_phone || '未设置' },
        { title: '注册时间', content: new Date(res.data.create_time * 1000).toLocaleString() || '未设置' },
      ];
      this.initEditForm();
    },

    initEditForm() {
      if (this.originalUserData) {
        this.editForm = {
          realname: this.originalUserData.realname || '',
          telphone: this.originalUserData.telphone || '',
          sex: this.originalUserData.sex || '',
          age: this.originalUserData.age || '',
          emergency_contact: this.originalUserData.emergency_contact || '',
          emergency_phone: this.originalUserData.emergency_phone || '',
        };
      }
    },

    async saveUserInfo() {
      try {
        // 先验证表单
        await this.$refs.editFormRef.validate();
        // 处理参数转换
        const payload = {};
        Object.keys(this.editForm).forEach((key) => {
          // 跳过空字符串的字段
          if (this.editForm[key] !== '') {
            // 特殊处理sex和age字段
            if (key === 'sex' || key === 'age') {
              payload[key] = parseInt(this.editForm[key], 10);
            } else {
              payload[key] = this.editForm[key];
            }
          }
        });

        const res = await api_user_update_info(payload);
        console.log(res);
        // await api_update_user(this.editForm);
        this.$message.success('个人信息更新成功');
        await this.get_user_info(); // 刷新数据
        this.showEditDialog = false;
      } catch (error) {
        if (error?.fields) {
          // 表单验证错误
          this.$message.error('请检查表单填写是否正确');
        } else {
          // API调用错误
          this.$message.error(`更新失败: ${error.message}`);
        }
      }
    },

    closeDialog() {
      this.showEditDialog = false;
    },

    getGreeting() {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) return '上午好, ';
      if (hour >= 12 && hour < 18) return '下午好, ';
      if (hour >= 18 || hour < 0) return '晚上好, ';
      if (hour >= 0 || hour < 6) return '夜深了, ';
      return '你好, ';
    },
  },
};
</script>
<style lang="less" scoped>
@import url('./index.less');
</style>
