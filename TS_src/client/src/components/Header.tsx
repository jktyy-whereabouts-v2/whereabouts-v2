import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <Link to="/">
        <img src={"../assets/logo.png"} />
      </Link>
    </header>
  );
}

export default Header;
