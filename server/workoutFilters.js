/** @file
 * Questionnaire answ are mapped to ExerciseDB filter values.
 * keys must match the asw saved in questionnaire_responses.
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

