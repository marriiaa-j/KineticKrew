import { useEffect, useState } from "react";
import {
  Activity,
  BarChart3,
  Clock3,
  Dumbbell,
  Flame,
  HeartPulse,
  ImagePlus,
  Plus,
  Save,
  Trash2,
  UserRound,
} from "lucide-react";
import "./MyProgress.css";

const defaultStrengthExercise = {
  name: "",
  sets: [{ weight: "", reps: "" }],
};

function MyProgress() {
  const [workoutType, setWorkoutType] = useState("strength");
  const [workoutName, setWorkoutName] = useState("");
  const [strengthExercises, setStrengthExercises] = useState([
    defaultStrengthExercise,
  ]);
  const [strengthDuration, setStrengthDuration] = useState("");
  const [strengthCalories, setStrengthCalories] = useState("");

  const [cardioType, setCardioType] = useState("Running");
  const [customCardioType, setCustomCardioType] = useState("");
  const [cardioDuration, setCardioDuration] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [cardioCalories, setCardioCalories] = useState("");

  const [flexibilityName, setFlexibilityName] = useState("");
  const [flexibilitySets, setFlexibilitySets] = useState([{ hold: "" }]);
  const [warmupSet, setWarmupSet] = useState("");
  const [progressPhoto, setProgressPhoto] = useState("");

  const [recentLogs, setRecentLogs] = useState(() => {
    return JSON.parse(localStorage.getItem("workoutLogs")) || [];
  });

  useEffect(() => {
    localStorage.setItem("workoutLogs", JSON.stringify(recentLogs));
  }, [recentLogs]);

  function addStrengthExercise() {
    setStrengthExercises([
      ...strengthExercises,
      {
        name: "",
        sets: [{ weight: "", reps: "" }],
      },
    ]);
  }

  function removeStrengthExercise(exerciseIndex) {
    setStrengthExercises(
      strengthExercises.filter((_, index) => index !== exerciseIndex)
    );
  }

  function updateExerciseName(index, value) {
    const updated = [...strengthExercises];
    updated[index].name = value;
    setStrengthExercises(updated);
  }

  function addStrengthSet(exerciseIndex) {
    const updated = [...strengthExercises];
    updated[exerciseIndex].sets.push({ weight: "", reps: "" });
    setStrengthExercises(updated);
  }

  function removeStrengthSet(exerciseIndex, setIndex) {
    const updated = [...strengthExercises];
    updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter(
      (_, index) => index !== setIndex
    );
    setStrengthExercises(updated);
  }

  function updateStrengthSet(exerciseIndex, setIndex, field, value) {
    const updated = [...strengthExercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setStrengthExercises(updated);
  }

  function addFlexibilitySet() {
    setFlexibilitySets([...flexibilitySets, { hold: "" }]);
  }

  function updateFlexibilitySet(index, value) {
    const updated = [...flexibilitySets];
    updated[index].hold = value;
    setFlexibilitySets(updated);
  }

  function removeFlexibilitySet(index) {
    setFlexibilitySets(
      flexibilitySets.filter((_, setIndex) => setIndex !== index)
    );
  }

  function handlePhotoUpload(event) {
    const file = event.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setProgressPhoto(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function saveWorkout(event) {
    event.preventDefault();

    let newLog;

    if (workoutType === "strength") {
      newLog = {
        id: Date.now(),
        type: "Strength Training",
        title: workoutName || "Strength Workout",
        duration: strengthDuration || 0,
        calories: strengthCalories || 0,
        date: new Date().toLocaleDateString(),
        details: strengthExercises,
      };
    }

    if (workoutType === "cardio") {
      newLog = {
        id: Date.now(),
        type: "Cardio",
        title:
          cardioType === "Custom"
            ? customCardioType || "Cardio Workout"
            : cardioType,
        duration: cardioDuration || 0,
        calories: cardioCalories || 0,
        heartRate: heartRate || 0,
        date: new Date().toLocaleDateString(),
      };
    }

    if (workoutType === "flexibility") {
      newLog = {
        id: Date.now(),
        type: "Flexibility",
        title: flexibilityName || "Flexibility Workout",
        duration: flexibilitySets.reduce(
          (total, set) => total + Number(set.hold || 0),
          0
        ),
        date: new Date().toLocaleDateString(),
        warmupSet,
        progressPhoto,
        details: flexibilitySets,
      };
    }

    setRecentLogs([newLog, ...recentLogs]);
    alert("Workout saved successfully!");
  }

  return (
    <main className="progress-page">
      <header className="progress-header">
        <div className="search-box">Search workouts, activities, goals...</div>

        <div className="profile-area">
          <UserRound size={22} />
          <span>First Name Last Name</span>
        </div>
      </header>

      <section className="page-title">
        <h1>My Progress</h1>
        <p>Log your workouts, track your improvements, and review your fitness journey.</p>
      </section>

      <nav className="progress-tabs">
        <button className="active-tab">
          <Plus size={18} />
          Log Activity
        </button>

        <button>
          <BarChart3 size={18} />
          Measurements
        </button>

        <button>
          <Activity size={18} />
          Body Stats
        </button>

        <button>
          <Clock3 size={18} />
          History
        </button>
      </nav>

      <div className="progress-layout">
        <form className="workout-card" onSubmit={saveWorkout}>
          <h2>Log a Workout</h2>

          <div className="workout-type-buttons">
            <button
              type="button"
              className={workoutType === "strength" ? "selected" : ""}
              onClick={() => setWorkoutType("strength")}
            >
              <Dumbbell size={18} />
              Strength Training
            </button>

            <button
              type="button"
              className={workoutType === "cardio" ? "selected" : ""}
              onClick={() => setWorkoutType("cardio")}
            >
              <HeartPulse size={18} />
              Cardio
            </button>

            <button
              type="button"
              className={workoutType === "flexibility" ? "selected" : ""}
              onClick={() => setWorkoutType("flexibility")}
            >
              <Activity size={18} />
              Flexibility
            </button>
          </div>

          {workoutType === "strength" && (
            <>
              <label>Workout Name</label>
              <input
                value={workoutName}
                onChange={(event) => setWorkoutName(event.target.value)}
                placeholder="Example: Upper Body Day"
              />

              {strengthExercises.map((exercise, exerciseIndex) => (
                <div className="exercise-box" key={exerciseIndex}>
                  <div className="exercise-title">
                    <h3>Exercise {exerciseIndex + 1}</h3>

                    {strengthExercises.length > 1 && (
                      <button
                        type="button"
                        className="remove-button"
                        onClick={() =>
                          removeStrengthExercise(exerciseIndex)
                        }
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    )}
                  </div>

                  <label>Exercise Name</label>
                  <input
                    value={exercise.name}
                    onChange={(event) =>
                      updateExerciseName(exerciseIndex, event.target.value)
                    }
                    placeholder="Example: Bench Press"
                  />

                  <div className="set-header">
                    <span>Set</span>
                    <span>Weight</span>
                    <span>Reps</span>
                    <span></span>
                  </div>

                  {exercise.sets.map((set, setIndex) => (
                    <div className="set-row" key={setIndex}>
                      <span>{setIndex + 1}</span>

                      <input
                        type="number"
                        placeholder="kg"
                        value={set.weight}
                        onChange={(event) =>
                          updateStrengthSet(
                            exerciseIndex,
                            setIndex,
                            "weight",
                            event.target.value
                          )
                        }
                      />

                      <input
                        type="number"
                        placeholder="Reps"
                        value={set.reps}
                        onChange={(event) =>
                          updateStrengthSet(
                            exerciseIndex,
                            setIndex,
                            "reps",
                            event.target.value
                          )
                        }
                      />

                      <button
                        type="button"
                        className="delete-set"
                        onClick={() =>
                          removeStrengthSet(exerciseIndex, setIndex)
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="add-set-button"
                    onClick={() => addStrengthSet(exerciseIndex)}
                  >
                    + Add Set
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="add-exercise-button"
                onClick={addStrengthExercise}
              >
                + Add Another Exercise
              </button>

              <div className="two-column-fields">
                <div>
                  <label>Total Duration (minutes)</label>
                  <input
                    type="number"
                    value={strengthDuration}
                    onChange={(event) =>
                      setStrengthDuration(event.target.value)
                    }
                  />
                </div>

                <div>
                  <label>Calories Burned (optional)</label>
                  <input
                    type="number"
                    value={strengthCalories}
                    onChange={(event) =>
                      setStrengthCalories(event.target.value)
                    }
                  />
                </div>
              </div>
            </>
          )}

          {workoutType === "cardio" && (
            <div className="form-section">
              <label>Cardio Type</label>

              <select
                value={cardioType}
                onChange={(event) => setCardioType(event.target.value)}
              >
                <option>Running</option>
                <option>Walking</option>
                <option>Elliptical</option>
                <option>Stairmaster</option>
                <option>Custom</option>
              </select>

              {cardioType === "Custom" && (
                <>
                  <label>Enter Cardio Type</label>
                  <input
                    value={customCardioType}
                    onChange={(event) =>
                      setCustomCardioType(event.target.value)
                    }
                    placeholder="Example: Cycling"
                  />
                </>
              )}

              <label>Duration in Minutes</label>
              <input
                type="number"
                value={cardioDuration}
                onChange={(event) => setCardioDuration(event.target.value)}
                required
              />

              <div className="two-column-fields">
                <div>
                  <label>Heart Rate (optional)</label>
                  <input
                    type="number"
                    value={heartRate}
                    onChange={(event) => setHeartRate(event.target.value)}
                    placeholder="BPM"
                  />
                </div>

                <div>
                  <label>Calories Burned (optional)</label>
                  <input
                    type="number"
                    value={cardioCalories}
                    onChange={(event) =>
                      setCardioCalories(event.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {workoutType === "flexibility" && (
            <div className="form-section">
              <label>Stretch or Flexibility Workout Name</label>
              <input
                value={flexibilityName}
                onChange={(event) => setFlexibilityName(event.target.value)}
                placeholder="Example: Full Body Stretch"
              />

              <h3>Hold Duration for Each Set</h3>

              {flexibilitySets.map((set, index) => (
                <div className="flexibility-set-row" key={index}>
                  <span>Set {index + 1}</span>

                  <input
                    type="number"
                    placeholder="Seconds"
                    value={set.hold}
                    onChange={(event) =>
                      updateFlexibilitySet(index, event.target.value)
                    }
                    required
                  />

                  {flexibilitySets.length > 1 && (
                    <button
                      type="button"
                      className="delete-set"
                      onClick={() => removeFlexibilitySet(index)}
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="add-set-button"
                onClick={addFlexibilitySet}
              >
                + Add Hold Set
              </button>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={warmupSet === "Completed"}
                  onChange={(event) =>
                    setWarmupSet(
                      event.target.checked ? "Completed" : ""
                    )
                  }
                />
                Include optional warm-up set
              </label>

              <label>Progress Picture (optional)</label>

              <label className="upload-box">
                <ImagePlus size={25} />
                <span>
                  {progressPhoto
                    ? "Progress picture selected"
                    : "Upload progress picture"}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                />
              </label>

              {progressPhoto && (
                <img
                  className="progress-preview"
                  src={progressPhoto}
                  alt="Progress preview"
                />
              )}
            </div>
          )}

          <button className="save-workout-button" type="submit">
            <Save size={18} />
            Save Workout
          </button>
        </form>

        <aside className="progress-sidebar">
          <section className="recent-card">
            <div className="section-heading">
              <h2>Recent Logs</h2>
              <span>View All →</span>
            </div>

            {recentLogs.length === 0 ? (
              <p className="empty-message">No workouts logged yet.</p>
            ) : (
              recentLogs.slice(0, 5).map((log) => (
                <div className="recent-log" key={log.id}>
                  <div className="recent-icon">
                    {log.type === "Cardio" ? (
                      <HeartPulse size={20} />
                    ) : log.type === "Flexibility" ? (
                      <Activity size={20} />
                    ) : (
                      <Dumbbell size={20} />
                    )}
                  </div>

                  <div>
                    <strong>{log.title}</strong>
                    <p>
                      {log.date} · {log.duration} minutes
                      {log.calories ? ` · ${log.calories} kcal` : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
          </section>

          <section className="improvement-card">
            <h2>Personal Improvement</h2>
            <p>Track your workout consistency over time.</p>

            <div className="progress-bars">
              {[35, 52, 48, 70, 82].map((height, index) => (
                <div className="bar-column" key={index}>
                  <div
                    className="progress-bar"
                    style={{ height: `${height}px` }}
                  ></div>
                  <span>Week {index + 1}</span>
                </div>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}

export default MyProgress;