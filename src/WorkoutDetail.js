import { useLocation, Link } from 'react-router-dom';
import './WorkoutDetail.css';

function WorkoutDetail() {
  const { state: workout } = useLocation();

  if (!workout) {
    return (
      <main className="workout-detail-page">
        <h1>Workout not found</h1>
        <Link to="/workouts">Return to Workouts</Link>
      </main>
    );
  }

  return (
    <main className="workout-detail-page">
      <img
        className="workout-detail-image"
        src={workout.image}
        alt={workout.title}
      />

      <section className="workout-detail-content">
        <h1>{workout.title}</h1>
        <h2>Exercises</h2>

        <div className="exercise-list">
          {workout.exercises.map((exercise) => (
            <div className="exercise-item" key={exercise.name}>
              <h3>{exercise.name}</h3>
              <p>{exercise.duration}</p>
            </div>
          ))}
        </div>

        <Link to="/workouts" className="back-button">
          Back to Workouts
        </Link>
      </section>
    </main>
  );
}

export default WorkoutDetail;