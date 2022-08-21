import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useProviderNote = () => {
  const { user } = useAuthContext();
  const { dispatch } = useAuthContext();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);

  const addProviderNote = async (
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
      time,
    };
    const response = await fetch(`/api/${user.provider._id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
        "Content-type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(note),
    });
    const json = await response.json();
  };

  return { addProviderNote };
};
