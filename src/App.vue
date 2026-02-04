<script setup lang="ts">
import { provide } from "vue";
import AccountsPage from "./components/AccountsPage.vue";
import { useAccountsStore } from "./stores/accounts";

const accountsStore = useAccountsStore();

const handleAddAccount = () => {
  accountsStore.addAccount();
};
</script>

<template>
  <AccountsPage @add-account="handleAddAccount" />
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Arial, sans-serif;
  background-color: #f8f9fa;
}
</style>
