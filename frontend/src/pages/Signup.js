import { useState } from "react";
import { useSignup } from "../hooks/useSignup";
import {useNavigate} from 'react-router-dom';

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [credentials, setCredentials] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, error, isLoading } = useSignup();

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    await signup(email, password, firstName, lastName, credentials);


  };
  const handleRadioChange = (e) => {
    setCredentials(e.target.value);
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>
      <div>
        <label htmlFor="email"> Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </div>
      <div>
        <label htmlFor="password"> Password:</label>
        <input
          type="password"
          name="password"
          id="password"
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      <div className="firstNameInput">
        <label htmlFor="firstName"> First Name:</label>
        <input
          type="text"
          name="firstName"
          id="firstName"
          autoComplete="off"
          onChange={(e) => setFirstName(e.target.value)}
          value={firstName}
        />
      </div>
      <div className="lastNameInput">
        <label htmlFor="lastName"> Last Name:</label>
        <input
          type="text"
          name="lastName"
          id="lastName"
          autoComplete="off"
          onChange={(e) => setLastName(e.target.value)}
          value={lastName}
        />
      </div>
      <fieldset>
        <legend>Credentials (Cannot be changed later): </legend>
        <div>
          <input
            type="radio"
            id="credentials"
            name="credentials"
            value="Medical Doctor"
            onChange={handleRadioChange}
          />
          <label htmlFor="credentials">Medical Doctor</label>
        </div>
        <div>
          <input
            type="radio"
            id="credentials"
            name="credentials"
            value="Physician Assistant"
            onChange={handleRadioChange}
          />
          <label htmlFor="credentials">Physician Assistant</label>
        </div>
        <div>
          <input
            type="radio"
            id="credentials"
            name="credentials"
            value="Registered Nurse"
            onChange={handleRadioChange}
          />
          <label htmlFor="credentials">Registered Nurse</label>
        </div>

        <div>
          <input
            type="radio"
            id="credentials"
            name="credentials"
            value="Physical Therapist"
            onChange={handleRadioChange}
          />
          <label htmlFor="credentials">Physical Therapist</label>
        </div>

        <div>
          <input
            type="radio"
            id="credentials"
            name="credentials"
            value="Speech Language Pathologist"
            onChange={handleRadioChange}
          />
          <label htmlFor="credentials">Speech Language Pathologist</label>
        </div>
        <div>
          <input
            type="radio"
            id="credentials"
            name="credentials"
            value="Occupational Therapist"
            onChange={handleRadioChange}
          />
          <label htmlFor="credentials">Occupational Therapist</label>
        </div>
      
        <div>
          <input
            type="radio"
            id="credentials"
            name="credentials"
            value="Respiratory Therapist"
            onChange={handleRadioChange}
          />
          <label htmlFor="credentials">Respiratory Therapist</label>
        </div>
      </fieldset>
      <button className="signupSubmitButton"type="submit" disabled={isLoading}>
        Sign Up
      </button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;