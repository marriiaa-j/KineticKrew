
/**
 * @file FitnessQuestions.js
 * @module FitnessQuestions
 * @author  Martha Jauregui (original page and developed questions)
 * @author Citlalli Martinez (Fixed routing so answers can carry over to next page)
 * @author Angela Fernandez (Connected Questionnaire to DB)
 * @date 2026-10-25

 * @description
 * This React module creates the fitness questionnaire page. It collects
 * the user's fitness level, fitness goals, available workout days,
 * workout preferences, and barriers to exercising.
 *
 * Important Functions:
 *
 * toggleFitnessGoals(goal)
 * Input:
 *   A fitness goal selected by the user.
 * Output:
 *   Adds the goal to the selected goals array or removes it if it was
 *   already selected.
 *
 * toggleWorkoutPreference(preference)
 * Input:
 *   A workout preference selected by the user.
 * Output:
 *   Adds or removes the preference from the selected preferences array.
 *
 * toggleBarrier(barrier)
 * Input:
 *   An exercise barrier selected by the user.
 * Output:
 *   Adds or removes the barrier from the barriers array. The function
 *   prevents the user from selecting more than three barriers.
 *
 * handleSubmit()
 * Input:
 *   The profile answers and fitness questionnaire answers.
 * Output:
 *   Sends the completed answers to the backend API. If successful,
 *   the user is redirected to the homepage. If unsuccessful, an error
 *   message is displayed.
 *
 * Data Structures:
 *   Arrays store multiple selections, including fitness goals,
 *   workout preferences, and exercise barriers.
 *   The answers object combines profile and fitness information before
 *   it is sent to the backend.
 *
 * Algorithm:
 *   The selection functions use an array-toggle algorithm. The includes()
 *   method checks whether an item is selected. The filter() method removes
 *   an existing item, and the spread operator adds a new item.
 *   This approach prevents duplicate selections and is easy to maintain.
 */

