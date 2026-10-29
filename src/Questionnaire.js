import './Questionnaire.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Questionnaire() {
  const navigate = useNavigate();
  //Profile Questions
  const [sex, setSex] = useState(''); //Question 1
  const [ageError, setAgeError] = useState('');//Question 1
  const [age, setAge] = useState(''); //Question 2
  const [heightFeet, setHeightFeet] = useState(''); //Question 3
  const [heightInches, setHeightInches] = useState(''); //Question 3
  const [weight, setWeight] = useState(''); //Question 4
  const profileComplete =
  sex !== '' &&
  age !== '' &&
  ageError === '' &&
  Number(age) >= 13 &&
  Number(age) <= 100 &&
  heightFeet !== '' &&
  heightInches !== '' &&
  Number(heightInches) <= 11 &&
  weight !== '' &&
  Number(weight) > 0;


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
    <p className="age-requirement">Users must be at least 13 years old to use this app.</p>

<input
  className="age-input"
  type="number"
  min="13"
  max="100"
  step="1"
  value={age}
  placeholder=" "
  onChange={(event) => {
    const value = event.target.value;

    if (value === '') {
      setAge('');
      setAgeError('');
      return;
    }

    if (!/^\d+$/.test(value)) {
      setAgeError('Invalid input. Age must contain whole numbers only.');
      return;
    }

    // Keeps one zero, so 0000 becomes 0
    const cleanedValue = value.replace(/^0+(?=\d)/, '');

    if (Number(cleanedValue) > 100) {
      setAge(age);
      setAgeError('Invalid input. Age cannot be over 100.');
      return;
    }

    setAge(cleanedValue);

    if (Number(cleanedValue) < 13) {
      setAgeError(
        'Invalid input. You must be 13 or older to use this app.'
      );
    } else {
      setAgeError('');
    }
  }}

  onKeyDown={(event) => {
  if (event.key === 'ArrowUp' && Number(age) >= 100) {
    event.preventDefault();
    return;
  }

  const isLetter = /^[a-zA-Z]$/.test(event.key);
  const invalidCharacters = ['e', 'E', '+', '-', '.'];

  if (isLetter || invalidCharacters.includes(event.key)) {
    event.preventDefault();
    setAgeError('Invalid input. Age must contain whole numbers only.');
  }
  }}

  onPaste={(event) => {
    const pastedText = event.clipboardData.getData('text');

    if (pastedText === '') {
      setAgeError('');
    } else if (!/^\d+$/.test(pastedText)) {
      event.preventDefault();
      setAgeError(
        'Invalid input. Age must contain whole numbers only.'
      );
    }
  }}
/>
<span> years </span>
{age !== '' && ageError && (
  <p className="error-message">{ageError}</p>
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
             
            <button 
             classname="next-button"
             onClick={() => navigate('/fitnessquestions')} 
             disabled={!profileComplete}>
                Next
            </button>
            
         </div>   
    </div>
  </div>
    );
  }
export default Questionnaire;
