type loginFormProps = {
  email: string;
  password: string;
};

export const useLoginFormErrors = ({ email, password }: loginFormProps) => {
  const loginErrorValues = {
    emailError: "",
    passwordError: "",
    badCredentialsError: "",
  };

  if (email.length === 0) {
    loginErrorValues.emailError = "Email field cannot be empty";
  } else {
    loginErrorValues.emailError = "";
  }

  if (password.length === 0) {
    loginErrorValues.passwordError = "Password field cannot be empty";
  } else {
    loginErrorValues.passwordError = "";
  }

  return loginErrorValues;
};
