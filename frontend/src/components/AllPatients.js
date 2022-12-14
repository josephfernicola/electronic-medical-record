import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link, useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";

const AllPatients = () => {
  const [allPatients, setAllPatients] = useState(null);
  const [originalAllPatients, setOriginalAllPatients] = useState(null);
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const [noResults, setNoResults] = useState("");
  const { logout } = useLogout();

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setError("You must be logged in");
      return;
    }
    const fetchUserInfo = async () => {
      const response = await fetch("/api/patients/getPatients", {
        headers: { Authorization: `Bearer ${user.token}` }, //to ensure user is logged in when making reqest
      });
      const json = await response.json();

      if (response.ok) {
        setAllPatients(json.sort((a, b) => a.name.localeCompare(b.name)));
        setOriginalAllPatients(
          json.sort((a, b) => a.name.localeCompare(b.name))
        );
      }
      if (!response.ok) {
        logout();
      }
    };
    if (user) {
      fetchUserInfo();
      setError(null);
    }
  }, [user]);

  const searchInputChange = async (e) => {
    let searchMatches = [];
    searchMatches.push(originalAllPatients);
    let patientMatches = searchMatches[0].filter((match) => {
      const regex = new RegExp(`^${e.target.value}`, "gi");
      return match.name.match(regex);
    });
    let firstTenMatches = patientMatches.slice(0, 10);
    firstTenMatches.sort((a, b) => a.name.localeCompare(b.name));
    setAllPatients(firstTenMatches);
    setNoResults("");
    if (e.target.value === "") {
      searchMatches = [];
      setAllPatients(originalAllPatients);
      setNoResults("");
    }
    if (firstTenMatches.length === 0) {
      setAllPatients([]);
      setNoResults("No Results");
    }
  };

  if (!allPatients) {
    return (
      //loading screen animation
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
    <div className="allPatientsContainer">
      <div className="patientSearchContainer">
        <label htmlFor="patientSearch"></label>
        <input
          type="text"
          name="patientSearch"
          className="patientSearch"
          autoComplete="off"
          placeholder="Patient First Name..."
          maxLength="30"
          onChange={searchInputChange}
        ></input>
        <div className="noResults">{noResults}</div>
      </div>
      <div className="patientListContainer">
        <div className="patientList">
          {allPatients &&
            allPatients.length > 0 &&
            allPatients.map((patient) => (
              <div
                className="patientInformation"
                key={patient._id}
                onClick={() => {
                  navigate(`/patient/${patient._id}`);
                }}
              >
                <div className="patientNameAndAge">
                  <div className="patientListName">{patient.name}</div>

                  <div>Age: {patient.age}</div>
                </div>
                <div className="pmh">
                  <div className="pmhTitle">Past Medical History</div>
                  {patient.pmh.map((disease, index) => (
                    <div key={index}>
                      <div>{`${disease.disease} ${disease.icd}`}</div>
                    </div>
                  ))}
                </div>
                <div className="allergies">
                  <div className="allergiesTitle">Allergies</div>
                  {patient.allergies.map((allergy, index) => (
                    <div className="eachAllergy" key={index}>
                      {allergy}
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
      {error}
    </div>
  );
};

export default AllPatients;
