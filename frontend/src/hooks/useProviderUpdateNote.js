import { useState, useEffect } from "react";
import { useAuthContext } from "./useAuthContext";
import { useLocation } from "react-router-dom";

export const useProviderUpdateNote = () => {
  const { user } = useAuthContext();
  const { dispatch } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [patientId, setPatientId] = useState("");
  const [noteID, setNoteID] = useState("");

  const location = useLocation();

  useEffect(() => {
    if (!user) {
      //setError("You must be logged in");
      return;
    }
    const fetchProviderInfo = async function () {
      const response = await fetch("/api/EMR/providers", {
        headers: { Authorization: `Bearer ${user.token}` }, //to ensure user is logged in when making reqest
      });
      const json = await response.json();

      if (response.ok) {
        json.forEach(async function (provider) {
          provider.notes.forEach((note) => {
            if (location.pathname.includes(note.noteID)) {
              setNoteID(noteID);
            }
          });
        });
      }
    };
    if (user) {
      fetchProviderInfo();

      //setError(null);
    }
  }, []);

  const updateProviderNote = async (
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

    const response = await fetch(
      `/api/providers/editNote/${user.provider._id}`,
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(note),
      }
    );
    const json = await response.json();
  };

  return { updateProviderNote };
};
