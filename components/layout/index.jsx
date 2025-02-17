import { useState } from "react";
import Sidebar from "./sidebar";
import styles from "./styles.module.scss";
export default function Layout({ children }) {
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };
  return (
    <div className={styles.layout}>
      <Sidebar showSidebar={showSidebar} toggleSidebar={toggleSidebar} />
      <div
        style={{ marginLeft: `${showSidebar ? "280px" : "80px"}` }}
        className={styles.layout__main}
      >
        {children}
      </div>
    </div>
  );
}
