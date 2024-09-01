import React, { useEffect, useState, useRef } from 'react';
import styles from './InfiniteCards.module.css';

const InfiniteCards = ({
  items,
  direction = 'left',
  speed = 'fast',
  pauseOnHover = true,
  className,
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === 'left') {
        containerRef.current.style.setProperty('--animation-direction', 'forwards');
      } else {
        containerRef.current.style.setProperty('--animation-direction', 'reverse');
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === 'fast') {
        containerRef.current.style.setProperty('--animation-duration', '20s');
      } else if (speed === 'normal') {
        containerRef.current.style.setProperty('--animation-duration', '40s');
      } else {
        containerRef.current.style.setProperty('--animation-duration', '80s');
      }
    }
  };
  useEffect(() => {
    
    addAnimation();
  }, []);



  return (
    <div
      ref={containerRef}
      className={`${styles.scroller} ${className}`}
    >
      <ul
        ref={scrollerRef}
        className={`${styles.scrollerList} ${start && styles.animateScroll} ${pauseOnHover && styles.pauseOnHover}`}
      >
        {items.map((item, idx) => (
          <li
            key={item.name}
            className={styles.card}
            // style={{
            //   background: 'linear-gradient(180deg, var(--slate-800), var(--slate-900)',
            // }}
          >
            <blockquote>
              <div
                aria-hidden="true"
                className={styles.cardBackground}
              ></div>
              <span className={styles.quote}>
                {item.quote}
              </span>
              <div className={styles.authorInfo}>
                <span className={styles.authorName}>
                  {item.name}
                </span>
                <span className={styles.authorTitle}>
                  {item.title}
                </span>
              </div>
            </blockquote>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfiniteCards;