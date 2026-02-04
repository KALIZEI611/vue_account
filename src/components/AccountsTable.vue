<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import useAccountsStore from "../stores/accounts";
import type { Account } from "../stores/accounts";
import AccountRow from "./AccountRow.vue";

const accountsStore = useAccountsStore();

const accountValidity = ref<Record<number, boolean>>({});

const accounts = computed(() => accountsStore.accounts);

const canAddAccount = computed(() => {
  return Object.values(accountValidity.value).every((isValid) => isValid);
});

const addAccount = () => {
  if (canAddAccount.value) {
    accountsStore.addAccount();
  } else {
    alert(
      "Пожалуйста, исправьте ошибки в существующих учетных записях перед добавлением новой.",
    );
  }
};

const removeAccount = (id: number) => {
  accountsStore.removeAccount(id);
  delete accountValidity.value[id];
};

const handleUpdateAccount = (id: number, updatedFields: Partial<Account>) => {
  accountsStore.updateAccount(id, updatedFields);
};

const handleValidateAccount = (account: Account, isValid: boolean) => {
  accountValidity.value[account.id] = isValid;
};

onMounted(() => {
  accountsStore.initFromStorage();
});
</script>

<template>
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
      @update:account="handleUpdateAccount"
      @remove="removeAccount"
      @validate="handleValidateAccount"
    />

    <div v-if="accounts.length === 0" class="no-accounts">
      Нет учетных записей. Нажмите "Добавить учетную запись", чтобы создать
      первую.
    </div>
  </div>
</template>

<style scoped>
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

.no-accounts {
  padding: 30px;
  text-align: center;
  color: #6c757d;
  font-style: italic;
  background-color: #f8f9fa;
  border: 1px dashed #dee2e6;
  margin-top: 10px;
  border-radius: 4px;
}

@media (max-width: 1024px) {
  .accounts-list {
    border: 1px solid #dee2e6;
    border-radius: 4px;
  }

  .table-header {
    display: none;
  }

  .no-accounts {
    margin: 0;
    border: none;
    border-top: 1px solid #dee2e6;
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .no-accounts {
    padding: 15px;
    font-size: 14px;
  }
}
</style>
