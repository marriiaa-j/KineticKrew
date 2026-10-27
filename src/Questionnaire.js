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
  function handleNext() {
  const profile = {
    gender: sex,
    age: Number(age),
    height_inches: Number(heightFeet) * 12 + Number(heightInches || 0),
    weight_lbs: Number(weight),
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
              
            <button onClick={() => navigate('/fitnessquestions')}>
                Next
            </button>
         </div>   
    </div>
  </div>
    );
  }
export default Questionnaire;
