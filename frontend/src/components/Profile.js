import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLocation, Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

const Profile = () => {
  const { user } = useAuthContext();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [credentials, setCredentials] = useState("");
  const [providerNotes, setProviderNotes] = useState([]);
  const [providerId, setProviderId] = useState("");
  const location = useLocation();
  const { logout } = useLogout();

  useEffect(() => {
    if (!user) {
      //setError("You must be logged in");
      return;
    }
    const fetchUserInfo = async () => {
      //console.log(user.token)
      const response = await fetch("/api/EMR/providers", {
        headers: { Authorization: `Bearer ${user.token}` }, //to ensure user is logged in when making reqest
      });
      const json = await response.json();

      if (response.ok) {
        //setAllProviders(json);
        json.forEach((provider) => {
          if (location.pathname.includes(provider._id)) {
            setFirstName(provider.firstName);
            setLastName(provider.lastName);
            setCredentials(provider.credentials);
            setProviderId(provider._id);
            setProviderNotes(provider.notes);
          }
        });
      }
      if (!response.ok) {
        logout();
      }
    };
    if (user) {
      fetchUserInfo();
      //setError(null);
    }
  }, [location.pathname]);

  if (!firstName && !lastName) {
    return (
      <div className="loadingScreen">
        <div class="lds-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }
  return (
    <div className="providerProfileContainer">
      <div className="profilePicAndProviderInfo">
        {/* <div>Picture here</div> */}
        <div className="providerNameAndCredentials">
          <h1>{`${firstName} ${lastName}`}</h1>
          <h2>{credentials}</h2>
        </div>
      </div>
      <div className="providerProfileNotesContainer">
        <div className="providerNotesTitle">
          {`${firstName} ${lastName}`}'s Notes (Ordered by most recent)
        </div>
        <div className="noteListingContainer">
          {providerNotes
            .slice(0)
            .reverse()
            .map((note, index) => (
              <div key={index} className="noteListing">
                <Link to={`/completedNote/${providerId}/${note.noteID}`}>
                  <div className="noteListingContent">{`${note.patient} ${note.date} ${note.time}`}</div>
                </Link>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
