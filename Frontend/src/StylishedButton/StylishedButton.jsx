import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./StylishedButton.module.css";
import rightArrowIcon from "../assets/right-arrow.svg";

const StylishedButton = ({ btn_content, path_redirection }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`${path_redirection}`);
  };

  return (
    <div className={styles.buttons}>
      <button className={styles.join_waitlist} onClick={handleClick}>
        <div className={styles.parent_btn}>
          <span className={styles.btn_text}>{btn_content}</span>
          <div className={styles.arrow}>
            <img src={rightArrowIcon} alt="Right Arrow" />
          </div>
        </div>
      </button>
    </div>
  );
};

export default StylishedButton;
