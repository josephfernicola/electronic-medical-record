import { useLocation, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { useProviderNote } from "../hooks/useProviderNote";
import { v4 as uuidv4 } from "uuid";
import { usePatientNote } from "../hooks/usePatientNote";

const AddNote = () => {
  const { addProviderNote } = useProviderNote();
  const { addPatientNote } = usePatientNote();
  const location = useLocation();
  const navigate = useNavigate();
  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");
  const { name, pmh, patientId, age, allergies } = location.state;
  const { user } = useAuthContext();

  const convertTime = (time) => {
    time = time.split(":"); // convert to array

    // fetch
    const hours = Number(time[0]);
    const minutes = Number(time[1]);
    const seconds = Number(time[2]);

    // calculate
    let timeValue = "";

    if (hours > 0 && hours <= 12) {
      timeValue = "" + hours;
    } else if (hours > 12) {
      timeValue = "" + (hours - 12);
    } else if (hours == 0) {
      timeValue = "12";
    }

    timeValue += minutes < 10 ? ":0" + minutes : ":" + minutes; // get minutes
    timeValue += seconds < 10 ? ":0" + seconds : ":" + seconds; // get seconds
    timeValue += hours >= 12 ? " P.M." : " A.M."; // get AM/PM

    return timeValue;
  };

  const handleSubmit = async function (e) {
    e.preventDefault();

    const currentdate = new Date();
    const date =
      currentdate.getMonth() +
      1 +
      "/" +
      currentdate.getDate() +
      "/" +
      currentdate.getFullYear();

    const time =
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();

    const noteId = uuidv4();

    await addProviderNote(
      subjective,
      objective,
      assessment,
      plan,
      user.provider.firstName,
      user.provider.lastName,
      user.provider.credentials,
      name,
      noteId,
      date,
      convertTime(time)
    );

    await addPatientNote(
      subjective,
      objective,
      assessment,
      plan,
      user.provider.firstName,
      user.provider.lastName,
      user.provider.credentials,
      name,
      noteId,
      date,
      convertTime(time)
    );

    navigate(`/patient/${patientId}`);
  };

  return (
    <div className="addNoteContainer">
      <div className="patientInfoContainer">
        <h2>Patient:</h2>
        <Link to={`/patient/${patientId}`}>
          <div>{name}</div>
        </Link>
        <h2>Age:</h2>
        <div>{age}</div>
        <h2>Past Medical History: </h2>
        {pmh.map((disease, index) => (
          <div key={index}>
            <div>{`${disease.disease} ${disease.icd}`}</div>
          </div>
        ))}
        <h2>Allergies:</h2>
        {allergies.map((allergy, index) => (
          <div key={index} className="addNoteAllergy">{allergy}</div>
        ))}
      </div>

      <form className="addNoteForm" onSubmit={handleSubmit}>
        <h3>
          Add a note for <Link to={`/patient/${patientId}`}>{name}</Link>
        </h3>
        <div className="titleAndtextarea">
          <label htmlFor="subjective"> Subjective:</label>
          <textarea
            name="subjective"
            autoComplete="off"
            required
            onChange={(e) => setSubjective(e.target.value)}
            value={subjective}
          />
        </div>
        <div className="titleAndtextarea">
          <label htmlFor="objective"> Objective:</label>
          <textarea
            name="objective"
            autoComplete="off"
            required
            onChange={(e) => setObjective(e.target.value)}
            value={objective}
          />
        </div>
        <div className="titleAndtextarea">
          <label htmlFor="assessment"> Assessment:</label>
          <textarea
            name="assessment"
            autoComplete="off"
            required
            onChange={(e) => setAssessment(e.target.value)}
            value={assessment}
          />
        </div>
        <div className="titleAndtextarea">
          <label htmlFor="plan"> Plan:</label>
          <textarea
            name="plan"
            autoComplete="off"
            required
            onChange={(e) => setPlan(e.target.value)}
            value={plan}
          />
        </div>

        <button className="submitNoteButton" type="submit">
          Sign Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;
