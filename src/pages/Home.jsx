import React from "react";
import Navbar from "../components/navbar";
import Genders_SearchBar from "../components/Genders_SearchBar";
import ShowCase from "../components/ShowCase";

function home() {
  return (
    <div>
      <Navbar />
      <Genders_SearchBar />
      <ShowCase />
    </div>
  );
}

export default home;
