import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { 
  House,
  Dumbbell,
  ChartNoAxesColumn,
  Heart,
  Trophy,
  UsersRound,
  Settings,
  CircleHelp,
  Search,
  Bell,
  UserRound,
  ChevronDown,
  Subtitles
} from 'lucide-react';

import './Homepage.css';
import './WorkoutPage.css';


function WorkoutPage() { // This is the main component for the Workout Page
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMuscleCategory, setSelectedMuscleCategory] = useState('All');
  

    function handleSearch(event) {
    event.preventDefault();
    }

   const bodyFocusWorkouts = [
  {
    id:'upper',
    title: 'Upper Body',
    category: 'Strength',
    Subtitles: 'Arms · Chest · Back',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e',
    exercises: [
    { id:'01qpYSe', name:'push-up', gifUrl:'...', sets:3, reps:10, instruction:ex.instruction}
  ]
  },
  {
    title: 'Lower Body',
    category: 'Strength',
    description: 'Glutes · Legs',
    image: 'https://i.pinimg.com/736x/c9/a8/ed/c9a8ed282dc7e38def621a76a7a71bd3.jpg',
    exercises: [
    { name: 'Squats', duration: '3 sets of 12' },
    { name: 'Lunges', duration: '3 sets of 10' },
    { name: 'Glute Bridges', duration: '3 sets of 15' }
  ]
  },
  {
    title: 'Core',
    category: 'Strength',
    description: 'Abs · Stability',
    image: 'https://i.pinimg.com/1200x/ce/78/6a/ce786ab04ac3632ac42305b015ab06d2.jpg',
      exercises: [
    { name: 'Plank', duration: '30 seconds' },
    { name: 'Russian Twists', duration: '3 sets of 20' },
    { name: 'Mountain Climbers', duration: '1 minute' }
  ]
  },
  {
    title: 'Cardio',
    category: 'Cardio',
    description: 'Heart · Endurance',
    image: 'https://i.pinimg.com/1200x/41/7d/9e/417d9ec566e9d0cb6930990079360d99.jpg',
    exercises: [
    { name: 'Jogging', duration: '10 minutes' },
    { name: 'Jumping Jacks', duration: '1 minute' },
    { name: 'High Knees', duration: '1 minute' }
  ]
  },
  {
    title: 'Full Body',
    category: 'Strength',
    description: 'Strength · Conditioning',
    image: 'https://i.pinimg.com/1200x/73/dc/2d/73dc2d4cec21a83bff4cdb0bde269c62.jpg',
    exercises: [
    { name: 'Bodyweight Squats', duration: '3 sets of 12' },
    { name: 'Push-Ups', duration: '3 sets of 10' },
    { name: 'Mountain Climbers', duration: '1 minute' }
  ]
  },
  {
    title: 'Mobility & Flexibility',
    category: 'Flexibility',
    description: 'Stretching · Movement',
    image: 'https://i.pinimg.com/736x/47/ef/cc/47efcc650dc631bdc16e6ec37c9e8a5d.jpg',
     exercises: [
    { name: 'Downward Dog', duration: '30 seconds' },
    { name: 'Cat/Cow', duration: '1 minute' },
    { name: 'Seated Forward Fold', duration: '45 seconds' }
  ]
  }
];

const filteredBodyFocusWorkouts =
  selectedCategory === 'All'
    ? bodyFocusWorkouts
    : bodyFocusWorkouts.filter(
        (workout) => workout.category === selectedCategory
      );

function showMuscleCard(category) {
  return (
    selectedMuscleCategory === 'All' ||
    selectedMuscleCategory === category
  );
}

function handleMuscleCategory(category) {
  setSelectedMuscleCategory(category);
}
//workout details
const navigate = useNavigate();

