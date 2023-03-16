import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

const AllProviders = () => {
  const [allProviders, setAllProviders] = useState(null);
  const [originalAllProviders, setOriginalAllProviders] = useState(null);
  const [fullNames, setFullNames] = useState({});
  const [noResults, setNoResults] = useState("");
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const navigate = useNavigate();

  const searchInputChange = async (e) => {
    let searchMatches = [];
    searchMatches.push(originalAllProviders);
    let providerMatches = searchMatches[0].filter((match) => {
      let fullName = match.firstName.concat(" ", match.lastName);
      const regex = new RegExp(`^${e.target.value}`, "gi");
      return fullName.match(regex);
    });
    const firstTenMatches = providerMatches.slice(0, 10);
    setAllProviders(firstTenMatches.sort());
    setNoResults("");
    if (e.target.value === "") {
      searchMatches = [];
      setAllProviders(originalAllProviders);
      setNoResults("");
    }
    if (providerMatches.length === 0) {
      setAllProviders([]);
      setNoResults("No Results");
    }
  };

  useEffect(() => {
    if (!user) {
      logout();
    }
    const fetchUserInfo = async () => {
      const response = await fetch("/api/EMR/providers", {
        headers: { Authorization: `Bearer ${user.token}` }, //to ensure user is logged in when making reqest
      });
      const json = await response.json();

      if (response.ok) {
        setAllProviders(json);
        setOriginalAllProviders(json);
      }
      if (!response.ok) {
        logout();
      }
    };
    if (user) {
      fetchUserInfo();
    }
  }, [user]);

  if (!allProviders) {
    //loading screen animation
    return (
      <div className="loadingScreen">
        <div className="lds-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    );
  }

  return (
    <div className="allProvidersContainer">
      <div className="providerSearchContainer">
        <label htmlFor="providerSearch"></label>
        <input
          type="text"
          name="providerSearch"
          autoComplete="off"
          className="providerSearch"
          placeholder="Provider First Name..."
          maxLength="30"
          onChange={searchInputChange}
        ></input>
        <div className="noResults">{noResults}</div>
      </div>
      <div className="providerListContainer">
        {allProviders &&
          allProviders.length > 0 &&
          allProviders.map((provider) => (
            <div
              className="providerListNameAndCredentials"
              key={provider._id}
              onClick={() => {
                navigate(`/EMR/${provider._id}`);
              }}
            >
              <span className="providerName">
                {provider.firstName} {provider.lastName}
              </span>

              <p>Credentials: {provider.credentials}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default AllProviders;
