import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BurnoutForm.css";

const BASE_API_URL = import.meta.env.VITE_API_URL || "https://workload-burnout.onrender.com";
const PREDICT_URL = `${BASE_API_URL.replace(/\/+$/, "")}/predict`;

function BurnoutForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Age: "28",
    Gender: "1",
    WorkingHours: "45",
    SleepHours: "6",
    StressLevel: "7",
    WorkPressure: "8",
    MeetingsPerDay: "5",
    ExperienceYears: "4",
    Remote: "1",
  });

  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("predicting");
  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;

    setErrorMessage(null);
    setLoading(true);
    setLoadingStatus("predicting");

    // Cold start notification timer (Render free tier wake-up)
    const wakeTimer = setTimeout(() => {
      setLoadingStatus("waking");
    }, 6000);

    // 40 second timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 40000);

    try {
      const response = await fetch(PREDICT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      clearTimeout(wakeTimer);

      if (!response.ok) {
        let serverErr = `Server returned status ${response.status}`;
        try {
          const errData = await response.json();
          if (errData && errData.error) serverErr = errData.error;
        } catch (_) {
          // Response was not JSON
        }
        throw new Error(serverErr);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      navigate("/result", {
        state: {
          level: data.risk,
          score: data.score,
          formData,
        },
      });

    } catch (error) {
      clearTimeout(timeoutId);
      clearTimeout(wakeTimer);

      if (error.name === "AbortError") {
        setErrorMessage("Prediction request timed out. The prediction backend service may be waking up from sleep mode. Please try again.");
      } else {
        setErrorMessage(
          error.message || "Prediction service is temporarily unavailable. Please check backend connection and try again."
        );
      }
    } finally {
      setLoading(false);
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
                required
              >
                <option value="">Select</option>
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
          </div>

          <button type="submit" className="neon-button" disabled={loading}>
            {loading ? "⏳ Predicting..." : "🚀 Run ML Prediction"}
          </button>
        </form>

        {loading && (
          <div className="loading">
            <div className="loader-ring"></div>
            <p>
              {loadingStatus === "waking"
                ? "⚡ Starting prediction service (Render cold start)... please wait."
                : "🧠 Processing with ML Model..."}
            </p>
          </div>
        )}

        {errorMessage && (
          <div className="error-banner">
            <p className="error-text">⚠️ {errorMessage}</p>
            <button className="retry-btn" onClick={handleSubmit}>
              🔄 Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BurnoutForm;

