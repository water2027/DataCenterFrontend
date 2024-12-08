<script setup lang="ts">
import { ref } from 'vue';
import FormContainer from '@/components/FormContainer.vue';

import { useFormExam } from '@/composables/FormExam';
import { type CustomFormData } from '@/model/CustomFormData';
//Vue3的响应式api,用来创建响应式变量,form
//即当这个值变化了,就会自动重新渲染dom(即每个元素)
const form = ref<CustomFormData[]>([
  {
    id: 'email',
    label: 'email',
    value: '',
    type: 'email',
    autocomplete: 'email',
  },
  {
    id: 'password',
    label: 'password',
    value: '',
    type: 'password',
    autocomplete: 'current-password',
  },
]);

const { correct } = useFormExam(form);

const loginHandler = () => {};
</script>
<template>
  <FormContainer
    class="w-1/2 mt-11"
    :form-data="form"
    :disabled="!correct"
    @submit-form="loginHandler"
  >
  </FormContainer>
</template>
