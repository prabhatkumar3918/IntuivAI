import React, { useEffect, useRef } from "react";
import styles from "./Separator.module.css";

const Separator = ({text, isLine}) => {
  const separatorRef = useRef(null);
  const part1Ref = useRef(null);
  const part2Ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        part1Ref.current.classList.add(styles.animatePart1);
        part2Ref.current.classList.add(styles.animatePart2);
      } else {
        part1Ref.current.classList.remove(styles.animatePart1);
        part2Ref.current.classList.remove(styles.animatePart2);
      }
    }, { threshold: 0.5 });

    if (separatorRef.current) {
      observer.observe(separatorRef.current);
    }

    return () => {
      if (separatorRef.current) {
        observer.unobserve(separatorRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.separator} ref={separatorRef}>
        {isLine && <div className={styles.part1} ref={part1Ref}>
          <div className={styles.line}></div>
          <div className={styles.circle}></div>
        </div>}
        <div className={styles.text}>
            <h2>{text}</h2>
        </div>
        {isLine && <div className={styles.part2} ref={part2Ref}>
          <div className={styles.circle}></div>
          <div className={styles.line}></div>
        </div>}
      </div>
    </div>
  );
};

export default Separator;