import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

//pages and components
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import AllProviders from "./components/AllProviders";
import AllPatients from "./components/AllPatients";
import PatientProfile from "./components/PatientProfile";
import Profile from "./components/Profile";
import CompletedNote from "./components/CompletedNote";
import EditNote from "./components/EditNote";

import Signup from "./pages/Signup";
import LoginScreen from "./pages/LoginScreen";
import LoginNavbar from "./components/LoginNavBar";
import AddNote from "./components/AddNote";
import { useAuthContext } from "./hooks/useAuthContext";
import { diseases } from "./patientInfo/diseases";
import { patientNames } from "./patientInfo/patientNames";

function App() {
  const { user } = useAuthContext();
  const [allAllergies, setAllAllergies] = useState([
    "Buckwheat",
    "Celery",
    "Eggs",
    "Shellfish",
    "Apples",
    "Bananas",
    "Garlic",
    "Oats",
    "Prednisone",
    "Penicillin",
    "Maize",
    "Milk",
    "Peanuts",
    "Soy",
    "Tetracycline",
    "Wheat",
    "Dilantin",
    "Grass",
    "Pollen",
    "Dust mites",
    "Cat fur",
    "Dog fur",
    "Latex",
    "Aspirin",
    "Sulfonamides",
  ]);

  useEffect(() => {
    //this posted all patients to mongoDB
    // const handlePatientUpload = async () => {
    //   const uploadPatientData = async (name, pmh, notes, age, allergies) => {
    //     const patient = { name, pmh, notes, age, allergies };
    //     //console.log(user.token);
    //     const response = await fetch("/api/patients/uploadPatients", {
    //       method: "POST",
    //       headers: {
    //         Authorization: `Bearer ${user.token}`,
    //         "Content-type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         name: name,
    //         pmh: pmh,
    //         notes: notes,
    //         age: age,
    //         allergies: allergies,
    //       }),
    //     });

    //     const json = await response.json();
    //     console.log("patient json", json);
    //     if (!response.ok) {
    //       console.log("Not working");
    //     }
    //     if (response.ok) {
    //       console.log("Success");
    //     }
    //   };
    //   const randomPatient =
    //     patientNames[Math.floor(Math.random() * patientNames.length)];
    //   const randomDiseaseNumber = Math.floor(Math.random() * 5) + 1;
    //   const randomAge = randomIntFromInterval(18, 85);
    //   const shuffledDiseases = diseases.sort(() => 0.5 - Math.random());
    //   let selectedDiseases = shuffledDiseases.slice(0, randomDiseaseNumber);
    //   let diseaseArray = [];
    //   selectedDiseases.forEach((disease) => {
    //     if (disease.ICD10 && disease.ICD10 !== "") {
    //       diseaseArray.push({ disease: disease.text, icd: disease.ICD10 });
    //     }
    //   });
    //   uploadPatientData(
    //     `${randomPatient["First Name"]} ${randomPatient["Last Name"]}`,
    //     diseaseArray,
    //     [],
    //     randomAge,
    //     randomAllergies(),
    //   );
    // };
    //for (let i = 0; i < 375; i++) {
      //handlePatientUpload();
    //}
  }, []);

  // function randomIntFromInterval(min, max) {
  //   // min and max included
  //   return Math.floor(Math.random() * (max - min + 1) + min);
  // }

  // function randomAllergies() {
  //   const randomAllergyNumber = Math.floor(Math.random() * 3);
  //   const shuffledAllergies = allAllergies.sort(() => 0.5 - Math.random());
  //   let selectedAllergies = shuffledAllergies.slice(0, randomAllergyNumber);
  //   if (selectedAllergies.length === 0) {
  //     selectedAllergies.push("No allergies on file");
  //     return selectedAllergies;
  //   }
  //   return selectedAllergies;
  // }

  return (
    <div className="App">
      <BrowserRouter>
        {user ? <Navbar /> : <LoginNavbar />}
        <div className="pages">
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/EMR/providers"
              element={user ? <AllProviders /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/EMR/:id"
              element={user ? <Profile /> : <Navigate to="/login" />}
            ></Route>
            <Route
              path="/login"
              element={!user ? <LoginScreen /> : <Navigate to="/" />}
            ></Route>
            <Route path="/signup" element={<Signup />}></Route>
            <Route
              path="/EMR/allPatients"
              element={user ? <AllPatients /> : <Navigate to="/" />}
            ></Route>
            <Route
              path="/patient/:id"
              element={user ? <PatientProfile /> : <Navigate to="/" />}
            ></Route>
            <Route
              path="/notes/:id"
              element={user ? <AddNote /> : <Navigate to="/" />}
            ></Route>
            <Route
              path="/completedNote/:id/:id"
              element={user ? <CompletedNote /> : <Navigate to="/" />}
            ></Route>
            <Route
              path="editNote/:id/:id"
              element={user ? <EditNote /> : <Navigate to="/" />}
            ></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
