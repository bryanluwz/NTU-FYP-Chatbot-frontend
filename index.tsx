import React from "react";
import * as styles from "./src/pages/style.scss";
import { Route, Routes } from "react-router-dom";
import { MainPage } from "./src/pages";

const App: React.FC = () => {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<MainPage />}></Route>
      </Routes>
    </div>
  );
};

export default App;
