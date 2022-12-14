import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

export const useProviderNote = () => {
  const { user } = useAuthContext();
  const [providerError, setProviderError] = useState(null);

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
    try {
      const response = await fetch(`/api/${user.provider._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(note),
      });
      setProviderError(null);
    } catch (error) {
      setProviderError(error);
    }
  };

  return { addProviderNote, providerError };
};
