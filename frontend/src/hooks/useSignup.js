import { useState } from "react";
import { useAuthContext} from "./useAuthContext";
import {useNavigate} from 'react-router-dom';

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const navigate = useNavigate();

  const signup = async (email, password, firstName, lastName, credentials, notes) => {
    setIsLoading(true);
    setError(null);
    const provider = { email, password, firstName, lastName, credentials, notes };

    const response = await fetch("/api/EMR/signup", {
      method: "POST",
      body: JSON.stringify(provider),
      headers: {
        "Content-type": "application/json",
      },
    });
    const json = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(json.error);
    }
    if (response.ok) {
      //save the user to local storage
      localStorage.setItem("user", JSON.stringify(json));

      //update auth context
      dispatch({ type: "LOGIN", payload: json });
      setIsLoading(false);
      navigate("/")
    }
  };
  return { signup, isLoading, error };
};
