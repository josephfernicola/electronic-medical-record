import { Link } from "react-router-dom";

import { useAuthContext } from "../hooks/useAuthContext";

const LoginNavbar = () => {
  const { user } = useAuthContext();


  return (
    <div className="loginNavbarContainer">
      {!user && (
        <div className="loginAndSignupContainer">
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </div>
      )}
    </div>
  );
};

export default LoginNavbar;
