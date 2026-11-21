/** @file
 * Questionnaire answ are mapped to ExerciseDB filter values.
 * keys must match the ans saved in questionnaire_responses.
  */

const PREFERENCE_FILTERS = {
    "At-Home workouts": {equipments: ["bodyweight"]},
    "Cardio Workouts": {targetMuscles: ["cardiovascular system"], bodyparts: ["cardio"]},
    "Weight machines": {equipments: ["cable","leverage machine","tire"]},
    "Yoga": {equipments: ["bodyweight"]},
};

const GOAL_FILTERS ={
    "Flexibility": {equipments: ["cardio"]}, // work in progress
    "Build muscle": {equipments:["cable","leverage machine","tire"]}, //work in progress
    "Endurance": {targetMuscles: ["cardiovascular system"]} //needs a plan to build consistency and goals
};

const BARRIER_FILTERS = {
    "Lack of equipment": {equipments: ["bodyweight"]},
};

const LEVEL_RULES = {
  Beginner:     { sets: 2, reps: 10, holdSeconds: 20, avoidEquipment: ["barbell"] },
  Intermediate: { sets: 3, reps: 12, holdSeconds: 30, avoidEquipment: [] },
  Advanced:     { sets: 4, reps: 12, holdSeconds: 45, avoidEquipment: [] },
};

const FOCUS_GROUPS = {
  upper: {
    id: "upper",
    title: "Upper Body",
    category: "Strength",
    subtitle: "Arms · Chest · Back",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e",
    bodyParts: ["chest", "back", "upper arms", "shoulders"],
  },
   
 lower: {
    id: "lower",
    title: "Lower Body",
    category: "Strength",
    Subtitle: "·legs · hamstrings ",
    image: "...", //to-do: add Image of lower body
    bodyParts: ["lower legs", "upper legs"], //db not might have isolated glute workouts
 },
  core: {
    id: "core",
    title: "abdominal",
    category: "Strength",
    Subtitle: "Abs · Stability",
    image: "...", //to-do: add Image of core
    bodyParts: ["waist"], //db not might have isolated glute workouts
 },
};

/*
*
*/
function addFilters(answers,lookup, filters){
    for(const answer of answers) {
        const match = lookup[answer]; //user answer are matched to filter options
        if(!match) continue;  //skip unmapped answ

        for(const [key,values] of Object.entries(match)){
            filters[key] = filters[key] || [];
            filters[key].push(...values);
        }
    }
}

module.exports = {PREFERENCE_FILTERS,GOAL_FILTERS,BARRIER_FILTERS,addFilters};


