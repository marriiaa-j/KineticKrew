import { useMemo, useState } from "react";
import { BarChart3, Camera, CalendarDays, ChevronDown, Ruler, Save, Scale, Trash2 } from "lucide-react";
import "./Measurements.css";

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  weight: "",
  heightFeet: "",
  heightInches: "",
  waist: "",
  arms: "",
  chest: "",
  thighs: "",
  calves: "",
  hips: "",
  photo: "",
};

function bmiCategory(bmi) {
  if (!bmi) return "Enter weight and height";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Healthy range";
  if (bmi < 30) return "Overweight";
  return "Obesity range";
}

function Measurements() {
  const [form, setForm] = useState(emptyForm);
  const [entries, setEntries] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("measurements")) || [];
    } catch {
      return [];
    }
  });
  const [metric, setMetric] = useState("weight");

  const heightInches = Number(form.heightFeet || 0) * 12 + Number(form.heightInches || 0);
  const bmi = form.weight && heightInches
    ? Number(((Number(form.weight) / heightInches ** 2) * 703).toFixed(1))
    : null;

  const chartEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date)).slice(-6);
  const chartValues = chartEntries.map((entry) => Number(entry[metric]) || 0).filter(Boolean);
  const max = Math.max(...chartValues, 1);
  const min = Math.min(...chartValues, 0);
  const range = max - min || 1;
  const points = chartEntries.map((entry, index) => {
    const value = Number(entry[metric]) || 0;
    const x = chartEntries.length === 1 ? 50 : (index / (chartEntries.length - 1)) * 100;
    const y = 92 - ((value - min) / range) * 70;
    return `${x},${y}`;
  }).join(" ");

  const latest = entries[0];
  const change = latest && entries.length > 1
    ? Number(latest[metric] || 0) - Number(entries[entries.length - 1][metric] || 0)
    : 0;

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function uploadPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, photo: reader.result });
    reader.readAsDataURL(file);
  }

  function saveMeasurement(event) {
    event.preventDefault();
    if (!form.date || !form.weight || !heightInches) {
      alert("Date, weight, and height are required.");
      return;
    }

    const entry = {
      ...form,
      id: Date.now(),
      bmi,
      heightInches,
    };
    const updated = [entry, ...entries];
    setEntries(updated);
    localStorage.setItem("measurements", JSON.stringify(updated));
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
  }

  function deleteMeasurement(id) {
    const updated = entries.filter((entry) => entry.id !== id);
    setEntries(updated);
    localStorage.setItem("measurements", JSON.stringify(updated));
  }

  return (
    <main className="measurements-page">
      <header className="measurements-header">
        <div>
          <div className="brand-line">Kinetic<span>Krew</span></div>
          <p>Gym Progress Dashboard</p>
        </div>
        <nav>
          <a href="/homepage">Dashboard</a>
          <a className="current-link" href="/my-progress">Progress</a>
          <a href="/homepage">Workout Plan</a>
          <a href="/homepage">Profile</a>
        </nav>
      </header>

      <section className="measurements-tabs">
        <a href="/my-progress">Log Activity</a>
        <a className="active" href="/measurements">Measurements</a>
        <a href="/measurements">Progress Stats</a>
        <a href="/my-progress">History</a>
      </section>

      <div className="measurements-grid">
        <section className="measurement-form-card">
          <div className="card-heading">
            <div>
              <h1><Ruler size={24} /> Add Measurement</h1>
              <p>Every entry is saved with its date.</p>
            </div>
            <CalendarDays size={22} />
          </div>

          <form onSubmit={saveMeasurement}>
            <label>Date <span className="required">* Required</span></label>
            <input name="date" type="date" value={form.date} onChange={updateField} required />

            <div className="required-row">
              <div>
                <label>Weight (lbs) <span className="required">* Required</span></label>
                <input name="weight" type="number" min="1" step="0.1" value={form.weight} onChange={updateField} required />
              </div>
              <div>
                <label>Height <span className="required">* Required</span></label>
                <div className="height-inputs">
                  <input name="heightFeet" type="number" min="1" max="8" placeholder="ft" value={form.heightFeet} onChange={updateField} required />
                  <input name="heightInches" type="number" min="0" max="11" placeholder="in" value={form.heightInches} onChange={updateField} required />
                </div>
              </div>
            </div>

            <div className="bmi-card">
              <Scale size={28} />
              <div>
                <span>BMI (Auto-Calculated)</span>
                <strong>{bmi || "--"}</strong>
                <small>{bmiCategory(bmi)}</small>
              </div>
              <p>Uses your weight and height. Your saved age and sex can be used for profile context.</p>
            </div>

            <h2>Body Measurements <span>(Optional)</span></h2>
            <div className="body-measurements">
              {[["waist", "Waist"], ["arms", "Arms"], ["chest", "Chest"], ["thighs", "Thighs"], ["calves", "Calves"], ["hips", "Hips"]].map(([name, label]) => (
                <div key={name}>
                  <label>{label} (in)</label>
                  <input name={name} type="number" min="0" step="0.1" value={form[name]} onChange={updateField} />
                </div>
              ))}
            </div>

            <h2>Progress Picture <span>(Optional)</span></h2>
            <label className="upload-area">
              <Camera size={28} />
              <span>{form.photo ? "Picture selected" : "Upload a dated progress picture"}</span>
              <small>JPG, PNG, or WEBP</small>
              <input type="file" accept="image/*" onChange={uploadPhoto} />
            </label>

            <button className="save-button" type="submit"><Save size={18} /> Save Measurement</button>
          </form>
        </section>

        <section className="overview-column">
          <div className="overview-card">
            <div className="card-heading">
              <div>
                <h1><BarChart3 size={24} /> Progress Overview</h1>
                <p>Track changes across dated entries.</p>
              </div>
              <div className="metric-select">
                <select value={metric} onChange={(event) => setMetric(event.target.value)}>
                  <option value="weight">Weight (lbs)</option>
                  <option value="bmi">BMI</option>
                  <option value="waist">Waist (in)</option>
                  <option value="arms">Arms (in)</option>
                  <option value="thighs">Thighs (in)</option>
                </select>
                <ChevronDown size={15} />
              </div>
            </div>

            <div className="chart-card">
              <h2>{metric === "weight" ? "Weight Trend" : `${metric[0].toUpperCase()}${metric.slice(1)} Trend`}</h2>
              {chartEntries.length > 0 ? (
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="trend-chart">
                  <line x1="0" y1="92" x2="100" y2="92" />
                  <line x1="0" y1="57" x2="100" y2="57" />
                  <line x1="0" y1="22" x2="100" y2="22" />
                  <polyline points={points} />
                  {points.split(" ").map((point) => {
                    const [x, y] = point.split(",");
                    return <circle key={`${x}-${y}`} cx={x} cy={y} r="1.7" />;
                  })}
                </svg>
              ) : (
                <div className="empty-chart">Save measurements to generate a trend graph.</div>
              )}
              <div className="chart-labels">{chartEntries.map((entry) => <span key={entry.id}>{entry.date}</span>)}</div>
            </div>

            <div className="change-summary">
              <span>Since first entry</span>
              <strong>{change ? `${change > 0 ? "+" : ""}${change.toFixed(1)}` : "--"}</strong>
              <small>{metric === "weight" ? "lbs" : "inches / BMI"}</small>
            </div>
          </div>

          <div className="history-card">
            <div className="card-heading">
              <h1>Measurement History</h1>
              <span>All entries are dated</span>
            </div>
            {entries.length === 0 ? (
              <p className="empty-history">Your saved measurements will appear here.</p>
            ) : (
              <div className="history-list">
                {entries.slice(0, 6).map((entry) => (
                  <div className="history-row" key={entry.id}>
                    <strong>{entry.date}</strong>
                    <span>{entry.weight} lbs</span>
                    <span>{entry.heightFeet}&apos;{entry.heightInches}&quot;</span>
                    <span>BMI {entry.bmi}</span>
                    <button type="button" onClick={() => deleteMeasurement(entry.id)} aria-label="Delete measurement">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Measurements;
