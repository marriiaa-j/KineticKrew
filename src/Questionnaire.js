
/**
 * @file Questionnaire.js
 * @module Questionnaire
 * @author  Martha Jauregui (original page and developed questions)
 * @author Citlalli Martinez (Fixed routing so answers can carry over to next page)
 * @author Angela Fernandez (Connected Questionnaire to DB)
 * @date 2026-10-22 

 *
 * @description
 This React module creates the profile questionnaire page. It collects
 * the user's sex, age, height, and weight before allowing the user to
 * continue to the fitness questionnaire.
 *
 * Important Functions:
 *
 * handleNext()
 * Input:
 *   The profile answers stored in React state.
 * Output:
 *   Navigates to FitnessQuestions.js when all answers are valid.
 *   Displays an error message when answers are missing or invalid.
 *
 * Age validation handler
 * Input:
 *   The age entered by the user.
 * Output:
 *   Updates the age state and displays an error if the age is below 13,
 *   above 100, or contains invalid characters.
 *
 * Height validation handlers
 * Input:
 *   Feet and inches entered by the user.
 * Output:
 *   Updates the height values and displays errors for values outside
 *   the accepted ranges.
 *
 * Weight validation handler
 * Input:
 *   The weight entered by the user.
 * Output:
 *   Updates the weight state and displays an error if the weight is
 *   outside the accepted range.
 *
 * Data Structures:
 *   React state variables store individual answers and error messages.
 *   A profile object stores the completed profile answers before they
 *   are passed to the next page through React Router.
 *
 * Algorithm:
 *   The module uses conditional validation with if statements and
 *   logical operators. This approach was selected because the profile
 *   contains a small number of independent fields and direct validation
 *   is easy to read and maintain.
 */

import './Questionnaire.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Questionnaire() {
  const navigate = useNavigate();
  //Profile Questions
  const [sex, setSex] = useState(''); //Question 1

  const [age, setAge] = useState(''); //Question 2
    const [ageError, setAgeError] = useState('');//Question 1

  const [heightFeet, setHeightFeet] = useState(''); //Question 3
    const [heightFeetError, setHeightFeetError] = useState('');

  const [heightInches, setHeightInches] = useState(''); //Question 3
      const [heightInchesError, setHeightInchesError] = useState('');

  const [weight, setWeight] = useState(''); //Question 4

  const [weightError, setWeightError] = useState('');

  const [formError, setFormError] = useState('');




  const profileComplete =
    sex !== '' &&
    age !== '' &&
    ageError === '' &&
    Number(age) >= 13 &&
    Number(age) <= 100 &&
    heightFeet !== '' &&
    heightFeetError === '' &&
    Number(heightFeet) >= 2 &&
    Number(heightFeet) <= 8 &&
    heightInches !== '' &&
    Number(heightInches) >= 0 &&
    Number(heightInches) <= 11 &&
    heightInchesError === '' &&
    weight !== '' &&
    weightError === '' &&
    Number(weight) >= 50 &&
    Number(weight) <= 800;



useEffect(() => {
  if (profileComplete) {
    setFormError('');
  }
}, [profileComplete]);


 function handleNext() {
  
  const hasMissingAnswer =
    sex === '' ||
    age === '' ||
    heightFeet === '' ||
    heightInches === '' ||
    weight === '';

   const hasInvalidAnswer =
    ageError !== '' ||
    Number(age) < 13 ||
    Number(age) > 100 ||
    heightFeetError !== '' ||
    Number(heightFeet) < 2 ||
    Number(heightFeet) > 8 ||
    heightInchesError !== '' ||
    Number(heightInches) < 0 ||
    Number(heightInches) > 11 ||
    weightError !== '' ||
    Number(weight) < 50 ||
    Number(weight) > 800;

  //    console.log({
  //   sex,
  //   age,
  //   heightFeet,
  //   heightInches,
  //   weight,
  //   ageError,
  //   heightFeetError,
  //   heightInchesError,
  //   weightError,
  //   hasMissingAnswer,
  //   hasInvalidAnswer
  // });

  if (hasMissingAnswer) {
    setFormError('Please answer all questions before continuing.');
    return;
  }
  if (hasInvalidAnswer) {
    setFormError('Some answers are invalid. Please correct them before continuing.');
    return;
  }

  setFormError('');
 console.log('Navigating to fitness questions');
  navigate('/fitnessquestions',{
     state: {
        profile: {
          sex,
          age,
          heightFeet,
          heightInches,
          weight
        }
      }
    });
  }
