import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { useNavigate } from "react-router-dom";

export const useGuestLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const guestLogin = async () => {
    setIsLoading(true);
    setError(null);


    const response = await fetch("/api/EMR/loginGuest", {
      method: "POST",
      body: JSON.stringify({guestInfo: "Guest"}),
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
  return { guestLogin, isLoading, error };
};
