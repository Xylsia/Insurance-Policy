import { useState, useContext, FormEvent, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { PrimaryButton } from "../common/Button/PrimaryButton";
import { useLoginFormErrors } from "./useLoginFormErrors";
import { URL } from "../../constants";
import "./Login.scss";
import { fetchWrapper } from "../../utils/fetchWrapper";

const initLoginErrors = {
  emailError: "",
  passwordError: "",
  badCredentialsError: "",
};

export const Login = () => {
  const navigate = useNavigate();
  const { handleLogin } = useContext(AuthContext);
  const { setSnackbar } = useContext(SnackbarContext);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState(initLoginErrors);

  const loginErrorCheck = useLoginFormErrors({ email, password });

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    switch (name) {
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const isInvalid = Object.values(loginErrorCheck).some((error) => error !== "");

    if (isInvalid) {
      setError(loginErrorCheck);
    } else {
      const formData = {
        email: email,
        password: password,
      };

      try {
        const response = await fetchWrapper({
          url: `${URL}agent/login`,
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          setSnackbar("error", errorData.message || "Network response error");
          return;
        }

        const data: any = await response.json();
        console.log(`agent/list response:\n`, data);
        handleLogin(data.token);
        navigate("/dashboard");
        setSnackbar("success", `Logged in successfully`);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError((errors) => ({
            ...errors,
            badCredentialsError: "Invalid login credentials",
          }));
        } else {
          setSnackbar("error", "An unexpected error occured");
        }
      }
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="login-form" data-testid="login-form">
      {error.badCredentialsError && (
        <div className="error-div">
          <span>{error.badCredentialsError}</span>
        </div>
      )}
      <div className="login-form-elem">
        <input
          type="text"
          placeholder="Enter email..."
          name="email"
          value={email}
          onChange={handleInputChange}
          className={`${error.emailError ? "required-border" : ""}`}
        />
        {error.emailError && <span className="required">{error.emailError}</span>}
      </div>
      <div className="login-form-elem">
        <input
          type="password"
          placeholder="EnterPassword..."
          name="password"
          value={password}
          onChange={handleInputChange}
          className={`${error.passwordError ? "required-border" : ""}`}
        />
        {error.passwordError && <span className="required">{error.passwordError}</span>}
      </div>
      <PrimaryButton type="submit" style="btn btn-primary" text="Login" />
    </form>
  );
};
