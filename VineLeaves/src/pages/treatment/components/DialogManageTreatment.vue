<template>
  <t-dialog :header="isEdit ? '编辑治疗方案' : '新建治疗方案'" :visible.sync="formVisible" :width="680" :footer="false">
    <div slot="body">
      <t-form :data="formData" ref="form" :rules="rules" @submit="onSubmit" :labelWidth="100">
        <t-form-item label="植株症状" name="disease_name" v-if="!isEdit">
          <t-select :style="{ width: '480px' }" v-model="formData.disease_name" placeholder="请选择植株症状">
            <t-option v-for="item in options" :key="item.value" :value="item.value" :label="item.name"></t-option>
          </t-select>
        </t-form-item>
        <t-form-item label="治疗方案" name="treatment">
          <t-textarea
            :style="{ width: '480px' }"
            v-model="formData.treatment"
            placeholder="请输入治疗方案"
          ></t-textarea>
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
  name: 'DialogManageTreatment',
  props: {
    isEdit: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      initialData: {
        disease_name: '',
        treatment: '',
      },
      formData: {},
      options: [
        { name: '黑腐病', value: 'Black_rot' },
        { name: '霜霉病', value: 'Downey_mildew' },
        { name: '​​埃斯卡病​​', value: 'Esca' },
        { name: '健康', value: 'Healthy' },
        { name: '枯萎病', value: 'Leaf_blight' },
      ],
      rules: {
        disease_name: [{ required: true, message: '请选择植株症状' }],
        treatment: [{ required: true, message: '请输入治疗方案' }],
      },
      formVisible: false,
    };
  },
  methods: {
    ...mapActions('treatment', ['addTreatment', 'editTreatment']),
    show(treatmentInfo) {
      this.formVisible = true;
      this.$refs.form.clearValidate();
      this.formData = treatmentInfo ? { ...treatmentInfo } : { ...this.initialData };
    },
    onClickCloseBtn() {
      this.formVisible = false;
    },
    async onSubmit() {
      await (this.isEdit ? this.editTreatment(this.formData) : this.addTreatment(this.formData));

      this.onClickCloseBtn();
      this.$emit('submit');
    },
  },
};
</script>

<style lang="scss" scoped></style>
