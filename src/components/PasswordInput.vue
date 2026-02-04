<script setup lang="ts">
import { ref, computed } from "vue";

interface Props {
  modelValue: string | null;
  placeholder?: string;
  error?: boolean;
  disabled?: boolean;
  isLocalAccount?: boolean;
}

interface Emits {
  (e: "update:modelValue", value: string | null): void;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Обязательное поле",
  error: false,
  disabled: false,
  isLocalAccount: true,
});

const emit = defineEmits<Emits>();
const showPassword = ref(false);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:modelValue", target.value);
};
</script>

<template>
  <div class="password-cell">
    <div v-if="isLocalAccount" class="password-input-wrapper">
      <input
        :value="modelValue || ''"
        @input="handleInput"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="placeholder"
        :class="{ error }"
        :disabled="disabled"
        maxlength="100"
      />
      <button
        v-if="modelValue"
        type="button"
        class="toggle-password"
        @click="togglePasswordVisibility"
        :title="showPassword ? 'Скрыть пароль' : 'Показать пароль'"
      >
        <svg
          v-if="showPassword"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <svg
          v-else
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path
            d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
          ></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      </button>
    </div>
    <span v-else class="password-hidden">●●●●●●</span>
  </div>
</template>

<style scoped>
.password-cell {
  position: relative;
}

.password-input-wrapper {
  position: relative;
}

.password-input-wrapper input {
  width: 100%;
  padding: 8px 10px;
  padding-right: 40px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.password-input-wrapper input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
}

.password-input-wrapper input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.toggle-password {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.toggle-password:hover {
  background-color: #f0f0f0;
  color: #333;
}

.password-hidden {
  color: #666;
  font-family: monospace;
  letter-spacing: 2px;
  display: block;
  padding: 9px 0;
}
</style>
