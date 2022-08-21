import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useLocation, Link, useNavigate } from "react-router-dom";

const PatientProfile = () => {
  const { user } = useAuthContext();
  const [name, setName] = useState("");
  const [pmh, setpmh] = useState([]);
  const [age, setAge] = useState("");
  const [allergies, setAllergies] = useState([]);
  const [notes, setNotes] = useState([]);
  const [patientId, setPatientId] = useState("");
  const [providerName, setProviderName] = useState("");
  const [providerId, setProviderId] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      //setError("You must be logged in");
      return;
    }
    const fetchPatientInfo = async () => {
      const response = await fetch("/api/patients/getPatients", {
        headers: { Authorization: `Bearer ${user.token}` }, //to ensure user is logged in when making reqest
      });
      const json = await response.json();

      if (response.ok) {
        json.forEach((patient) => {
          if (location.pathname.includes(patient._id)) {
            setName(patient.name);
            setpmh(patient.pmh);
            setNotes(patient.notes);
            setPatientId(patient._id);
            setAge(patient.age);
            setAllergies(patient.allergies);
          }
        });
      }
    };
    if (user) {
      fetchPatientInfo();
      //setError(null);
    }
  }, []);

  const handleNoteClick = (id) => {
    const fetchProviderInfo = async () => {
      const response = await fetch("/api/EMR/providers", {
        headers: { Authorization: `Bearer ${user.token}` }, //to ensure user is logged in when making reqest
      });
      const json = await response.json();

      if (response.ok) {
        json.forEach((provider) => {
          provider.notes.forEach((note) => {
            if (note.noteID === id) {
              navigate(`/completedNote/${provider._id}/${id}`);
            }
          });
        });
      }
    };
    fetchProviderInfo();
  };

  return (
    <div className="patientProfileContainer">
      <div className="patientProfileInfo">
        <div className="patientProfileName">{`${name}`}</div>
        <div className="patientProfileAge">Age: {age}</div>
        <Link
          to={`/notes/${patientId}`}
          state={{
            name: name,
            pmh: pmh,
            patientId: patientId,
            age: age,
            allergies: allergies,
          }}
        >
          <button className="addPatientNoteButton">Add Note for {name}</button>
        </Link>
        <h3>Past Medical History</h3>
        {pmh.map((condition, index) => (
          <div className="pmhCondition" key={index}>
            <span>{`${condition.disease} ${condition.icd}`}</span>
          </div>
        ))}
        <h3>Allergies</h3>
        {allergies.map((allergy, index) => (
          <div className="patientProfileAllergy" key={index}>
            <div>{allergy}</div>
          </div>
        ))}

        <h3>
          Patient Notes{" "}
          <span className="orderedByTitle">(Ordered by most recent)</span>
        </h3>

        {notes
          .slice(0)
          .reverse()
          .map((note, index) => (
            <div className="patientProfileNotesContainer" key={index}>
              <div
                className="patientProfileNote"
                onClick={() => handleNoteClick(note.noteID)}
              >{`${note.provider}, ${note.credentials}   ${note.date} ${note.time}`}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PatientProfile;
