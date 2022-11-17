import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useGuestLogin } from "../hooks/useGuestLogin";

const LoginNavbar = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();
  const {guestLogin} = useGuestLogin();


  const loginAsGuest = async (e) => {
    e.preventDefault();
    console.log("Login as guest function")
    await guestLogin();

  };
  return (
    <nav className="loginNavbarContainer">
      {!user && (
        <div className="loginAndSignupContainer">
          <Link to="/login">Login</Link>
          <div className="guestLogin" onClick={loginAsGuest}>
            Continue as guest
          </div>
          <Link to="/signup">Signup</Link>
        </div>
      )}
    </nav>
  );
};

export default LoginNavbar;
