import { useState } from 'react';

function Questionnaire() {
  const [fitnessLevel, setFitnessLevel] = useState('');
  const [fitnessGoals, setFitnessGoals] = useState([]);

  function toggleFitnessGoals(goal) {
  setFitnessGoals((currentGoals) => {
    if (currentGoals.includes(goal)) {
      return currentGoals.filter((item) => item !== goal);
    }

    return [...currentGoals, goal];
  });
}
  return (
    <div>
      <h1>Fitness Questionnaire</h1>

      {/* Question 1 */}
      <h2>What is your current fitness level? </h2>

          <button onClick={() => setFitnessLevel('Beginner')}> Beginner </button>

          <button onClick={() => setFitnessLevel('Intermediate')}> Intermediate </button>

          <button onClick={() => setFitnessLevel('Advanced')}> Advanced </button>

{fitnessLevel && (
  <p>Your fitness level is: {fitnessLevel}</p>
  )}

   {/* Question 2 */}
  <h2>What is your main fitness goal? </h2> 
  <h4>Click all that apply </h4>
        <button onClick={() => toggleFitnessGoals('Flexibility')}> Flexibility</button>
        <button onClick={() => toggleFitnessGoals('Build muscle')}> Build Muscle </button>
        <button onClick={() => toggleFitnessGoals('Lose weight')}> Lose Weight </button>
        <button onClick={() => toggleFitnessGoals('Endurance')}> Improve endurance </button>
        <button onClick={() => toggleFitnessGoals('Bulk')}> Bulk </button>
        <button onClick={() => toggleFitnessGoals('Toned')}> Toned </button>
        
  {fitnessGoals && (
  <p>Your fitness goals are: {fitnessGoals.join(', ')}</p>
)}
</div>

  );
}
export default Questionnaire;
