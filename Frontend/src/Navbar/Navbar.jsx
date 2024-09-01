import React from 'react'
import styles from './Navbar.module.css'
import logo from '../assets/logo.png'

const Navbar = () => {
  return (
    <div className={styles.header}>
        <div className={styles.logo}>
          <a href="/">
            <div className={styles.logo_mark}>
              <img
                decoding="async"
                sizes="36px"
                src={logo}
                alt=""
                style={{
                  display: 'block',
                  width: '100%',
                  height: '100%',
                  borderRadius: 'inherit',
                  objectPosition: 'center center',
                  objectFit: 'cover',
                  imageRendering: 'auto',
                  backgroundColor: 'transparent'
                }}
              />

            </div>
            <div className={styles.logo_text}>saarth.ai</div>
          </a>
        </div>
        <div className={styles.nav_links}>
          <a href="/about">About</a>
          <a href="/faqs">FAQs</a>
          <a href="/contact">Contact</a>
        </div>
        <div className={styles.actions}>
          {/* <a href="https://twitter.com/openservai" target="_blank" rel="noopener">
            <img src={twitterIcon} alt="Twitter" />
          </a> */}
          <a href="https://docsend.com/view/dw4av83vyuhn4pta" target="_blank" rel="noopener">
            {/* Insert whitepaper icon here */}
            <div className={styles.whitepaper_label}>Login</div>
            {/* Insert arrow icon here */}
          </a>
          <a href="https://docsend.com/view/dw4av83vyuhn4pta" target="_blank" rel="noopener">
            {/* Insert whitepaper icon here */}
            <div className={styles.whitepaper_label}>Sign up</div>
            {/* Insert arrow icon here */}
          </a>
        </div>
      </div>
  )
}

export default Navbar
