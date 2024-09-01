import React, { useRef, useEffect } from "react";
import styles from "./GifContent.module.css"; // Assuming you have CSS modules
import StylishedButton from "../StylishedButton/StylishedButton";

const GifContent = ({ isOdd = false, gifUrl, heading, text, content_btn, btn_redirect_path}) => {
  const sectionRef3 = useRef(null);
    
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.show);
          } else {
            entry.target.classList.remove(styles.show);
          }
        });
      },
      { threshold: 0.25 } // Trigger animation when 25% of the element is in view
    );

    if (sectionRef3.current) {
      observer.observe(sectionRef3.current);
    }

    return () => {
      if (sectionRef3.current) {
        observer.unobserve(sectionRef3.current);
      }
    };
  }, []);

  const rotation = isOdd ? "10deg" : "-10deg";

  return (
    <div
      className={`${styles.sectionWithGif} ${styles.hidden}`}
      ref={sectionRef3}
    >
        {isOdd? <></> : <div className={styles.textContainer}>
        <h2>{heading}</h2>
        <p>
          {text}
        </p>
        <StylishedButton btn_content={content_btn} path_redirection={btn_redirect_path} />
      </div>}
      <div className={styles.gifContainer}>
        <img
          src={gifUrl}
          alt="Learning GIF"
          style={{ transform: `rotateY(${rotation})` }}
          className={styles.slantedGif}
        />
      </div>
      {isOdd? <div className={styles.textContainer}>
        <h2>{heading}</h2>
        <p>
          {text}
        </p>
        <StylishedButton btn_content={content_btn} path_redirection={btn_redirect_path} />
      </div> : <></>}
    </div>
  );
};

export default GifContent;
