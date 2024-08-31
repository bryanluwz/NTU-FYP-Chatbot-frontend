import React from "react";
import * as styles from "./style.scss";
import { ChatPage } from "./ChatPage";
const App: React.FC = () => {
  return (
    <div className={styles.container}>
      <ChatPage />
    </div>
  );
};

export default App;
