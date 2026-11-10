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
    Number(weight) < 50;

  if (hasMissingAnswer) {
    setFormError('Please answer all questions before continuing.');
    return;
  }
  if (hasInvalidAnswer) {
    setFormError('Some answers are invalid. Please correct them before continuing.');
    return;
  }

  setFormError('');
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
             //disabled={!profileComplete}
                >Next
            </button>
           </div>   
    </div>
    
  </div>

    );
  }
export default Questionnaire;
