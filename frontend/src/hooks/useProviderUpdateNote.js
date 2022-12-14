import { useState} from "react";
import { useAuthContext } from "./useAuthContext";

export const useProviderUpdateNote = () => {
  const { user } = useAuthContext();
  const [providerError, setProviderError] = useState(null);

  const updateProviderNote = async (
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
      setProviderError(null);
    } catch (error) {
      setProviderError(error);
    }
  };

  return { updateProviderNote, providerError };
};
