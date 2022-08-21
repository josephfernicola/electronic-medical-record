import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await login(email, password);
  };

  return (
    <div className="loginScreenContainer">
      <div className="background-image"></div>
      <div className="loginTitleContainer">
        <h1 className="loginTitle">
          Welcome to Noble Electronic Health Record System
        </h1>
        <h3>
          Less time spent on documentation, means more time for you to deliver quality care
        </h3>
      </div>
      <form className="login" onSubmit={handleSubmit}>
        <h3>Login</h3>
        <div>
          <label htmlFor="email"> Email:</label>
          <input
            type="email"
            name="email"
            autoComplete="off"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div>
          <label htmlFor="password"> Password:</label>
          <input
            type="password"
            name="password"
            autoComplete="off"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <button className="loginFormButton" type="submit" disabled={isLoading}>
          Log in
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  );
};

export default LoginScreen;
