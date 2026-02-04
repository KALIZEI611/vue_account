<script setup lang="ts">
import { ref, watch } from "vue";
import type { Account } from "../stores/accounts";
import LabelsInput from "./LabelsInput.vue";
import AccountTypeSelect from "./AccountTypeSelect.vue";
import PasswordInput from "./PasswordInput.vue";

interface Props {
  account: Account;
  errors?: Partial<Record<keyof Account, boolean>>;
}

interface Emits {
  (e: "update:account", id: number, updatedFields: Partial<Account>): void;
  (e: "remove", id: number): void;
  (e: "validate", account: Account): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const previousPassword = ref<string | null>(null);

watch(
  () => props.account.type,
  (newType, oldType) => {
    if (newType === "Локальная" && oldType === "LDAP") {
      const restoredPassword = previousPassword.value || "";
      emit("update:account", props.account.id, {
        password: restoredPassword,
      });
    } else if (newType === "LDAP" && oldType === "Локальная") {
      previousPassword.value = props.account.password;
      emit("update:account", props.account.id, {
        password: null,
      });
    }
  },
);

const handleLabelsChange = (value: string) => {
  emit("update:account", props.account.id, { labels: value });
};

const handleLoginChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:account", props.account.id, { login: target.value });
};

const handlePasswordChange = (value: string | null) => {
  emit("update:account", props.account.id, { password: value });

  // Если меняем пароль у локальной учетной записи - сохраняем его
  if (props.account.type === "Локальная") {
    previousPassword.value = value;
  }
};

const handleBlur = () => {
  emit("validate", props.account);
};

const handleRemove = () => {
  emit("remove", props.account.id);
};
</script>

<template>
  <div class="account-row" :class="{ 'invalid-row': errors }">
    <div class="cell">
      <LabelsInput
        v-model="account.labels"
        :label-items="account.labelItems"
        :error="errors?.labels"
        @update:model-value="handleLabelsChange"
        @blur="handleBlur"
      />
    </div>

    <div class="cell">
      <AccountTypeSelect
        v-model="account.type"
        :error="errors?.type"
        @update:model-value="
          (value) => emit('update:account', account.id, { type: value })
        "
      />
    </div>

    <div class="cell">
      <input
        :value="account.login"
        @input="handleLoginChange"
        @blur="handleBlur"
        type="text"
        placeholder="Обязательное поле"
        :class="{ error: errors?.login }"
        maxlength="100"
      />
    </div>

    <div class="cell">
      <PasswordInput
        :model-value="account.password"
        :error="errors?.password"
        :is-local-account="account.type === 'Локальная'"
        @update:model-value="handlePasswordChange"
        @blur="handleBlur"
      />
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
</template>

<style scoped>
.account-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 60px;
  padding: 15px 0;
  align-items: start;
}

.invalid-row {
  background-color: #fff5f5;
}

.cell {
  padding: 0 15px;
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

@media (max-width: 1024px) {
  .account-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }
}
</style>
