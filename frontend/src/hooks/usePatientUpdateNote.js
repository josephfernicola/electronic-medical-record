import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { useLocation } from "react-router-dom";

export const usePatientUpdateNote = () => {
  const { user } = useAuthContext();
  const [patientId, setPatientId] = useState("");
  const [patientError, setPatientError] = useState(null);

  const location = useLocation();

  useEffect(() => {
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
      fetchPatientInfo();
    }
  }, []);

  const updatePatientNote = async (
    subjective,
    objective,
    assessment,
    plan,
    date,
    noteID,
    time
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
    try {
      const response = await fetch(`/api/patients/editNote/${patientId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(note),
      });
      const json = await response.json();
      const currentUserLocalStorage = JSON.parse(localStorage.getItem("user"));
      currentUserLocalStorage.provider.notes.forEach((ele) => {
        if (ele.noteID === noteID) {
          const index = currentUserLocalStorage.provider.notes.indexOf(ele);
          currentUserLocalStorage.provider.notes.splice(index, 1, note);
        }
      });
      localStorage.setItem("user", JSON.stringify(currentUserLocalStorage));
      setPatientError(null);
    } catch (error) {
      setPatientError(error);
    }
  };

  return { updatePatientNote, patientError };
};
