import styles from './Interview.module.css';
import React from 'react';

const InterviewPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.int}>int.</div>
        <div className={styles.recording}>• Recording</div>
        <div className={styles.today}>Today's<br/>Interviews</div>
        <div className={styles.kadie}>Kadie Camacho<br/>Recruiter</div>
      </div>
      <div className={styles.profile}>
        <div className={styles.profileHeader}>
          <div className={styles.john}>John Smith<br/>UX/UI Designer</div>
        </div>
        <div className={styles.profileContent}>
          <div className={styles.general}>General Info</div>
          <div className={styles.skills}>Skills</div>
          <div className={styles.experience}>Experience</div>
          <div className={styles.portfolio}>Portfolio</div>
          <div className={styles.portfolioContent}>
            <div className={styles.portfolioItem} />
            <div className={styles.portfolioItem} />
            <div className={styles.portfolioItem}>EHR</div>
            <div className={styles.portfolioItem}>
              <img src="/images/design.svg" alt="design" />
            </div>
            <div className={styles.portfolioItem}>
              <img src="/images/qr-code.svg" alt="qr-code" />
            </div>
          </div>
        </div>
        <div className={styles.timeline}>Timeline Generation</div>
        <div className={styles.timelineContent}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineHeader}>
              Produce
              <div className={styles.timelineTime}>2:15</div>
            </div>
            <img src="/images/produce.png" alt="produce" />
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineHeader}>
              <div className={styles.timelineTime}>13:14 - 28:12</div>
              Design Skills
            </div>
            <img src="/images/design-skills.png" alt="design skills" />
          </div>
          <div className={styles.timelineItem}>
            <div className={styles.timelineHeader}>
              <div className={styles.timelineTime}>28:12 - 32:15</div>
              Design Thinking
            </div>
            <img src="/images/design-thinking.png" alt="design thinking" />
          </div>
        </div>
      </div>
      <div className={styles.video}>
        <div className={styles.interview}>
          Interview<br/>Results
        </div>
        <div className={styles.interviewResults}>
          <div className={styles.interviewResult}>
            <div className={styles.interviewResultHeader}>Research</div>
            <div className={styles.interviewResultContent}>
              <div className={styles.interviewResultItem}>47</div>
              <div className={styles.interviewResultItem}>48</div>
              <div className={styles.interviewResultItem}>49</div>
            </div>
          </div>
          <div className={styles.interviewResult}>
            <div className={styles.interviewResultHeader}>Flexibility</div>
            <div className={styles.interviewResultContent}>
              <div className={styles.interviewResultItem}>42</div>
              <div className={styles.interviewResultItem}>43</div>
              <div className={styles.interviewResultItem}>46</div>
            </div>
          </div>
          <div className={styles.interviewResult}>
            <div className={styles.interviewResultHeader}>Communication</div>
            <div className={styles.interviewResultContent}>
              <div className={styles.interviewResultItem}>43</div>
              <div className={styles.interviewResultItem}>42</div>
              <div className={styles.interviewResultItem}>36</div>
            </div>
          </div>
          <div className={styles.interviewResult}>
            <div className={styles.interviewResultHeader}>Teamwork</div>
            <div className={styles.interviewResultContent}>
              <div className={styles.interviewResultItem}>43</div>
              <div className={styles.interviewResultItem}>43</div>
              <div className={styles.interviewResultItem}>39</div>
            </div>
          </div>
          <div className={styles.interviewResult}>
            <div className={styles.interviewResultHeader}>Creativity</div>
            <div className={styles.interviewResultContent}>
              <div className={styles.interviewResultItem}>42</div>
              <div className={styles.interviewResultItem}>38</div>
              <div className={styles.interviewResultItem}>38</div>
            </div>
          </div>
          <div className={styles.interviewResult}>
            <div className={styles.interviewResultHeader}>Leadership</div>
            <div className={styles.interviewResultContent}>
              <div className={styles.interviewResultItem}>34</div>
              <div className={styles.interviewResultItem}>35</div>
              <div className={styles.interviewResultItem}>38</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.aiNotes}>
        <div className={styles.aiNotesHeader}>
          <img src="/images/lightbulb.svg" alt="lightbulb" />
          Ai Interview<br/>Notes
          <div className={styles.close}>
            <img src="/images/close.svg" alt="close" />
          </div>
        </div>
        <div className={styles.aiNotesContent}>
          The candidate has a high attention to detail and can spot and correct small errors in design.
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;