const yogaWorkout = {
  title: 'Morning Yoga & Stretching',
  image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
  exercises: [
    { name: 'Downward Dog', duration: '20 seconds' },
    { name: 'Prayer Stretch', duration: '30 seconds' },
    { name: 'Cat/Cow', duration: '1 minute' }
  ]
};



  return ( 
    <div className="homepage-dashboard">

      <button
        className="homepage-menu-button homepage-fixed-menu"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      <aside
        className={`homepage-sidebar ${
          sidebarOpen ? 'open' : 'closed'
        }`} 
        >
        
        <div className="homepage-sidebar-header">
          {sidebarOpen && (
            <div className="homepage-logo">
              <span className="homepage-logo-kinetic">Kinetic</span>
              <span className="homepage-logo-krew">Krew</span>
            </div>
          )}
        </div>
          
        <nav className="homepage-sidebar-navi">
          <Link to="/homepage" className="homepage-navi-link">
            <House size={22} />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link to="/workouts" className="homepage-navi-link active">
            <Dumbbell size={22} />
            {sidebarOpen && <span>Workouts</span>}
          </Link>

          <a href="#progress" className="homepage-navi-link">
            <ChartNoAxesColumn size={22} />
            {sidebarOpen && <span>My Progress</span>}
          </a>

          <a href="#fitness" className="homepage-navi-link">
            <Heart size={22} />
            {sidebarOpen && <span>Fitness</span>}
          </a>

          <a href="#records" className="homepage-navi-link">
            <Trophy size={22} />
            {sidebarOpen && <span>Personal Records</span>}
          </a>

          <a href="#community" className="homepage-navi-link">
            <UsersRound size={22} />
            {sidebarOpen && <span>Community</span>}
          </a>
        </nav>
          
        <div className="homepage-sidebar-bottom">
          <a href="#settings" className="homepage-navi-link">
            <Settings size={22} />
            {sidebarOpen && <span>Settings</span>}
          </a>

          <a href="#support" className="homepage-navi-link">
            <CircleHelp size={22} />
            {sidebarOpen && <span>Support</span>}
          </a>
        </div>
      </aside>

<main className="homepage-main workout-main">

  <header className="homepage-topbar">
  <form className="homepage-search" onSubmit={handleSearch}>
    <input
      type="text"
      placeholder="Search workouts..."
      aria-label="Search workouts"
      value={searchQuery}
      onChange={(event) => setSearchQuery(event.target.value)}
    />

    <button
      type="submit"
      className="homepage-search-button"
      aria-label="Search"
    >
      <Search size={20} />
    </button>
  </form>

  <div className="homepage-topbar-right">
    <span className="homepage-notification" aria-label="Notifications">
      <Bell size={24} />
    </span>

    <div className="homepage-profile">
      <button
        type="button"
        className="homepage-profile-button"
        onClick={() => setProfileOpen(!profileOpen)}
        aria-expanded={profileOpen}
        aria-label="Open profile menu"
      >
       👤
      </button>


      {profileOpen && (
        <div className="homepage-profile-dropdown">
          <Link to="/homepage">My Profile</Link>
          <a href="#settings">Settings</a>
          <Link to="/signin">Log Out</Link>
        </div>
      )}
    </div>
  </div>
</header>

  <section className="workout-header">
    <h1>Workouts</h1>
    <p>
      Discover workouts, explore exercises, and build your fitness routine.
    </p>

 <div className="workout-categories">
{['All', 'Strength', 'Cardio', 'Flexibility'].map((category) => (
    <button
      key={category}
      className={`category-button ${
        selectedCategory === category ? 'active' : ''
      }`}
      onClick={() => setSelectedCategory(category)}
    >
      {category}
    </button>
  ))}
</div>


<section
  className="featured-workout"
  onClick={() =>
    navigate('/workout/morning-yoga', {
      state: yogaWorkout
    })
  }
>
  <img
    src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"
    alt="Yoga Stretches"
  />

  <div className="featured-workout-info">
    <h2>Morning Yoga & Stretching</h2>
    <p>20 minutes · Beginner · No equipment necessary </p>
  </div>

</section>

<div className="body-focus-heading">
  <h2>Explore by Body Focus</h2>
  <a href="#muscle-groups">View All →</a>
</div>

<section className="body-focus-grid">
  {filteredBodyFocusWorkouts.map((workout) => (
    <article
  className="body-focus-card"
  key={workout.title}
  onClick={() =>
    navigate(
      `/workout/${workout.title.toLowerCase().replaceAll(' ', '-')}`,
      { state: workout }
    )
  }
>
      <img
        src={workout.image}
        alt={`${workout.title} workout`}
      />

      <div className="body-focus-card-info">
        <h3>{workout.title}</h3>
        <p>{workout.description}</p>
      </div>
    </article>
  ))}
</section>

<section
  id="muscle-groups"
  className="muscle-groups-section"
>
  <div className="body-focus-heading">
    <h2>Explore By Muscle Group</h2>
  </div>
<div className="muscle-group-categories">
  {['All', 'Arms', 'Chest', 'Back', 'Shoulders', 'Legs', 'Core'].map(
    (category) => (
      <button
        type="button"
        key={category}
        className={`category-button ${
          selectedMuscleCategory === category ? 'active' : ''
        }`}
        onClick={() => handleMuscleCategory(category)}
      >
        {category}
      </button>
    )
  )}
</div>

<div className="body-focus-grid">

  {showMuscleCard('Arms') && (
    <article className="body-focus-card">
      <img
        src="https://hips.hearstapps.com/hmg-prod/images/250820-wh-arms-2206-694962e37187f.jpg?crop=0.668xw:1.00xh;0.264xw,0&resize=640:*"
        alt="Biceps workout"
      />
      <div className="body-focus-card-info">
        <h3>Biceps</h3>
        <p>Arms · Pulling strength</p>
      </div>
    </article> )}

 {showMuscleCard('Arms') && (
    <article className="body-focus-card">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU7OdKYw1FF9SqOvCyMYPnS1THGpUFPdhrQ0pzkVUkBg&s=10"
        alt="Triceps workout"
      />
      <div className="body-focus-card-info">
        <h3>Triceps</h3>
        <p>Arms · Pushing strength</p>
      </div>
    </article> )}

 {showMuscleCard('Shoulders') && (
    <article className="body-focus-card">
      <img
        src="https://cdn.prod.website-files.com/63ac2adedd12792c47e49a8d/68a9e59f606d5eef2fc4806e_kuva2.jpg"
        alt="Lateral deltoid workout"
      />
      <div className="body-focus-card-info">
        <h3>Lateral Deltoids </h3>
        <p>Shoulders · Upper body</p>
      </div>
    </article>)}

 {showMuscleCard('Chest') && (
    <article className="body-focus-card">
      <img
        src="https://www.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F8urtyqugdt2l%2F3ZPYP6IZmYWn5QPs2nhy4z%2F2c46b60f4c6e9a0de38a8f0b56b34f4c%2Fmobile-best-chest-exercises.jpg&w=3840&q=85"
        alt="Chest workout"
      />
      <div className="body-focus-card-info">
        <h3>Chest</h3>
        <p>Chest · Pushing strength</p>
      </div>
    </article> )}

 {showMuscleCard('Back') && (
    <article className="body-focus-card">
      <img
        src="https://cdn.shopify.com/s/files/1/0804/3944/3761/files/lat-pulldown-side-1529x1028.jpg?v=1793867620"
        alt="Back workout"
      />
      <div className="body-focus-card-info">
        <h3>Lats</h3>
        <p>Back · Pulling strength</p>
      </div>
    </article> )}


 {showMuscleCard('Legs') && (
    <article className="body-focus-card">
      <img
        src="https://images.ctfassets.net/8urtyqugdt2l/4104mipNd2Y8rUcr9cjoVI/9a79dd76ae4419ce302134e648c5d49b/desktop-hamstring-exercises.jpg"
        alt="Hamstring workout"
      />
      <div className="body-focus-card-info">
        <h3>Hamstrings</h3>
        <p>Legs · Lower body</p>
      </div>
    </article>)}

 {showMuscleCard('Legs') && (
     <article className="body-focus-card">
      <img
        src="https://10fitness.com/wp-content/uploads/2026/05/original-7.webp"
        alt="Glute workout"
      />
      <div className="body-focus-card-info">
        <h3>Glutes</h3>
        <p>Hips · Lower body</p>
      </div>
    </article>)}

 {showMuscleCard('Legs') && (
    <article className="body-focus-card">
        <img
            src="https://i.pinimg.com/1200x/e6/41/52/e64152d5596bac238377ea35fee93ec8.jpg"
            alt="Quadriceps workout"
        />
        <div className="body-focus-card-info">
            <h3>Quadriceps</h3>
            <p>Thighs · Pushing strength</p>
        </div>
        </article>)}

 {showMuscleCard('Legs') && (
    <article className="body-focus-card">
         <img
            src="https://www.ironmanmagazine.com/wp-content/uploads/MCP_5245-1000x600.jpg"
            alt="Calves workout"
        />
        <div className="body-focus-card-info">
            <h3>Calves</h3>
            <p>Lower legs · Stability</p>
        </div>
        </article>)}

 {showMuscleCard('Shoulders') && (
    <article className="body-focus-card">
         <img
            src="https://hips.hearstapps.com/hmg-prod/images/muscular-sportsman-doing-chin-ups-royalty-free-image-1748635184.pjpeg?crop=0.88897xw:1xh;center,top&resize=1200:*"
            alt="Traps workout"
        />
        <div className="body-focus-card-info">
            <h3>Traps</h3>
            <p>Upper back · Shoulders</p>
        </div>
        </article>)}
        
 {showMuscleCard('Arms') && (
  <article className="body-focus-card">
         <img
            src="https://de.gymreapers.com/cdn/shop/articles/Best_forearm_exercises_workouts_with_bands.jpg?v=1684592480&width=2048"
            alt="Forearms workout"
        />
        <div className="body-focus-card-info">
            <h3>Forearms</h3>
            <p>Arms · Grip strength</p>
        </div>
        </article>)}

 {showMuscleCard('Back') && (
  <article className="body-focus-card">
         <img
            src="https://cdn.shopify.com/s/files/1/0700/6765/0637/files/blog-BLOG_lowerback_email_300.jpg"
            alt="Lower Back workout"
        />
        <div className="body-focus-card-info">
            <h3>Lower Back</h3>
            <p>Back · Stability</p>
        </div>
        </article>)}

 {showMuscleCard('Legs') && (
    <article className="body-focus-card">
         <img
            src="https://row.gymshark.com/_next/image?url=https%3A%2F%2Fimages.ctfassets.net%2F8urtyqugdt2l%2F5Ri3x0nUzRsdcIJNY8Wrxw%2Fe2e0f4b1e91cbc26317d49da009e8438%2Fdesktop-hip-flexor-exercises.jpg&w=3840&q=85"
            alt="Hip Flexors workout"
        />
        <div className="body-focus-card-info">
            <h3>Hip Flexors</h3>
            <p>Hips · Mobility</p>
        </div>
        </article>)}

 {showMuscleCard('Legs') && (
        <article className="body-focus-card">
         <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiUc0oM8XisGlXFAzZwwp9BHSKR58cJjKcqw2cK-aEcw&s=10"
            alt="Abductors workout"
        />
        <div className="body-focus-card-info">
            <h3>Abductors</h3>
            <p>Outer thighs · Hip strength</p>
        </div>
        </article>)}

 {showMuscleCard('Legs') && (
        <article className="body-focus-card">
         <img
            src="https://i.pinimg.com/736x/dc/c0/9d/dcc09da240f2dce32e6273fa514ac3ef.jpg"
            alt="Inner thighs workout"
        />
        <div className="body-focus-card-info">
            <h3>Inner Thighs</h3>
            <p>Inner thighs · Leg strength</p>
        </div>
        </article>)}

 {showMuscleCard('Core') && (
        <article className="body-focus-card">
         <img
            src="https://images.ctfassets.net/0k812o62ndtw/D8igw1fYgZeTS83V8fMgR/c5dfd58e8d523b72e6460fa03dfdec46/2024.08.27_SWEAT_POWERADE26727-2049x1366-95c78bf.jpg?w=1024&q=85"
            alt="Obliques workout"
        />
        <div className="body-focus-card-info">
            <h3>Obliques</h3>
            <p>Core · Rotation strength</p>
        </div>
        </article>)}
 {showMuscleCard('Core') && (
  <article className="body-focus-card">
    <img
      src="https://www.nourishmovelove.com/wp-content/uploads/2020/04/Best-Lower-Ab-Workout.jpg"
      alt="Lower ab workout"
    />

    <div className="body-focus-card-info">
      <h3>Lower Abs</h3>
      <p>Core · Stability</p>
    </div>
  </article>
)}
    




</div>

</section>

</section>

</main>
</div>

  );
}

export default WorkoutPage;