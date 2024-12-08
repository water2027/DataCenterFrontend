import { computed, type Ref } from 'vue';
// 表单名与检验正则
// 如果检验正则为空，则默认检测是否全为空格
import { type CustomFormData } from '@/model/CustomFormData';
export const useFormExam = (formData: Ref<CustomFormData[]>) => {
  const correct = computed<boolean>(() => {
    if (!Array.isArray(formData.value)) return false;
    for (const item of formData.value) {
      if (item.reg) {
        if (!item.reg.test(item.value)) {
          return false;
        }
      } else {
        if (item.value.trim() === '') {
          return false;
        }
      }
    }
    return true;
  });

  return {
    correct,
  };
};