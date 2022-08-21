import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from "react-router-dom";

const AllProviders = () => {
  const [allProviders, setAllProviders] = useState(null);
  const [originalAllProviders, setOriginalAllProviders] = useState(null);
  const [error, setError] = useState(null);
  const [noResults, setNoResults] = useState("");
  const { user } = useAuthContext();
  const [matchList, setMatchList] = useState([]);

  const searchInputChange = async (e) => {
    let searchMatches = [];
    searchMatches.push(originalAllProviders);
    let providerMatches = searchMatches[0].filter((match) => {
      const regex = new RegExp(`^${e.target.value}`, "gi");
      return match.firstName.match(regex);
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
      setError("You must be logged in");
      return;
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
    };
    if (user) {
      fetchUserInfo();
      setError(null);
    }
  }, [user]);

  return (
    <div className="allProvidersContainer">
      <div className="providerSearchContainer">
        <label htmlFor="providerSearch"></label>
        <input
          type="text"
          name="providerSearch"
          autoComplete="off"
          className="providerSearch"
          placeholder="Search by first name..."
          maxLength="30"
          onChange={searchInputChange}
        ></input>
        <div className="noResults">{noResults}</div>
      </div>
      <div className="providerListContainer">
        {allProviders &&
          allProviders.length > 0 &&
          allProviders.map((provider) => (
            <Link to={`/EMR/${provider._id}`}>
              <div className="providerListNameAndCredentials" key={provider._id}>
                <span className="providerName">
                  {provider.firstName} {provider.lastName}
                </span>

                <p>Credentials: {provider.credentials}</p>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default AllProviders;

//do authorization check for all other areaa
