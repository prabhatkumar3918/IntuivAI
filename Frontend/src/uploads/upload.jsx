import React, { useState } from 'react';
import styles from './upload.module.css';
import background from '../assets/Login-background.jpg'; // Background image path

const UploadForm = () => {
    const [cv, setCv] = useState(null);
    const [jobDescription, setJobDescription] = useState('');
    const [numQuestions, setNumQuestions] = useState(5); // Default number of questions
    const [difficulty, setDifficulty] = useState('Medium'); // Default difficulty level
    const [interviewType, setInterviewType] = useState('CV Grilling'); // Default interview type

    const handleCvChange = (e) => {
        setCv(URL.createObjectURL(e.target.files[0]));
    };

    const handleJobDescriptionChange = (e) => {
        setJobDescription(e.target.value);
    };

    const handleNumQuestionsChange = (e) => {
        setNumQuestions(e.target.value);
    };

    const handleDifficultyChange = (e) => {
        setDifficulty(e.target.value);
    };

    const handleInterviewTypeChange = (e) => {
        setInterviewType(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('CV:', cv);
        console.log('Job Description:', jobDescription);
        console.log('Number of Questions:', numQuestions);
        console.log('Difficulty Level:', difficulty);
        console.log('Interview Type:', interviewType);
    };

    return (
        <div className={styles.page}>
            <div className={styles.formContainer}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label htmlFor="cv" className={styles.label}>Upload CV (PDF format):</label>
                        <input
                            type="file"
                            id="cv"
                            accept=".pdf"
                            onChange={handleCvChange}
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="jobDescription" className={styles.label}>Enter Job Description:</label>
                        <textarea
                            id="jobDescription"
                            value={jobDescription}
                            onChange={handleJobDescriptionChange}
                            className={styles.textarea}
                            rows="5"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="numQuestions" className={styles.label}>Number of Questions:</label>
                        <input
                            type="number"
                            id="numQuestions"
                            value={numQuestions}
                            onChange={handleNumQuestionsChange}
                            className={styles.input}
                            min="1"
                        />
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="difficulty" className={styles.label}>Difficulty Level:</label>
                        <select
                            id="difficulty"
                            value={difficulty}
                            onChange={handleDifficultyChange}
                            className={styles.select}
                        >
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <div className={styles.field}>
                        <label htmlFor="interviewType" className={styles.label}>Interview Type:</label>
                        <select
                            id="interviewType"
                            value={interviewType}
                            onChange={handleInterviewTypeChange}
                            className={styles.select}
                        >
                            <option value="Technical">Technical</option>
                            <option value="CV Grilling">CV Grilling</option>
                        </select>
                    </div>

                    <button type="submit" className={styles.button}>Submit</button>
                </form>
            </div>

            {/* Conditionally render branding if no CV is uploaded */}
            {!cv && (
                <div className={styles.branding}>
                    <h1 className={styles.brandName}>Intuiv.ai</h1>
                    <p className={styles.tagline}>Interview, Present, Succeed</p>
                </div>
            )}

            {cv && (
                <div className={styles.cvContainer}>
                    <iframe
                        src={cv}
                        className={styles.cvIframe}
                        title="CV Preview"
                    />
                </div>
            )}
        </div>
    );
};

export default UploadForm;
