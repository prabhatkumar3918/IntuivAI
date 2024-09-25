import React from "react";
import styles from "./home.module.css";
import gif1 from '../assets/AI Video (3).gif'
import gif2 from '../assets/user 1 (3).gif'
import gif3 from '../assets/Maria Tar (3).gif'

const HomePage = () => {
  const userName = "Prabhat";

  return (
    <div className={styles.pageContainer}>
      <nav className={styles.navbar}>
        <div className={styles.logo}>Intuiv</div>
        <ul className={styles.navLinks}>
          <li>Interview</li>
          <li>CV Studio</li>
          <li>Present</li>
          <li>Blog</li>
          <li>Contact</li>
        </ul>
        <div className={styles.profileButton}>Profile</div>
      </nav>

      <header className={styles.header}>
        <div className={styles.leftContent}>
        <div className={styles.welcomeContainer}>
            <div className={styles.welcomeMessage}>
              <h2>Welcome back, <span className={styles.future}>{userName}!</span></h2>
            </div>
          </div>
          <h1 className={styles.title}>
            Elevate Your <span className={styles.future}>Potential</span>
          </h1>
          <p className={styles.subtext}>
            An AI-driven platform to enhance your career journey
          </p>
        </div>

        <div className={styles.gifContainer}>
          <img src={gif2} alt="AI Gif 1" className={`${styles.gif} ${styles.gif1}`} />
          <img src={gif1} alt="AI Gif 2" className={`${styles.gif} ${styles.gif2}`} />
          <img src={gif3} alt="AI Gif 3" className={`${styles.gif} ${styles.gif3}`} />
        </div>
      </header>
    </div>
  );
};

export default HomePage;
