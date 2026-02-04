<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useAccountsStore, type Account } from "../stores/accounts";

const accountsStore = useAccountsStore();

const accountErrors = ref<
  Record<number, Partial<Record<keyof Account, boolean>>>
>({});
const showPassword = ref<Record<number, boolean>>({});

const accounts = computed(() => accountsStore.accounts);

const addAccount = () => {
  accountsStore.addAccount();
};

const removeAccount = (id: number) => {
  accountsStore.removeAccount(id);
  delete accountErrors.value[id];
  delete showPassword.value[id];
};

const handleTypeChange = (account: Account) => {
  if (account.type === "LDAP") {
    account.password = null;
    delete showPassword.value[account.id];
  } else if (account.password === null) {
    account.password = "";
  }
  validateAccount(account);
};

const togglePasswordVisibility = (id: number) => {
  showPassword.value[id] = !showPassword.value[id];
};

const validateAccount = (account: Account) => {
  const errors: Partial<Record<keyof Account, boolean>> = {};

  if (!account.login.trim()) {
    errors.login = true;
  }

  if (account.type === "Локальная" && !account.password) {
    errors.password = true;
  }

  if (Object.keys(errors).length > 0) {
    accountErrors.value[account.id] = errors;
    return false;
  } else {
    delete accountErrors.value[account.id];

    accountsStore.updateAccount(account.id, {
      labels: account.labels,
      type: account.type,
      login: account.login,
      password: account.password,
    });

    accountsStore.saveToStorage();
    return true;
  }
};

onMounted(() => {
  accountsStore.initFromStorage();
});
</script>

<template>
  <div class="account-form">
    <div class="form-header">
      <h2>Учетные записи</h2>
      <button @click="addAccount" class="add-button">
        + Добавить учетную запись
      </button>
    </div>

    <div class="hint">
      <strong>Подсказка для поля "Метка":</strong> Вводите текстовые метки,
      разделяя их знаком ; (точка с запятой)
    </div>

    <div class="accounts-list">
      <div class="table-header">
        <div class="header-cell">Метки</div>
        <div class="header-cell">Тип записи</div>
        <div class="header-cell">Логин</div>
        <div class="header-cell">Пароль</div>
        <div class="header-cell actions">🗑</div>
      </div>

      <div
        v-for="account in accounts"
        :key="account.id"
        class="account-row"
        :class="{ 'invalid-row': accountErrors[account.id] }"
      >
        <div class="cell">
          <input
            v-model="account.labels"
            @blur="validateAccount(account)"
            type="text"
            placeholder="Введите метки через ;"
            :class="{ error: accountErrors[account.id]?.labels }"
            maxlength="50"
          />
          <div v-if="account.labelItems.length > 0" class="label-items">
            <span
              v-for="(item, idx) in account.labelItems"
              :key="idx"
              class="label-tag"
            >
              {{ item.text }}
            </span>
          </div>
        </div>

        <div class="cell">
          <select
            v-model="account.type"
            @change="handleTypeChange(account)"
            :class="{ error: accountErrors[account.id]?.type }"
          >
            <option value="Локальная">Локальная</option>
            <option value="LDAP">LDAP</option>
          </select>
        </div>

        <div class="cell">
          <input
            v-model="account.login"
            @blur="validateAccount(account)"
            type="text"
            placeholder="Обязательное поле"
            :class="{ error: accountErrors[account.id]?.login }"
            maxlength="100"
          />
        </div>

        <div class="cell password-cell">
          <div
            v-if="account.type === 'Локальная'"
            class="password-input-wrapper"
          >
            <input
              v-model="account.password"
              @blur="validateAccount(account)"
              :type="showPassword[account.id] ? 'text' : 'password'"
              placeholder="Обязательное поле"
              :class="{ error: accountErrors[account.id]?.password }"
              maxlength="100"
            />
            <button
              v-if="account.password"
              type="button"
              class="toggle-password"
              @click="togglePasswordVisibility(account.id)"
              :title="
                showPassword[account.id] ? 'Скрыть пароль' : 'Показать пароль'
              "
            >
              <svg
                v-if="showPassword[account.id]"
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

        <div class="cell actions">
          <button
            @click="removeAccount(account.id)"
            class="delete-button"
            title="Удалить учетную запись"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-form {
  font-family: Arial, sans-serif;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.form-header h2 {
  margin: 0;
  color: #333;
}

.add-button {
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.add-button:hover {
  background-color: #45a049;
}

.hint {
  background-color: #e9f1fa;
  border-left: 4px solid #4caf50;
  padding: 10px 15px;
  margin-bottom: 20px;
  font-size: 20px;
  color: #666;
}

.accounts-list {
  border-radius: 4px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 60px;
  font-weight: bold;
  color: #495057;
  border-bottom: 1px solid #dee2e6;
}

.header-cell {
  padding: 12px 15px;
  text-align: left;
}

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

input,
select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 16px;
  box-sizing: border-box;
}

.password-cell {
  position: relative;
}

.password-input-wrapper {
  position: relative;
}

.password-input-wrapper input {
  padding-right: 40px;
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

input.error,
select.error {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25);
}

input:focus,
select:focus {
  outline: none;
  border-color: #80bdff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
}

.label-items {
  margin-top: 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.label-tag {
  background-color: #e9ecef;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  color: #495057;
}

.password-hidden {
  color: #666;
  font-family: monospace;
  letter-spacing: 2px;
  display: block;
  padding: 9px 0;
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
  .table-header,
  .account-row {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .header-cell.actions {
    display: none;
  }

  .password-input-wrapper {
    width: 100%;
  }
}
</style>
