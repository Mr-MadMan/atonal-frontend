<template>
  <t-dialog :header="isEdit ? '编辑规则' : '新建规则'" :visible.sync="formVisible" :width="680" :footer="false">
    <div slot="body">
      <t-form :data="formData" ref="form" :rules="rules" @submit="onSubmit" :labelWidth="100">
        <t-form-item label="规则内容" name="content">
          <t-select :style="{ width: '480px' }" v-model="formData.content" placeholder="请选择规则内容">
            <t-option value="body" label="邮件内容"></t-option>
            <t-option value="title" label="邮件标题"></t-option>
            <t-option value="all" label="邮件内容和标题"></t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="是否包含" name="match">
          <t-switch v-model="formData.match" />
        </t-form-item>
        <t-form-item label="关键词" name="keyword">
          <t-input :style="{ width: '480px' }" v-model="formData.keyword" placeholder="请输入关键词"></t-input>
        </t-form-item>
        <t-form-item label="行为" name="action">
          <t-select :style="{ width: '480px' }" v-model="formData.action" placeholder="请选择行为">
            <t-option value="ham" label="正常邮件"></t-option>
            <t-option value="spam" label="垃圾邮件"></t-option>
          </t-select>
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
  name: 'DialogManageRule',
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      initialData: {
        content: '',
        keyword: '',
        action: '',
        match: false,
      },
      formData: {},
      rules: {
        content: [{ required: true, message: '请输入规则内容' }],
        keyword: [{ required: true, message: '请输入关键词' }],
        action: [{ required: true, message: '请输入行为' }],
      },
      formVisible: false,
    };
  },
  methods: {
    ...mapActions(['rule/addRule', 'rule/editRule']),
    show(ruleInfo) {
      this.formVisible = true;
      this.$refs.form.clearValidate();
      this.formData = ruleInfo ? { ...ruleInfo } : { ...this.initialData };
    },
    onClickCloseBtn() {
      this.formVisible = false;
    },
    async onSubmit() {
      await (this.isEdit ? this['rule/editRule'](this.formData) : this['rule/addRule'](this.formData));
      this.onClickCloseBtn();
      this.$emit('submit');
    },
  },
};
</script>

<style lang="scss" scoped></style>
