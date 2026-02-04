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
}

export const useAccountsStore = defineStore("accounts", () => {
  const accounts = ref<Account[]>([
    {
      id: 1,
      labels: "XXX",
      labelItems: [{ text: "XXX" }],
      type: "Локальная",
      login: "Значение",
      password: "●●●●●●",
    },
    {
      id: 2,
      labels: "XXX; YYYYYYYYYY; IIIIIIII; MMMMMMMM",
      labelItems: [
        { text: "XXX" },
        { text: "YYYYYYYYYY" },
        { text: "IIIIIIII" },
        { text: "MMMMMMMM" },
      ],
      type: "Локальная",
      login: "Значение",
      password: "●●●●●●",
    },
    {
      id: 3,
      labels: "XXX",
      labelItems: [{ text: "XXX" }],
      type: "Локальная",
      login: "Значение",
      password: "●●●●●●",
    },
    {
      id: 4,
      labels: "Значение",
      labelItems: [{ text: "Значение" }],
      type: "LDAP",
      login: "Значение",
      password: null,
    },
    {
      id: 5,
      labels: "Значение",
      labelItems: [{ text: "Значение" }],
      type: "LDAP",
      login: "Значение",
      password: null,
    },
  ]);

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
  };

  const updateAccount = (id: number, updatedFields: Partial<Account>) => {
    const index = accounts.value.findIndex((acc) => acc.id === id);
    if (index !== -1) {
      const account = accounts.value[index];

      if (updatedFields.labels !== undefined) {
        const labelItems = updatedFields.labels
          .split(";")
          .map((label) => label.trim())
          .filter((label) => label.length > 0)
          .map((text) => ({ text }));

        accounts.value[index] = {
          ...account,
          ...updatedFields,
          labelItems,
        };
      } else {
        accounts.value[index] = {
          ...account,
          ...updatedFields,
        };
      }

      // Сохраняем изменения в localStorage
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
