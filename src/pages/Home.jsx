import React from "react";
import Navbar from "../components/Navbar";
import Genders_SearchBar from "../components/Genders_SearchBar";
import ShowCase from "../components/ShowCase";

function Home() {
  return (
    <div>
      <Navbar />
      <Genders_SearchBar />
      <ShowCase />
    </div>
  );
}

export default Home;
