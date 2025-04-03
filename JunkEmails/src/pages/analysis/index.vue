<template>
  <div class="analysis">
    <t-form :data="formData" :rules="rules" ref="form" @reset="onReset" @submit="onSubmit">
      <t-form-item label="邮件标题" name="mail_title">
        <t-input v-model="formData.mail_title" placeholder="请输入邮件标题"></t-input>
      </t-form-item>
      <t-form-item label="邮件内容" name="mail_body">
        <t-textarea v-model="formData.mail_body" placeholder="请输入邮件内容" />
      </t-form-item>
      <t-form-item style="margin-left: 100px">
        <t-space size="10px">
          <t-button theme="primary" type="submit">提交</t-button>
          <t-button theme="default" variant="base" type="reset">重置</t-button>
        </t-space>
      </t-form-item>
    </t-form>

    <!--
    邮件分析结果
      verify_id 数据库 记录id
    label ham/spam  是不是垃圾邮件
    probability 置信度 ， 就是emm ， 100 最高
    rule_id 策略id ，可能为空
    -->
    <t-descriptions
      class="analysis-result"
      :labelStyle="{ backgroundColor: '#fff', width: '140px', color: '#000' }"
      :contentStyle="{ fontWeight: 'bold' }"
      title="邮件分析结果"
      bordered
      :column="2"
    >
      <t-descriptions-item label="数据库记录ID">{{ analysisResult.verify_id || '-' }}</t-descriptions-item>
      <t-descriptions-item label="策略ID">{{ analysisResult.rule_id || '-' }}</t-descriptions-item>
      <t-descriptions-item label="是否垃圾邮件">{{ actionMap[analysisResult.label] || '-' }}</t-descriptions-item>
      <t-descriptions-item label="置信度">{{
        analysisResult.probability ? `${analysisResult.probability}%` : '-'
      }}</t-descriptions-item>
    </t-descriptions>
  </div>
</template>

<script>
import request from '@/utils/request';

export default {
  name: 'Analysis',
  components: {},
  data() {
    return {
      formData: {
        mail_title: '',
        mail_body: '',
      },
      rules: {
        mail_title: [{ required: true, message: '请输入邮件标题' }],
        mail_body: [{ required: true, message: '请输入邮件内容' }],
      },
      analysisResult: {
        verify_id: '',
        rule_id: '',
        label: '',
        probability: '',
      },
      actionMap: {
        ham: '正常邮件',
        spam: '垃圾邮件',
      },
    };
  },
  methods: {
    onSubmit({ validateResult }) {
      if (typeof validateResult === 'boolean' && validateResult) {
        request.post('/api/analysis', this.formData).then((res) => {
          this.$message.success('分析成功');
          this.analysisResult = res.data;
        });
      }
    },
    onReset() {
      this.formData = {
        mail_title: '',
        mail_body: '',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.analysis {
  padding: 16px;
  background-color: #fff;
}

.analysis-result {
  margin-top: 20px;
}
</style>
