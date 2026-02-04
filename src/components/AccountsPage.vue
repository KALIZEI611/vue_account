<script setup lang="ts">
import { useAccountsStore } from "../stores/accounts";
import { canAddNewAccount } from "../utils/validation";
import AccountsTable from "./AccountsTable.vue";
import { computed } from "vue";

const accountsStore = useAccountsStore();

const canAddAccount = computed(() => {
  return canAddNewAccount(accountsStore.accounts);
});

const handleAddAccount = () => {
  if (canAddAccount.value) {
    accountsStore.addAccount();
  } else {
    alert(
      "Пожалуйста, заполните и проверьте текущие учетные записи перед созданием новой.",
    );
  }
};
</script>

<template>
  <div class="account-form">
    <div class="form-header">
      <h2>Учетные записи</h2>
      <button
        @click="handleAddAccount"
        class="add-button"
        :class="{ disabled: !canAddAccount }"
        :disabled="!canAddAccount"
      >
        + Добавить учетную запись
      </button>
    </div>

    <div class="hint">
      <strong>Подсказка для поля "Метка":</strong> Вводите текстовые метки,
      разделяя их знаком ; (точка с запятой)
    </div>

    <AccountsTable />
  </div>
</template>

<style scoped>
.warning-message {
  padding: 10px 15px;
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

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
  transition: all 0.3s;
}

.add-button:hover:not(.disabled) {
  background-color: #45a049;
}

.add-button.disabled:hover {
  background-color: #cccccc;
}

.add-button.disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.7;
}

.hint {
  background-color: #e9f1fa;
  border-left: 4px solid #4caf50;
  padding: 10px 15px;
  margin-bottom: 20px;
  font-size: 20px;
  color: #666;
}

@media (max-width: 1024px) {
  .account-form {
    padding: 15px;
  }

  .form-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .add-button {
    width: 100%;
  }

  .hint {
    font-size: 16px;
  }

  .warning-message {
    font-size: 13px;
    padding: 8px 12px;
  }
}

@media (max-width: 768px) {
  .account-form {
    padding: 10px;
  }

  .form-header h2 {
    font-size: 1.5rem;
  }

  .add-button {
    padding: 12px;
    font-size: 16px;
  }

  .hint {
    font-size: 14px;
    padding: 8px 12px;
  }

  .warning-message {
    font-size: 12px;
    padding: 8px 10px;
  }
}

@media (max-width: 480px) {
  .form-header h2 {
    font-size: 1.3rem;
  }

  .hint {
    font-size: 13px;
  }

  .warning-message {
    font-size: 11px;
  }
}
</style>
