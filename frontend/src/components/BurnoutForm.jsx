import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BurnoutForm.css";

function BurnoutForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Age: "",
    Gender: "",
    WorkingHours: "",
    SleepHours: "",
    StressLevel: "",
    WorkPressure: "",
    MeetingsPerDay: "",
    ExperienceYears: "",
    Remote: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
const response = await fetch("https://workload-burnout.onrender.com/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (data.error) {
        alert("Error: " + data.error);
        return;
      }

      navigate("/result", {
        state: {
          level: data.risk,
          score: data.score,
          formData,
        },
      });

    } catch (error) {
      setLoading(false);
      alert("Server not reachable. Make sure Flask is running.");
    }
  };

  return (
    <div className="form-container">
      <div className="page-title">
        <h1 className="main-title">AI Burnout Assessment</h1>
        <p className="title-subtitle">
          Powered by Machine Learning • Enterprise-grade analysis
        </p>
      </div>

      <div className="glass-card">
        <h2 className="neon-text">ML-Powered Risk Analysis</h2>

        <form onSubmit={handleSubmit} className="burnout-form">

          {/* Age + Gender */}
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">Age</label>
              <input
                type="number"
                name="Age"
                min="16"
                max="80"
                value={formData.Age}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Gender</label>
              <select
  name="Gender"
  value={formData.Gender}
  onChange={handleChange}
  className="form-input form-select"
  required
>

                <option value="">Select</option>
                <option value="1">Male</option>
                <option value="0">Female</option>
              </select>
            </div>
          </div>

          {/* Working + Sleep */}
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">Working Hours / Week</label>
              <input
                type="number"
                name="WorkingHours"
                min="0"
                max="100"
                value={formData.WorkingHours}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Sleep Hours / Night</label>
              <input
                type="number"
                name="SleepHours"
                min="0"
                max="16"
                value={formData.SleepHours}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Stress + Pressure */}
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">Stress Level (1-10)</label>
              <input
                type="number"
                name="StressLevel"
                min="1"
                max="10"
                value={formData.StressLevel}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Work Pressure (1-10)</label>
              <input
                type="number"
                name="WorkPressure"
                min="1"
                max="10"
                value={formData.WorkPressure}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Meetings + Experience */}
          <div className="input-row">
            <div className="input-group">
              <label className="input-label">Meetings / Day</label>
              <input
                type="number"
                name="MeetingsPerDay"
                min="0"
                max="20"
                value={formData.MeetingsPerDay}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Experience (Years)</label>
              <input
                type="number"
                name="ExperienceYears"
                min="0"
                max="40"
                value={formData.ExperienceYears}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          {/* Remote */}
          <div className="input-row">
            <div className="input-group full-width">
              <label className="input-label">Remote Work?</label>
<select
  name="Remote"
  value={formData.Remote}
  onChange={handleChange}
  className="form-input form-select"
  required
>

                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>

          <button type="submit" className="neon-button">
            🚀 Run ML Prediction
          </button>
        </form>

        {loading && (
          <div className="loading">
            <div className="loader-ring"></div>
            <p>🧠 Processing with ML Model...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BurnoutForm;
