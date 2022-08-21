import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const Home = () => {
  return (
    <div className="homeContainer">
      <div className="background-image"></div>
      <div className="homeContent">
        <p className="homepageWelcome"> Noble Electronic Health Record</p>
        <p className="homepageText"></p>
      </div>
    </div>
  );
};

export default Home;