import './Questionnaire.css';
import {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';


function FitnessQuestions() {
    const location = useLocation();
    const profile = location.state?.profile || {};
    const [saveError, setSaveError] = useState('');
    const navigate = useNavigate();

    const [fitnessLevel, setFitnessLevel] = useState(''); //Question 5
    const [fitnessGoals, setFitnessGoals] = useState([]); //Question 6
    const [workoutDays, setWorkoutDays] = useState(''); //Question 7
    const [workoutPreferences, setWorkoutPreferences] = useState([]); // Question 8
    const [barriers, setBarriers] = useState([]);  // Question 9
    const [barrierError, setBarrierError] = useState('');

// Functions to handle toggling selections for barriers, workout preferences, and fitness goals
function toggleBarrier(barrier) {
  setBarriers((currentBarriers) => {
    if (currentBarriers.includes(barrier)) {
      setBarrierError('');
      return currentBarriers.filter((item) => item !== barrier);
    }

    if (currentBarriers.length >= 3) {
      setBarrierError('You can only choose up to 3 barriers.');
      return currentBarriers;
    }

    setBarrierError('');
    return [...currentBarriers, barrier];
  });
}

function toggleWorkoutPreference(preference) {
  setWorkoutPreferences((currentPreferences) => {
    if (currentPreferences.includes(preference)) {
      return currentPreferences.filter((item) => item !== preference);
    }

    return [...currentPreferences, preference];
  });
}



/**
 * Combines page 1 answers (profile) with page 2 answers and sends them to the backend.
 * Uses credentials: 'include' so the login session cookie is sent.
 * On success goes to the homepage; on failure shows the backend's error message.
 * @async
 * @returns {Promise<void>}
 */

    async function handleSubmit() {
      setSaveError('');

      const answers = {
        ...profile,
        fitness_level: fitnessLevel || null,
        fitness_goals: fitnessGoals,
        days_per_week: workoutDays || null,
        workout_preferences: workoutPreferences,
        barriers: barriers,
    };

    try {
    const res = await fetch('http://localhost:4000/api/questionnaire', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(answers),
    });

    const data = await res.json();

    if (!res.ok) {
        setSaveError(data.error || 'Could not save your answers.');
        return;
    }

    navigate('/homepage');
        } catch (err) {
        setSaveError('Could not reach the server. Is the backend running?');
        }
}

function toggleFitnessGoals(goal) {
  setFitnessGoals((currentGoals) => {
    if (currentGoals.includes(goal)) {
      return currentGoals.filter((item) => item !== goal);
    }

    return [...currentGoals, goal];
  });
}

//starting the return of the component

return (
    <div className="questionnaire-page">
        <div className="questionnaire-container fitness-questionnaire">

    

        <h1>Fitness Questionnaire</h1>

        {/* Question 5 */}
        <div className="question-block">
        <h2>What is your current fitness level? </h2>
        <div className="fitness-level-buttons">
          <button 
          className={fitnessLevel === 'Beginner' ? 'selected' : ''}
          onClick={() => setFitnessLevel('Beginner')}> Beginner 
          </button>

          <button 
          className={fitnessLevel === 'Intermediate' ? 'selected' : ''}
          onClick={() => setFitnessLevel('Intermediate')}> Intermediate 
          </button>

          <button 
          className={fitnessLevel === 'Advanced' ? 'selected' : ''}
          onClick={() => setFitnessLevel('Advanced')}> Advanced 
          </button>
          </div>
     </div>

          {/* Question 6 */}
        <div className="question-block">
        <h2>What is your main fitness goal? </h2> 
        <h4>Click all that apply </h4>
        <div className="fitness-goals-buttons">
            <button 
            className={fitnessGoals.includes('Flexibility') ? 'selected' : ''}
            onClick={() => toggleFitnessGoals('Flexibility')}> Improve Flexibility</button>

            <button 
            className={fitnessGoals.includes('Build muscle') ? 'selected' : ''}
            onClick={() => toggleFitnessGoals('Build muscle')}> Build Muscle </button>
            
            <button 
            className={fitnessGoals.includes('Lose weight') ? 'selected' : ''}
            onClick={() => toggleFitnessGoals('Lose weight')}> Lose Weight </button>

            <button 
            className={fitnessGoals.includes('Endurance') ? 'selected' : ''}
            onClick={() => toggleFitnessGoals('Endurance')}> Improve Endurance </button>

            <button 
            className={fitnessGoals.includes('Bulk') ? 'selected' : ''}
            onClick={() => toggleFitnessGoals('Bulk')}> Bulk Up </button>

            <button 
            className={fitnessGoals.includes('Toned') ? 'selected' : ''}
            onClick={() => toggleFitnessGoals('Toned')}> Tone Muscles </button>
        </div>
        </div>

        {/* Question 7 */}
        <div className="question-block">
        <h2>How many days per week can you exercise?</h2> 
        <div className="workout-days-buttons">
        <button 
        className={workoutDays === '1–2 days' ? 'selected' : ''}
        onClick={() => setWorkoutDays('1–2 days')}> 1–2 days </button>

        <button 
        className={workoutDays === '3–4 days' ? 'selected' : ''}
        onClick={() => setWorkoutDays('3–4 days')}> 3–4 days</button>

        <button 
        className={workoutDays === '5–7 days' ? 'selected' : ''}
        onClick={() => setWorkoutDays('5–7 days')}> 5–7 days </button>
        </div>
    </div>

        {/* Question 8 */}
        <div className="question-block">
        <h2>Which are you more comfortable with?</h2>
        <h4>Choose all that apply</h4>
        <div className="fitness-preferences-buttons">
            <button 
            className={workoutPreferences.includes('Cardio') ? 'selected' : ''}
            onClick={() => toggleWorkoutPreference('Cardio')}>
                Cardio Workouts
            </button>

            <button 
            className={workoutPreferences.includes('Yoga') ? 'selected' : ''}
            onClick={() => toggleWorkoutPreference('Yoga')}>
            Yoga & Stretching
            </button>

            <button 
            className={workoutPreferences.includes('Weight machines') ? 'selected' : ''}
            onClick={() => toggleWorkoutPreference('Weight machines')}>
                Weight machines
            </button>

            <button 
            className={workoutPreferences.includes('At-Home workouts') ? 'selected' : ''}
            onClick={() => toggleWorkoutPreference('At-Home workouts')}>
                At-Home workouts
            </button>
            </div>
        </div>

        {/* Question 9 */}
        <div className="question-block">
        <h2>What prevents you from exercising?</h2>
        <h4>Choose up to 3</h4>
        {/* <p>Selected: {barriers.length}/3</p> */}

        {barrierError && (
        <p className="error-message">{barrierError}</p>
        )}

        <div className="fitness-barriers">
            <button 
                className={barriers.includes('Motivation') ? 'selected' : ''}
                onClick={() => toggleBarrier('Motivation')}>
                Motivation
            </button>

            <button 
                className={barriers.includes('Money') ? 'selected' : ''}
                onClick={() => toggleBarrier('Money')}>
                Money
            </button>

            <button 
                className={barriers.includes('Time') ? 'selected' : ''}
                onClick={() => toggleBarrier('Time')}>
                Time
            </button>

            <button 
                className={barriers.includes('Distance') ? 'selected' : ''}
                onClick={() => toggleBarrier('Distance')}>
                Distance
            </button>

            <button 
                className={barriers.includes('Lack of equipment') ? 'selected' : ''}
                onClick={() => toggleBarrier('Lack of equipment')}>
                Lack of equipment
            </button>

            <button 
                className={barriers.includes('Lack of Knowledge') ? 'selected' : ''}
                onClick={() => toggleBarrier('Lack of Knowledge')}>
                Not knowing where to start
            </button>

            <button 
                className={barriers.includes('Health Concerns') ? 'selected' : ''}
                onClick={() => toggleBarrier('Health Concerns')}>
                Health Concerns
            </button>

            <button 
                className={barriers.includes('Confidence') ? 'selected' : ''}
                onClick={() => toggleBarrier('Confidence')}>
            Lack of Confidence
            </button>

            <button 
                className={barriers.includes('Priorities') ? 'selected' : ''}
                onClick={() => toggleBarrier('Priorities')}>
            Other Priorities
            </button>

            </div>
        </div>

        {saveError && <p className="error-message">{saveError}</p>}

        <div className="navigation-buttons">
             <button onClick={() => navigate('/questionnaire')}>
             Back
             </button>

            <button onClick={handleSubmit}>
            Submit
            </button>
         </div> 
    
    </div>
 </div>
  );
}


export default FitnessQuestions;