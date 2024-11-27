export const validateEmail = (email) => {
  if (!email) return "E-mail é obrigatório.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? "" : "E-mail inválido.";
};

export const validateName = (name) => {
  if (!name) return "Nome é obrigatório.";
  return name.length > 0 ? "" : "Nome é obrigatório.";
};

export const validatePassword = (password) => {
  if (!password) return "Senha é obrigatória.";
  return password.length >= 6
    ? ""
    : "A senha deve ter pelo menos 6 caracteres.";
};

export const validateForm = ({ email, name, password }) => {
  return {
    email: validateEmail(email),
    name: validateName(name),
    password: validatePassword(password),
  };
};
