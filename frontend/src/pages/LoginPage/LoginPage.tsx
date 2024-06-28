import { Login } from "../../components/Login/Login";
import "./LoginPage.scss";

export const LoginPage = () => {
  return (
    <div className="main-container">
      <h1>Sign in</h1>
      <div className="login-form-c div-card">
        <Login />
      </div>
    </div>
  );
};
