import { useAuthContext } from "../hooks/useAuthContext";
import { useEffect, useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

const CompletedNote = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { dispatch } = useAuthContext();
  const [currentNote, setCurrentNote] = useState({});
  const [editNoteButton, setEditNoteButton] = useState("");
  const [deleteNoteButton, setDeleteNoteButton] = useState("");
  const [providerId, setProviderId] = useState("");
  const [patientId, setPatientId] = useState("");
  const { logout } = useLogout();

  useEffect(() => {
    if (!user) {
      logout();
    }
    const fetchProviderInfo = async () => {
      const response = await fetch("/api/EMR/providers", {
        headers: { Authorization: `Bearer ${user.token}` }, //to ensure user is logged in when making reqest
      });
      const json = await response.json();
      if (response.ok) {
        json.forEach(async function (provider) {
          if (location.pathname.includes(provider._id)) {
            provider.notes.forEach(async function (note) {
              if (location.pathname.includes(note.noteID)) {
                setCurrentNote(note);
                setProviderId(provider._id);
                if (
                  note.provider ===
                  user.provider.firstName + " " + user.provider.lastName
                ) {
                  // console.log(note.provider);
                  setEditNoteButton(
                    <button className="editNoteButton">Edit note</button>
                  );
                  setDeleteNoteButton(
                    <button className="deleteNoteButton">Delete note</button>
                  );
                }
              }
            });
          }
        });
      }
    };
    const fetchPatientInfo = async function () {
      const response = await fetch("/api/patients/getPatients", {
        headers: { Authorization: `Bearer ${user.token}` }, //to ensure user is logged in when making reqest
      });
      const json = await response.json();

      if (response.ok) {
        json.forEach(async function (patient) {
          patient.notes.forEach((note) => {
            if (location.pathname.includes(note.noteID)) {
              setPatientId(patient._id);
            }
          });
        });
      }
    };
    if (user) {
      fetchProviderInfo();
      fetchPatientInfo();
    }
  }, []);

  const handleDelete = async () => {
    const patientResponse = await fetch(
      `/api/patients/deletePatientNote/${patientId}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ noteID: `${currentNote.noteID}` }),
        method: "PATCH",
      }
    );
    const patientJson = await patientResponse.json();
    if (patientResponse.ok) {
      console.log(patientJson);
    }

    const providerResponse = await fetch(
      `/api/providers/deleteProviderNote/${providerId}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
        body: JSON.stringify({ noteID: `${currentNote.noteID}` }),
        method: "PATCH",
      }
    );
    const providerJson = await providerResponse.json();
    if (providerResponse.ok) {
      console.log(providerJson);
    }

    navigate(`/EMR/${user.provider._id}`);
  };

  if (
    !currentNote.patient &&
    !currentNote.subjective &&
    !currentNote.objective
  ) {
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
    <div className="currentNoteContainer">
      <div className="currentNoteInfo">
        <Link to={`/patient/${patientId}`}>
          <div className="patientNameOnNote">{currentNote.patient}</div>
        </Link>
        <div>
          <div className="soapTitle">Subjective:</div>{" "}
          <div className="soapContent">{currentNote.subjective}</div>
        </div>
        <div>
          <div className="soapTitle">Objective:</div>
          <div className="soapContent">{currentNote.objective}</div>
        </div>
        <div>
          <div className="soapTitle">Assessment:</div>{" "}
          <div className="soapContent">{currentNote.assessment}</div>
        </div>
        <div>
          <div className="soapTitle">Plan:</div>{" "}
          <div className="soapContent">{currentNote.plan}</div>
        </div>
        <div className="signedBy">
          Signed by: {currentNote.provider}, {currentNote.credentials} @{" "}
          {` ${currentNote.date} ${currentNote.time}`}
        </div>
      </div>
      <div className="editAndDeleteNoteButtonContainer">
        <Link
          to={`/editNote/${providerId}/${currentNote.noteID}`}
          state={{ currentNote: currentNote, providerId: providerId }}
        >
          <div className="editButtonContainer">{editNoteButton}</div>
        </Link>
        <div className="deleteButtonContainer" onClick={handleDelete}>
          {deleteNoteButton}
        </div>
      </div>
    </div>
  );
};

export default CompletedNote;
