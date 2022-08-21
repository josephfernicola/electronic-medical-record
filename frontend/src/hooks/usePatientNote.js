import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { useLocation } from "react-router-dom";

export const usePatientNote = () => {
  const { user } = useAuthContext();
  const { dispatch } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [patientId, setPatientId] = useState("");

  const location = useLocation();

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
        json.forEach(async function (patient) {
          if (location.pathname.includes(patient._id)) {
            setPatientId(patient._id);
          }
        });
      }
    };
    if (user) {
      fetchPatientInfo();
      //setError(null);
    }
  }, []);

  const addPatientNote = async (
    subjective,
    objective,
    assessment,
    plan,
    providerFirstName,
    providerLastName,
    credentials,
    patientName,
    noteID,
    date,
    time
  ) => {
    const note = {
      subjective,
      objective,
      assessment,
      plan,
      providerFirstName,
      providerLastName,
      credentials,
      patientName,
      noteID,
      date,
      time
    };

    const response = await fetch(`/api/patients/note/${patientId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(note),
    });
    const json = await response.json();
  };

  return { addPatientNote };
};
