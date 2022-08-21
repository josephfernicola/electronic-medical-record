import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import { FaNotesMedical } from "react-icons/fa";

const Navbar = () => {
  const [currentUserId, setCurrentUserId] = useState("");
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const setUserID = async () => {
      if (user) {
        const local = await JSON.parse(localStorage.getItem("user"));
        setCurrentUserId(local.provider._id);
      }
    };
    setUserID();
  }, [user]);
  return (
    <header>
      <div className="navbarContainer">
        <Link to="/">
          <div className="nobleAndLogo">
            <div>{<FaNotesMedical />}</div>
            <div className="navbarTitle">Noble</div>
          </div>
        </Link>
        {user ? (
          <Link to={`/EMR/${currentUserId}`}>
            <div className="navbarTitle">Profile</div>
          </Link>
        ) : (
          <Link to="/">
            <div className="navbarTitle">Profile</div>
          </Link>
        )}
        <Link to="/EMR/providers">
          <div className="navbarTitle">Providers</div>
        </Link>
        <Link to="/EMR/allPatients">
          <div className="navbarTitle">Patients</div>
        </Link>
        <nav>
          {user && (
            <div className="emailAndLogOutContainer">
              <div className="navbarEmail">{user.provider.email}</div>
              <button onClick={handleLogout} className="logout">
                Log Out
              </button>
            </div>
          )}
          {!user && (
            <div className="loginAndSignupContainer">
              <Link to="/EMR/login">Login</Link>
              <Link to="/EMR/signup">Signup</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
