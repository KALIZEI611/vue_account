<script setup lang="ts">
import type { Account } from "../stores/accounts";

interface Props {
  modelValue: Account["type"];
  error?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: Account["type"]): void;
  (e: "change"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit("update:modelValue", target.value as Account["type"]);
  emit("change");
};
</script>

<template>
  <select :value="modelValue" @change="handleChange" :class="{ error }">
    <option value="Локальная">Локальная</option>
    <option value="LDAP">LDAP</option>
  </select>
</template>

<style scoped>
select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
  cursor: pointer;
}

select.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
}

select:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}
</style>
