import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";
import { usePatientUpdateNote } from "../hooks/usePatientUpdateNote";
import {useProviderUpdateNote} from "../hooks/useProviderUpdateNote"

const EditNote = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { updatePatientNote } = usePatientUpdateNote();
  const {updateProviderNote} = useProviderUpdateNote();
  const { currentNote, providerId } = location.state;

  const { user } = useAuthContext();
  const [subjective, setSubjective] = useState(currentNote.subjective);
  const [objective, setObjective] = useState(currentNote.objective);
  const [assessment, setAssessment] = useState(currentNote.assessment);
  const [plan, setPlan] = useState(currentNote.plan);
  const [allPatientNotes, setAllPatientNotes] = useState([]);
  const [allProviderNotes, setAllProviderNotes] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0)
    const fetchPatientInfo = async () => {
      const response = await fetch("/api/patients/getPatients", {
        headers: { Authorization: `Bearer ${user.token}` }, //to ensure user is logged in when making reqest
      });
      const json = await response.json();

      if (response.ok) {
        json.forEach(async function (patient) {
          patient.notes.forEach((note) => {
            if (note.noteID === currentNote.noteID) {
              setAllPatientNotes(patient.notes);
            }
          });
        });
      }
    };
    const fetchProviderInfo = async () => {
      //console.log(user.token)
      const response = await fetch("/api/EMR/providers", {
        headers: { Authorization: `Bearer ${user.token}` }, //to ensure user is logged in when making reqest
      });
      const json = await response.json();

      if (response.ok) {
        //setAllProviders(json);
        json.forEach((provider) => {
          if (location.pathname.includes(provider._id)) {
            setAllProviderNotes(provider.notes);
          }
        });
      }
    };
    if (user) {
      fetchPatientInfo();
    }
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log(e.target);
    //console.log(subjective)
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
    await updateProviderNote(
      subjective,
      objective,
      assessment,
      plan,
      date,
      currentNote.noteID,
      convertTime(time),
    );

    await updatePatientNote(
      subjective,
      objective,
      assessment,
      plan,
      date,
      currentNote.noteID,
      convertTime(time),
    );
    navigate(`/completedNote/${providerId}/${currentNote.noteID}`)
  };

  return (
    <div>
      <form className="editNoteForm" onSubmit={handleSubmit}>
        <h3>Edit your note for {currentNote.patient}</h3>
        <div className="soapTitleAndText">
          <label htmlFor="subjective"> Subjective:</label>
          <textarea
            name="subjective"
            autoComplete="off"
            onChange={(e) => setSubjective(e.target.value)}
            value={subjective}
          />
        </div>
        <div className="soapTitleAndText">
          <label htmlFor="objective"> Objective:</label>
          <textarea
            name="objective"
            autoComplete="off"
            onChange={(e) => setObjective(e.target.value)}
            value={objective}
          />
        </div>
        <div className="soapTitleAndText">
          <label htmlFor="assessment"> Assessment:</label>
          <textarea
            name="assessment"
            autoComplete="off"
            onChange={(e) => setAssessment(e.target.value)}
            value={assessment}
          />
        </div>
        <div className="soapTitleAndText">
          <label htmlFor="plan"> Plan:</label>
          <textarea
            name="plan"
            autoComplete="off"
            onChange={(e) => setPlan(e.target.value)}
            value={plan}
          />
        </div>
        <div className="editNoteButtons">
          <button className="submitEditNoteButton" type="submit">
            Sign Note
          </button>
          <Link to={`/completedNote/${providerId}/${currentNote.noteID}`}>
            <button className="cancelEdit">Cancel</button>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default EditNote;
