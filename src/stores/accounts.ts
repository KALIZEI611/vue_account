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

// Функция валидации логина
export const validateLogin = (login: string): string | null => {
  if (!login.trim()) {
    return "Логин обязателен для заполнения";
  }

  if (login.length < 3) {
    return "Логин должен содержать минимум 3 символа";
  }

  if (login.length > 50) {
    return "Логин не должен превышать 50 символов";
  }

  // Проверка на допустимые символы (только буквы, цифры, точки, дефисы, подчеркивания)
  const loginRegex = /^[a-zA-Z0-9._-]+$/;
  if (!loginRegex.test(login)) {
    return "Логин может содержать только буквы, цифры, точки, дефисы и подчеркивания";
  }

  return null;
};

// Функция валидации пароля
export const validatePassword = (
  password: string | null,
  isLocalAccount: boolean,
): string | null => {
  if (!isLocalAccount) {
    return null; // Для LDAP пароль не требуется
  }

  if (!password) {
    return "Пароль обязателен для локальных учетных записей";
  }

  if (password.length < 6) {
    return "Пароль должен содержать минимум 6 символов";
  }

  if (password.length > 100) {
    return "Пароль не должен превышать 100 символов";
  }

  // Проверка на сложность пароля (опционально)
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return "Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру";
  }

  return null;
};

// Хранилище
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
    saveToStorage();
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

// Экспорт по умолчанию для совместимости
export default useAccountsStore;
