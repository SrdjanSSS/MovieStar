import React, { useState } from "react";
import styles from "./Auth.module.css";
import { Login } from "./Login";
import Signup from "./Signup";

const Auth = () => {
  const [active, setActive] = useState(true);

  const handleChange = () => {
    setActive(active === true ? false : true);
  };

  return (
    <div className={styles.navigation}>
      <div className={styles.container}>
        {active ? (
          <Login handleChange={handleChange} />
        ) : (
          <Signup handleChange={handleChange} />
        )}
      </div>
    </div>
  );
};

export default Auth;
