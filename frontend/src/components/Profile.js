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
  const [areYouSure, setAreYouSure] = useState("");
  const [deleteButton, setDeleteButton] = useState("");
  const location = useLocation();
  const { logout } = useLogout();

  const handleAreYouSure = () => {
    setAreYouSure(
      <div className="areYouSureContainer">
        <div>Are you sure? This cannot be undone.</div>
        <div className="areYouSureButtonsContainer">
          <button className="areYouSureYes" onClick={handleDelete}>
            Delete my account
          </button>
          <button className="areYouSureNo" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  const handleCancel = () => {
    setAreYouSure("");
  };

  const handleDelete = async () => {
    //if signing up, add notes to local storage
    const noteIDsAndPatientNames = [];
    if (user.provider.notes.length > 0) {
      user.provider.notes.forEach((note) => {
        noteIDsAndPatientNames.push({
          name: note.patient,
          noteID: note.noteID,
        });
      });
    }
    const patientResponse = await fetch(
      "/api/patients/deleteMultiplePatientNotes",
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          noteIDsAndPatientNames,
        }),
      }
    );

    const providerResponse = await fetch(
      "/api/providers/deleteProviderAccount",
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          id: user.provider._id,
        }),
      }
    );
    //add error handling for responses
    logout();
  };

  useEffect(() => {
    if (!user) {
      logout();
    }

    const fetchUserInfo = async () => {
      const response = await fetch("/api/EMR/providers", {
        headers: { Authorization: `Bearer ${user.token}` }, //to ensure user is logged in when making reqest
      });
      const json = await response.json();

      if (response.ok) {
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
      if (user.guestInfo) {
        setDeleteButton("");
      } else if (
        user.provider &&
        location.pathname.includes(user.provider._id)
      ) {
        setDeleteButton(
          <button className="deleteAccountButton" onClick={handleAreYouSure}>
            Delete Account
          </button>
        );
      }
    }
  }, [location.pathname, user]);

  if (!firstName && !lastName) {
    //loading screen animation
    return (
      <div className="loadingScreen">
        <div className="lds-spinner">
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
      <div className="providerNameAndCredentialsContainer">
        <div className="providerNameAndCredentials">
          <h1>{`${firstName} ${lastName}`}</h1>
          <h2>{credentials}</h2>
          {deleteButton}
          <div className="sureContainer">{areYouSure}</div>
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
          {providerNotes.length === 0 && (
            <div className="zeroProfileNotes">* No Notes yet</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
