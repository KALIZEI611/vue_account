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

  const loginRegex = /^[a-zA-Z0-9._-]+$/;
  if (!loginRegex.test(login)) {
    return "Логин может содержать только буквы, цифры, точки, дефисы и подчеркивания";
  }

  return null;
};

export const validatePassword = (
  password: string | null,
  isLocalAccount: boolean,
): string | null => {
  if (!isLocalAccount) {
    return null;
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

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return "Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру";
  }

  return null;
};

export interface Account {
  id: number;
  labels: string;
  labelItems: { text: string }[];
  type: "LDAP" | "Локальная";
  login: string;
  password: string | null;
}

export const validateAccount = (account: Account): Record<string, string> => {
  const errors: Record<string, string> = {};

  const loginError = validateLogin(account.login);
  if (loginError) {
    errors.login = loginError;
  }

  const passwordError = validatePassword(
    account.password,
    account.type === "Локальная",
  );
  if (passwordError) {
    errors.password = passwordError;
  }

  return errors;
};

export const isAccountValid = (account: Account): boolean => {
  const errors = validateAccount(account);
  return Object.keys(errors).length === 0;
};

export const isEmptyAccount = (account: Account): boolean => {
  return (
    account.login.trim() === "" &&
    (account.password === null || account.password === "")
  );
};

export const canAddNewAccount = (accounts: Account[]): boolean => {
  if (accounts.length === 0) {
    return true;
  }

  const allValid = accounts.every(isAccountValid);
  const noEmptyAccounts = !accounts.some(isEmptyAccount);

  return allValid && noEmptyAccounts;
};
