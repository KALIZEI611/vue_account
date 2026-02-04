<script setup lang="ts">
import { useAccountsStore } from "../stores/accounts";
import AccountsTable from "./AccountsTable.vue";

const accountsStore = useAccountsStore();

const handleAddAccount = () => {
  accountsStore.addAccount();
};
</script>

<template>
  <div class="account-form">
    <div class="form-header">
      <h2>Учетные записи</h2>
      <button @click="handleAddAccount" class="add-button">
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
}

@media (max-width: 480px) {
  .form-header h2 {
    font-size: 1.3rem;
  }

  .hint {
    font-size: 13px;
  }
}
</style>
