import React from 'react';
import styles from './Footer.module.css';
import logo from '../assets/logo.png'

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerLogo}>
            <a href="/">
              <img src={logo} alt="DevStudio Logo" />
            </a>
            <p className={styles.copyright}>
              &copy; copyright Intuiv.ai 2024. All rights reserved.
            </p>
          </div>
          <div className={styles.footerLinks}>
            <div className={styles.footerLinksGroup}>
              <h3 className={styles.footerLinksTitle}>Pages</h3>
              <ul>
                <li>
                  <a href="/all-products">All Products</a>
                </li>
                <li>
                  <a href="/Interview">Interview Panel</a>
                </li>
                <li>
                  <a href="/presentation">Presentation Space</a>
                </li>
                <li>
                  <a href="/CV analyzer">CV studio</a>
                </li>
                <li>
                  <a href="/pricing">Pricing</a>
                </li>
                <li>
                  <a href="/blog">Blog</a>
                </li>
              </ul>
            </div>
            <div className={styles.footerLinksGroup}>
              <h3 className={styles.footerLinksTitle}>Socials</h3>
              <ul>
                <li>
                  <a href="/facebook">Facebook</a>
                </li>
                <li>
                  <a href="/instagram">Instagram</a>
                </li>
                <li>
                  <a href="/twitter">Twitter</a>
                </li>
                <li>
                  <a href="/linkedin">LinkedIn</a>
                </li>
              </ul>
            </div>
            <div className={styles.footerLinksGroup}>
              <h3 className={styles.footerLinksTitle}>Legal</h3>
              <ul>
                <li>
                  <a href="/privacy-policy">Privacy Policy</a>
                </li>
                <li>
                  <a href="/terms-of-service">Terms of Service</a>
                </li>
                <li>
                  <a href="/cookie-policy">Cookie Policy</a>
                </li>
              </ul>
            </div>
            <div className={styles.footerLinksGroup}>
              <h3 className={styles.footerLinksTitle}>Register</h3>
              <ul>
                <li>
                  <a href="/sign-up">Sign Up</a>
                </li>
                <li>
                  <a href="/login">Login</a>
                </li>
                <li>
                  <a href="/forgot-password">Forgot Password</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.company}>
        <p className={styles.companyName}>INTUIV AI</p>
      </div>
    </footer>
  );
};

export default Footer;