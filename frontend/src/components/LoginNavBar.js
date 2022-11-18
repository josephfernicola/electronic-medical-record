import { Link } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { useGuestLogin } from "../hooks/useGuestLogin";

const LoginNavbar = () => {
  const { user } = useAuthContext();
  const { guestLogin, error, isLoading } = useGuestLogin();

  const loginAsGuest = async () => {
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
