import React from 'react';
import gif1 from './assets/AI Video (2).gif'
import gif2 from './assets/user 1 (2).gif'
import gif3 from './assets/Maria Tar (2).gif'
import styles from './LandingPage.module.css';
import Separator from './Separator/Separator';
import GifContent from './GifComponent/GifContent';
import Navbar from './Navbar/Navbar';
import StylishedButton from './StylishedButton/StylishedButton';
import Footer from './Footer/Footer';
import InfiniteCards from './InfiniteCards/InfiniteCards';



const App = () => {
  let heading1 = `Elevate Your Interview Skills`;
  let text1 = `Enhance your interview performance with our AI-driven platform.
            Experience real-time, interactive simulations that provide a realistic
            interview experience, from grilling on your CV to tackling technical
            challenges. Receive immediate feedback and tailored insights to refine
            your responses and boost your effectiveness.`
  let heading2="Master Your Presentation Skills";
  let text2=`Refine your presentation abilities with our AI-powered platform. 
          Engage in lifelike, interactive sessions that simulate real presentation scenarios. 
          Receive dynamic feedback and real-time interactions to enhance your delivery, content, and confidence. 
          Tailored insights empower you to master essential techniques. 
          Elevate your presentation skills with our intelligent and focused approach.`;

  let heading3="Optimize and Create Your CV";
  let text3=`Transform and craft your CV with our AI-driven platform. 
  Whether enhancing an existing CV or creating a new one from scratch, receive personalized feedback and actionable insights 
  to improve content, structure, and impact. Tailored recommendations ensure your CV highlights your strengths and aligns with industry standards.
  Elevate your career prospects with our intelligent and focused approach to CV optimization and creation.`
  const testimonials = [
    {
      quote:
        "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair.",
      name: "Charles Dickens",
      title: "A Tale of Two Cities",
    },
    {
      quote:
        "To be, or not to be, that is the question: Whether 'tis nobler in the mind to suffer The slings and arrows of outrageous fortune, Or to take Arms against a Sea of troubles, And by opposing end them: to die, to sleep.",
      name: "William Shakespeare",
      title: "Hamlet",
    },
    {
      quote: "All that we see or seem is but a dream within a dream.",
      name: "Edgar Allan Poe",
      title: "A Dream Within a Dream",
    },
    {
      quote:
        "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
      name: "Jane Austen",
      title: "Pride and Prejudice",
    },
    {
      quote:
        "Call me Ishmael. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would sail about a little and see the watery part of the world.",
      name: "Herman Melville",
      title: "Moby-Dick",
    },
  ];

  return (
    <div className={styles.container}>
      <Navbar />
      <div className={styles.gap}>
      </div>
      <div className={styles.content}>
        <div className={styles.title}>
          <span className={styles.text_gradient}>Elevate Your Potential</span>
        </div>
        <div className={styles.description}>
          An AI-driven platform to enhance your career journey.
          Practice interviews, perfect presentations, and optimize your CV with smart, interactive AI agents.
          Gain confidence, refine your skills, and stand out in every professional endeavor.
        </div>
        <StylishedButton btn_content="Get Started" path_redirection='/login' />
      </div>
      <div className={styles.waves_container}>
        <img className={styles.waves_svg} decoding='async' sizes='max(min(max(100vw - 80px, 1px), 1240px), 1px)' src="https://framerusercontent.com/images/0u6l44awKqCuWyLB7UcK30qEM.png?scale-down-to=1024" alt="Illustration" />
      </div>
      <div className={styles.background}>
        {/* Add your background image here */}
      </div>
      <GifContent isOdd gifUrl={gif1} heading={heading1} text={text1} content_btn="Schedule Interview" btn_redirect_path = "/login"/>
      <Separator text={"PITCH TO AI"} isLine />
      <GifContent gifUrl={gif2} heading={heading2} text={text2} content_btn="Pitch Yourself" btn_redirect_path = "/login"/>
      <Separator text={"BUILD YOUR CV"} isLine />
      <GifContent isOdd gifUrl={gif3} heading={heading3} text={text3} content_btn= "Resume Builder" btn_redirect_path = "/login"/>
      <div className={styles.waves_container}>
        <img className={styles.waves_svg} decoding='async' sizes='max(min(max(100vw - 80px, 1px), 1240px), 1px)' src="https://framerusercontent.com/images/0u6l44awKqCuWyLB7UcK30qEM.png?scale-down-to=1024" alt="Illustration" />
      </div>
      <Separator text={"TESTIMONIALS"} isLine />
      <InfiniteCards items={testimonials} /> 
      <Footer />
    </div>

  );
};

export default App;