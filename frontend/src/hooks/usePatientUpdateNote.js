import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { useLocation } from "react-router-dom";

export const usePatientUpdateNote = () => {
  const { user } = useAuthContext();
  const { dispatch } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [noteID, setNoteID] = useState("")

  const location = useLocation();

  useEffect(() => {
    if (!user) {
      //setError("You must be logged in");
      return;
    }
    const fetchPatientInfo = async function () {
      const response = await fetch("/api/patients/getPatients", {
        headers: { Authorization: `Bearer ${user.token}` }, //to ensure user is logged in when making reqest
      });
      const json = await response.json();

      if (response.ok) {
        json.forEach(async function (patient) {
          patient.notes.forEach((note) => {
            if (location.pathname.includes(note.noteID)) {
              //console.log(patient._id);
              setPatientId(patient._id)
              setNoteID(noteID)
            }
          });
        });
      }
    };
    if (user) {
      fetchPatientInfo();
    
      //setError(null);
    }
  }, []);

  const updatePatientNote = async (
    subjective,
    objective,
    assessment,
    plan,
    date,
    noteID,
    time,
  ) => {
    const note = {
      subjective,
      objective,
      assessment,
      plan,
      date,
      noteID,
      time,
    };
    //console.log(user.token)

    const response = await fetch(`/api/patients/editNote/${patientId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(note),
    });
    const json = await response.json();
    console.log(json)
  };

  return { updatePatientNote };
};
