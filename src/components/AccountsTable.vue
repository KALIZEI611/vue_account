<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useAccountsStore, type Account } from "../stores/accounts";
import AccountRow from "./AccountRow.vue";

const accountsStore = useAccountsStore();

const accountErrors = ref<
  Record<number, Partial<Record<keyof Account, boolean>>>
>({});

const accounts = computed(() => accountsStore.accounts);

const addAccount = () => {
  accountsStore.addAccount();
};

const removeAccount = (id: number) => {
  accountsStore.removeAccount(id);
  delete accountErrors.value[id];
};

const handleUpdateAccount = (id: number, updatedFields: Partial<Account>) => {
  accountsStore.updateAccount(id, updatedFields);
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
    return true;
  }
};

onMounted(() => {
  accountsStore.initFromStorage();
});
</script>

<template>
  <div class="accounts-table">
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

      <AccountRow
        v-for="account in accounts"
        :key="account.id"
        :account="account"
        :errors="accountErrors[account.id]"
        @update:account="handleUpdateAccount"
        @remove="removeAccount"
        @validate="validateAccount"
      />
    </div>
  </div>
</template>

<style scoped>
.accounts-table {
  font-family: Arial, sans-serif;
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

.header-cell.actions {
  text-align: center;
}

@media (max-width: 1024px) {
  .table-header {
    display: none;
  }
}
</style>
