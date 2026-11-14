
/**
 * @file Questionnaire.js
 * @module Questionnaire
 * @author  Martha Jauregui (original page and developed questions)
 * @author Citlalli Martinez (Fixed routing so answers can carry over to next page)
 * @author Angela Fernandez (Connected Questionnaire to DB)
 * @date 2026-10-22 

 *
 * @description
 * Step 1 of the onboarding questionnaire (React component). Collects profile
 * answers (sex, age, height, weight), validates them, and passes them to step 2
 * (FitnessQuestions.js), where all answers are saved together.
 *
 * **Important data structures**
 * - **Answer state strings** (`sex`, `age`, `heightFeet`, `heightInches`, `weight`):
 *   controlled input values for each question.
 * - **`profile` object** `{ sex, age, height_inches, weight_lbs }`: this page's answers,
 *   using the backend's field names, passed to the next page through React Router state.
 *
 * **Algorithms and why they were chosen**
 * - **Multi-step form with a single final save** instead of saving after every page:
 *   avoids storing half-finished questionnaires, and the server requires answers
 *   from both pages in one request.
 * - **Router state** to pass answers between pages instead of global state
 *   (Context/Redux): simplest option for a two-step flow. Trade-off: answers are
 *   lost if the page is refreshed mid-questionnaire.
 * - **Height conversion** `feet * 12 + inches`: stores one number in the database,
 *   which is easier to compare and calculate with than two separate values.
 */

import './Questionnaire.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Questionnaire() {
  const navigate = useNavigate();
  //Profile Questions
  const [sex, setSex] = useState(''); //Question 1
  const [age, setAge] = useState(''); //Question 2
  const [heightFeet, setHeightFeet] = useState(''); //Question 3
  const [heightInches, setHeightInches] = useState(''); //Question 3
  const [weight, setWeight] = useState(''); //Question 4


  //---- passes server values to next page CM----
    //---- passes page 1 answers to the next page ----
  function handleNext() {
    const profile = {
      sex: sex || null,
      age: age === '' ? null : Number(age),
      height_inches: heightFeet === '' ? null : Number(heightFeet) * 12 + Number(heightInches || 0),
      weight_lbs: weight === '' ? null : Number(weight),
    };
    navigate('/fitnessquestions', { state: { profile } });
  }

  return (
    <div className="questionnaire-page">
    <div className="questionnaire-container">
      <h1>Profile Questionnaire</h1>

        {/* Question 1 */} 
      <h2>What is your sex?</h2>

      <button 
        className={sex === 'Female' ? 'selected' : ''}
        onClick={() => setSex('Female')} >
        Female
      </button>

      <button 
        className={sex === 'Male' ? 'selected' : ''}
        onClick={() => setSex('Male')} >
        Male
      </button>

      {/* <button onClick={() => setGender('Prefer not to say')}>
        Prefer not to say
      </button> */}

    {/* {sex && <p> You answered: {sex} </p>} */}


        {/* Question 2 */}
    <h2>What is your age?</h2> 

    <input
      className="age-input"
      type="number"
      min="0"
      value={age}
      onChange={(event) => setAge(event.target.value)}
      placeholder=" "
    />
    <span> years </span>
    {/* {age && Number(age) >= 13 && (
    //<p>You answered: {age} years old</p>
    )} */}

    {age !== '' && Number(age) < 13 && (
      <p className="error-message">
        Invalid age input. Must be 13 or older to use this app.
      </p>
    )}
    

        {/* Question 3 */}
    <h2>What is your height?</h2>

        {/* height */}
    <input
     className="height-input"
      type="number"
      min="0"
      value={heightFeet}
      onChange={(event) => setHeightFeet(event.target.value)}
      placeholder=" "
    />
    <span> feet </span>

        {/* inches */}
    <input
    className="height-input"
    type="number"
    min="0"
    value={heightInches}
    onChange={(event) => setHeightInches(event.target.value)}
    placeholder=" "
    />
    <span> inches </span>

    {/* on click appear */}
    {/* {heightFeet && heightInches && (
    <p>
      You answered: {heightFeet} feet & {heightInches} inches
    </p>
    )} */}

      {heightInches !== '' && Number(heightInches) > 11 && (
      <p className="error-message">
        Invalid inches input. Enter 0–11 inches.
      </p>
    )}

        {/* Question 4 */}
    <h2>What is your weight?</h2>

    <input
      className="weight-input"
      min="0"
      type="number"
      value={weight}
      onChange={(event) => setWeight(event.target.value)}
      placeholder=" "
    />
    <span> lbs </span>
    

    {/* {weight && Number(weight) > 0 && (
    <p>
      You answered: {weight} lbs
    </p>
    )} */}
    {weight !== '' && Number(weight) <= 0 && (
      <p className="error-message">
        Invalid weight input. Must be greater than 0.
      </p>
    )}

     <div className="navigation-buttons">
            <button onClick={() => navigate('/homepage')}>
             Back
             </button>
        
             <button onClick={handleNext}> 
              Next
              </button>
         </div>   
    </div>
  </div>
    );
  }
export default Questionnaire;