//starting the return of the component
  return (
    <div className="questionnaire-page">
    <div className="questionnaire-container">
      <h1>Profile Questionnaire</h1>

      {/* Question 1 */} 
      <div className="question-block">
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
    </div>
  

    {/* Question 2 */}
    <div className="question-block">
        <h2>What is your age?</h2> 
        <p className="age-requirement">
          Users must be at least 13 years old to use this app.
        </p>

      <input
      className="age-input"
      type="number"
      min="0"
      step="1"
      value={age}
      onChange={(event) => {
        const value = event.target.value;
        setAge(value);

        if (value === '') {
          setAgeError('');
        } else if (Number(value) < 13) {
          setAgeError('You must be 13 or older to use this app.');
        } else if (Number(value) > 100) {
          setAgeError('Age cannot exceed 100.');
        } else {
          setAgeError('');
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' && Number(age) <= 13) {
          event.preventDefault();
          setAgeError('You must be 13 or older to use this app.');
          return
        }

        if (event.key === 'ArrowUp' && Number(age) >= 100) {
          event.preventDefault();
          setAgeError('Age cannot exceed 100.');
          return;
        }
        const isLetter = /^[a-zA-Z]$/.test(event.key);
      const invalidCharacters = ['e', 'E', '+', '-', '.'];

      if (isLetter || invalidCharacters.includes(event.key)) {
        event.preventDefault();
        setAgeError('Age must contain whole numbers only.');
      }
      }}

      />
      <span> years </span>
      <div className="error-slot">
      {age !== '' && ageError && (
        <p className="error-message">{ageError}</p>
      )}
      </div>
    </div>
    
  {/* Question 3 */}
  <div className="question-block">
  <h2>What is your height?</h2>

  <div className="height-input-row">
    {/* Feet input */}
    <input
      className="height-input"
      type="number"
      min="0"
      step="1"
      value={heightFeet}
      onChange={(event) => {
        const value = event.target.value;
        setHeightFeet(value);

        if (value === '') {
          setHeightFeetError('');
        } else if (Number(value) < 2) {
          setHeightFeetError(
            'Invalid input. Height must be at least 2 feet.'
          );
        } else if (Number(value) > 8) {
          setHeightFeetError(
            'Invalid input. Height cannot exceed 8 feet.'
          );
        } else {
          setHeightFeetError('');
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' && Number(heightFeet) <= 2) {
          event.preventDefault();
          setHeightFeetError(
            'Height must be at least 2 feet.'
          );
        }

        if (event.key === 'ArrowUp' && Number(heightFeet) >= 8) {
          event.preventDefault();
          setHeightFeetError(
            'Height cannot exceed 8 feet.'
          );
        }
      }}
    />

    <span>feet </span>

    {/* Inches input */}
    <input
      className="height-input"
      type="number"
      min="0"
      max="11"
      step="1"
      value={heightInches}
      onChange={(event) => {
        const value = event.target.value;
        setHeightInches(value);

        if (value === '') {
          setHeightInchesError('');
        } else if (Number(value) < 0) {
          setHeightInchesError(
            'Invalid input. Inches cannot be below 0.'
          );
        } else if (Number(value) > 11) {
          setHeightInchesError(
            'Invalid input. Inches cannot exceed 11.'
          );
        } else {
          setHeightInchesError('');
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowDown' && Number(heightInches) <= 0) {
          event.preventDefault();
          setHeightInchesError(
            'Inches cannot be below 0.'
          );
        }

        if (event.key === 'ArrowUp' && Number(heightInches) >= 11) {
          event.preventDefault();
          setHeightInchesError(
            'Inches cannot exceed 11.'
          );
        }
      }}
    />

    <span>inches</span>
  </div>

  <div className="height-error-slot">
    {heightFeetError && (
      <p className="error-message">{heightFeetError}</p>
    )}

    {heightInchesError && (
      <p className="error-message">{heightInchesError}</p>
    )}
  </div>
</div>

    {/* Question 4 */}
    <div className="question-block">
    <h2>What is your weight?</h2>

    <input
      className="weight-input"
      type="number"
      min="0"
      step="1"
      value={weight}
      onChange={(event) => {
        const value = event.target.value;
        setWeight(value);

        if (value === '') {
          setWeightError('');
        } else if (Number(value) < 50) {
          setWeightError(
            'Invalid weight input. Must be greater than 50 lbs.'
          );
        }else if (Number(value) > 800) {
          setWeightError(
            'Invalid weight input. Must be less than 800 lbs.'
          );
        } else {
          setWeightError('');
        }
      }}
      placeholder=" "
    />
    <span> lbs </span>
    
    {weightError && (
      <p className="error-message">{weightError}</p>
    )}

  
</div>

    {formError && (
      <p className="error-message">{formError}</p>
    )}

     <div className="navigation-buttons">
            <button onClick={() => navigate('/homepage')}>
             Back
             </button>
             
            <button 
             className="next-button"
             onClick={handleNext} 
                >
                  Next
            </button>
           </div>   
    </div>
    
  </div>

    );
  }
export default Questionnaire;
 