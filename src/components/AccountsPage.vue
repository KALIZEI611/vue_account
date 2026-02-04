<script setup lang="ts">
import AccountsTable from "./AccountsTable.vue";
</script>

<template>
  <div class="accounts-page">
    <div class="form-header">
      <h2>Учетные записи</h2>
      <button @click="$emit('add-account')" class="add-button">
        + Добавить учетную запись
      </button>
    </div>

    <AccountsTable />
  </div>
</template>

<style scoped>
.accounts-page {
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
</style>
