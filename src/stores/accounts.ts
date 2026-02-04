import { defineStore } from "pinia";
import { ref, computed } from "vue";

export interface LabelItem {
  text: string;
}

export interface Account {
  id: number;
  labels: string;
  labelItems: LabelItem[];
  type: "LDAP" | "Локальная";
  login: string;
  password: string | null;
  cachedPassword?: string | null;
}

export const useAccountsStore = defineStore("accounts", () => {
  const accounts = ref<Account[]>([]);

  const accountsCount = computed(() => accounts.value.length);

  const addAccount = () => {
    const newAccount: Account = {
      id: Date.now(),
      labels: "",
      labelItems: [],
      type: "Локальная",
      login: "",
      password: "",
    };
    accounts.value.push(newAccount);
    saveToStorage();
  };

  const updateAccount = (id: number, updatedFields: Partial<Account>) => {
    const index = accounts.value.findIndex((acc) => acc.id === id);
    if (index !== -1) {
      const account = accounts.value[index];

      let updatedAccount: Account;

      if (updatedFields.labels !== undefined) {
        const labelItems = updatedFields.labels
          .split(";")
          .map((label) => label.trim())
          .filter((label) => label.length > 0)
          .map((text) => ({ text }));

        updatedAccount = {
          ...account,
          ...updatedFields,
          labelItems,
        } as Account;
      } else {
        updatedAccount = {
          ...account,
          ...updatedFields,
        } as Account;
      }

      accounts.value[index] = updatedAccount;
      saveToStorage();
    }
  };

  const removeAccount = (id: number) => {
    const index = accounts.value.findIndex((acc) => acc.id === id);
    if (index !== -1) {
      accounts.value.splice(index, 1);
      saveToStorage();
    }
  };

  const initFromStorage = () => {
    const saved = localStorage.getItem("accounts");
    if (saved) {
      try {
        accounts.value = JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved accounts", e);
      }
    }
  };

  const saveToStorage = () => {
    localStorage.setItem("accounts", JSON.stringify(accounts.value));
  };

  return {
    accounts,
    accountsCount,
    addAccount,
    updateAccount,
    removeAccount,
    initFromStorage,
    saveToStorage,
  };
});

export default useAccountsStore;
