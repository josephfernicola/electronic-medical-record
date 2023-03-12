import { FaNotesMedical } from "react-icons/fa";

const Home = () => {
  return (
    <main className="homeContainer">
      <div className="background-image"></div>
      <div className="homeContent">
        <div className="homepageWelcome">
          {<FaNotesMedical />} Noble
          <div>Electronic Medical Record System</div>
        </div>
        <hr />

        <div className="homepageText">
          Create notes for your patients, edit your notes, view other provider
          notes
        </div>
      </div>
    </main>
  );
};

export default Home;
