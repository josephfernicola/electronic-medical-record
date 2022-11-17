import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import { FaNotesMedical } from "react-icons/fa";

const Navbar = () => {
  const [currentUserId, setCurrentUserId] = useState("");
  const { logout } = useLogout();
  const { user } = useAuthContext();
  const [email, setEmail] = useState("");
  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const setUserID = async () => {
      if (user.provider) {
        const local = await JSON.parse(localStorage.getItem("user"));
        setCurrentUserId(local.provider._id);
      }
      else if (user.guestInfo) {
         const local = await JSON.parse(localStorage.getItem("user"));
          setCurrentUserId(local.token)
      }
    };
    const setUserEmail = async () => {
      if (user.guestInfo) {
        setEmail("Guest");
      } 
      else if (user.provider !== null) {
        const local = await JSON.parse(localStorage.getItem("user"));
        setEmail(local.provider.email);
      }
    };
    setUserID();
    setUserEmail();
  }, [user]);
  return (
    <header>
      <nav className="navbarContainer">
        <Link to="/">
          <div className="nobleAndLogo">
            <div>{<FaNotesMedical />}</div>
            <div className="navbarTitle">Noble</div>
          </div>
        </Link>
        {user.provider ? (
          <Link to={`/EMR/${currentUserId}`}>
            <div className="navbarTitle">Profile</div>
          </Link>
        ) : (
          <div className="empty"></div>
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
              <div className="navbarEmail">{email}</div>
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
      </nav>
    </header>
  );
};

export default Navbar;
