import React from "react";

import { ChatPage } from "./src/pages/ChatPage";

import * as styles from "./src/pages/style.scss";
import { Route, Router, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <div className={styles.container}>
      <Routes>
        <Route path="/" element={<ChatPage />}></Route>
      </Routes>
    </div>
  );
};

export default App;
