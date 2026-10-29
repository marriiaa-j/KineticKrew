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

    function toggleFitnessGoals(goal) {
  setFitnessGoals((currentGoals) => {
    if (currentGoals.includes(goal)) {
      return currentGoals.filter((item) => item !== goal);
    }

    return [...currentGoals, goal];
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

function toggleBarrier(barrier) {
  setBarriers((currentBarriers) => {
    if (currentBarriers.includes(barrier)) {
      return currentBarriers.filter((item) => item !== barrier);
    }

    return [...currentBarriers, barrier];
  });
}

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

    return (
        <div className="questionnaire-container">
            <h1>Fitness Questionnaire</h1>

            {/* Question 5 */}
         <h2>What is your current fitness level? </h2>

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

      {/* {fitnessLevel && (
      <p>You answered: {fitnessLevel}</p>
      )} */}

          {/* Question 6 */}
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
        {/* {fitnessGoals.length > 0 && (
         <p>Your fitness goals are: {fitnessGoals.join(', ')}</p>
         )} */}

        {/* Question 7 */}
        <h2>How many days per week can you exercise?</h2> 

        <button 
        className={workoutDays === '1–2 days' ? 'selected' : ''}
        onClick={() => setWorkoutDays('1–2 days')}> 1–2 days </button>

        <button 
        className={workoutDays === '3–4 days' ? 'selected' : ''}
        onClick={() => setWorkoutDays('3–4 days')}> 3–4 days</button>

        <button 
        className={workoutDays === '5–7 days' ? 'selected' : ''}
        onClick={() => setWorkoutDays('5–7 days')}> 5–7 days </button>

            {/* {workoutDays && (
                <p>You can exercise: {workoutDays}</p>
            )} */}

                {/* Question 8 */}
            <h2>Which are you more comfortable with?</h2>
            <h4>Choose all that apply</h4>

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

            {/* {workoutPreferences.length > 0 && (
        <p>
            You are comfortable with: {workoutPreferences.join(', ')}
            </p>
            )} */}

            {/* Question 9 */}
            <h2>What prevents you from exercising?</h2>
            <h4>Choose all that apply</h4>

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
        {/* {barriers.length > 0 && (
            <p> What prevents you: {barriers.join(', ')} </p>
        )} */}

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
  );
}

export default FitnessQuestions;