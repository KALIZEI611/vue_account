<script setup lang="ts">
import { ref, watch, computed } from "vue";
import type { Account } from "../stores/accounts";
import { validateLogin, validatePassword } from "../stores/accounts";
import LabelsInput from "./LabelsInput.vue";
import AccountTypeSelect from "./AccountTypeSelect.vue";
import PasswordInput from "./PasswordInput.vue";
import ValidationMessage from "./ValidationMessage.vue";

interface Props {
  account: Account;
}

interface Emits {
  (e: "update:account", id: number, updatedFields: Partial<Account>): void;
  (e: "remove", id: number): void;
  (e: "validate", account: Account, isValid: boolean): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const validationMessages = ref<Record<string, string>>({});

const validationErrors = computed(() => {
  const errors: Record<string, string> = {};

  const loginError = validateLogin(props.account.login);
  if (loginError) {
    errors.login = loginError;
  }

  const passwordError = validatePassword(
    props.account.password,
    props.account.type === "Локальная",
  );
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
});

watch(
  validationErrors,
  (newErrors) => {
    validationMessages.value = newErrors;

    const isValid = Object.keys(newErrors).length === 0;
    emit("validate", props.account, isValid);
  },
  { immediate: true },
);

const handleLabelsChange = (value: string) => {
  emit("update:account", props.account.id, { labels: value });
};

const handleLoginChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const newLogin = target.value;

  emit("update:account", props.account.id, { login: newLogin });
};

const handlePasswordChange = (value: string | null) => {
  emit("update:account", props.account.id, { password: value });
};

const handleTypeChange = (value: Account["type"]) => {
  emit("update:account", props.account.id, { type: value });
};

const handleBlur = () => {
  const errors = validationErrors.value;
  const isValid = Object.keys(errors).length === 0;
  emit("validate", props.account, isValid);
};

const handleRemove = () => {
  emit("remove", props.account.id);
};
</script>

<template>
  <div
    class="account-row desktop-row"
    :class="{ 'invalid-row': Object.keys(validationMessages).length > 0 }"
  >
    <div class="cell">
      <LabelsInput
        v-model="account.labels"
        :label-items="account.labelItems"
        @update:model-value="handleLabelsChange"
        @blur="handleBlur"
      />
    </div>

    <div class="cell">
      <AccountTypeSelect
        v-model="account.type"
        @update:model-value="handleTypeChange"
      />
    </div>

    <div class="cell">
      <div class="input-with-validation">
        <input
          :value="account.login"
          @input="handleLoginChange"
          @blur="handleBlur"
          type="text"
          placeholder="Обязательное поле"
          :class="{ error: validationMessages.login }"
          maxlength="50"
        />
        <ValidationMessage
          v-if="validationMessages.login"
          :message="validationMessages.login"
          type="error"
        />
      </div>
    </div>

    <div class="cell">
      <div class="input-with-validation">
        <PasswordInput
          :model-value="account.password"
          :error="!!validationMessages.password"
          :is-local-account="account.type === 'Локальная'"
          @update:model-value="handlePasswordChange"
          @blur="handleBlur"
        />
        <ValidationMessage
          v-if="validationMessages.password"
          :message="validationMessages.password"
          type="error"
        />
      </div>
    </div>

    <div class="cell actions">
      <button
        @click="handleRemove"
        class="delete-button"
        title="Удалить учетную запись"
      >
        ×
      </button>
    </div>
  </div>

  <div
    class="account-card mobile-card"
    :class="{ 'invalid-row': Object.keys(validationMessages).length > 0 }"
  >
    <div class="card-row">
      <div class="card-label">Метки:</div>
      <div class="card-value">
        <LabelsInput
          v-model="account.labels"
          :label-items="account.labelItems"
          @update:model-value="handleLabelsChange"
          @blur="handleBlur"
          compact
        />
      </div>
    </div>

    <div class="card-row">
      <div class="card-label">Тип:</div>
      <div class="card-value">
        <AccountTypeSelect
          v-model="account.type"
          @update:model-value="handleTypeChange"
        />
      </div>
    </div>

    <div class="card-row">
      <div class="card-label">Логин:</div>
      <div class="card-value">
        <div class="input-with-validation">
          <input
            :value="account.login"
            @input="handleLoginChange"
            @blur="handleBlur"
            type="text"
            placeholder="Обязательное поле"
            :class="{ error: validationMessages.login }"
            maxlength="50"
          />
          <ValidationMessage
            v-if="validationMessages.login"
            :message="validationMessages.login"
            type="error"
          />
        </div>
      </div>
    </div>

    <div class="card-row">
      <div class="card-label">Пароль:</div>
      <div class="card-value">
        <div class="input-with-validation">
          <PasswordInput
            :model-value="account.password"
            :error="!!validationMessages.password"
            :is-local-account="account.type === 'Локальная'"
            @update:model-value="handlePasswordChange"
            @blur="handleBlur"
          />
          <ValidationMessage
            v-if="validationMessages.password"
            :message="validationMessages.password"
            type="error"
          />
        </div>
      </div>
    </div>

    <div class="card-actions">
      <button
        @click="handleRemove"
        class="delete-button"
        title="Удалить учетную запись"
      >
        Удалить
      </button>
    </div>
  </div>
</template>

<style scoped>
.account-row.desktop-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 60px;
  padding: 15px 0;
  align-items: start;
  border-bottom: 1px solid #dee2e6;
}

.invalid-row {
  background-color: #fff5f5;
}

.cell {
  padding: 0 15px;
}

.input-with-validation {
  width: 100%;
}

input {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

input.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
}

input:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.actions {
  text-align: center;
}

.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  transition: background-color 0.3s;
}

.delete-button:hover {
  background-color: #c82333;
}

.account-card.mobile-card {
  display: none;
  padding: 15px;
  border-bottom: 1px solid #dee2e6;
}

.account-card.mobile-card .delete-button {
  width: auto;
  height: auto;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  margin-top: 10px;
}

.card-row {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
  gap: 5px;
}

.card-label {
  font-weight: 600;
  color: #495057;
  font-size: 14px;
}

.card-value {
  width: 100%;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

@media (max-width: 1024px) {
  .account-row.desktop-row {
    display: none;
  }

  .account-card.mobile-card {
    display: block;
  }
}

@media (max-width: 480px) {
  .account-card.mobile-card {
    padding: 12px;
  }

  .card-row {
    margin-bottom: 12px;
  }

  input {
    padding: 10px;
    font-size: 16px; 
  }
}
</style>
