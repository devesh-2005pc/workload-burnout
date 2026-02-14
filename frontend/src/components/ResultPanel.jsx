import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./ResultPanel.css";

function ResultPanel() {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state;

  if (!result) {
    return (
      <div className="result-page">
        <motion.div 
          className="no-data-card"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="no-data-icon">📊</div>
          <h2>No Analysis Data Found</h2>
          <p>Run a new burnout assessment to see your personalized results</p>
          <motion.button 
            className="neon-button primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/analysis")}
          >
            🔄 Start New Analysis
          </motion.button>
        </motion.div>
      </div>
    );
  }

  const { score, level, formData } = result;

  const getRiskConfig = () => {
    switch (level.toLowerCase()) {
      case "high":
        return {
          icon: "🔥",
          gradient: "linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)",
          glow: "0 0 40px rgba(255, 65, 108, 0.8)",
          tips: [
            "🚨 Reduce workload by 25-35% immediately",
            "😴 Prioritize 7-8 hours quality sleep",
            "💻 Implement 2-hour daily digital detox",
            "🧘‍♂️ Start daily 10-min meditation practice",
            "📞 Schedule manager workload discussion"
          ]
        };
      case "moderate":
        return {
          icon: "⚡",
          gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          glow: "0 0 30px rgba(102, 126, 234, 0.7)",
          tips: [
            "⏸️ Schedule structured hourly breaks",
            "🌙 Establish consistent sleep routine",
            "📱 Limit recreational screen time",
            "🏃‍♀️ Add 30min daily physical activity",
            "📊 Weekly stress level self-check"
          ]
        };
      default:
        return {
          icon: "✅",
          gradient: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)",
          glow: "0 0 35px rgba(0, 176, 155, 0.8)",
          tips: [
            "😴 Maintain 7-8 hour sleep cycle",
            "⚖️ Continue balanced workload",
            "🧠 Regular mental health check-ins",
            "🎯 Set weekly wellness goals",
            "🌿 Incorporate nature/outdoor time"
          ]
        };
    }
  };

  const riskConfig = getRiskConfig();

  return (
    <div className="result-page">
      {/* Background particles */}
      <div className="particles-bg"></div>
      
      <motion.div 
        className="result-card"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Header */}
        <div className="result-header">
          <div className="risk-badge">
            <span className="risk-icon">{riskConfig.icon}</span>
            <span className="risk-level">{level.toUpperCase()}</span>
          </div>
          <h1 className="result-title">
            Burnout Risk Assessment
          </h1>
          <div 
            className="score-circle"
            style={{ 
              background: riskConfig.gradient,
              boxShadow: riskConfig.glow 
            }}
          >
            <span className="score-number">{score}%</span>
          </div>
        </div>

        {/* Data Summary */}
<motion.div 
  className="data-grid"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.3, duration: 0.6 }}
>
  <div className="data-item">
    <span className="data-label">Work Hours</span>
    <span className="data-value">
      {formData.WorkingHours} hrs/week
    </span>
  </div>

  <div className="data-item">
    <span className="data-label">Sleep</span>
    <span className="data-value">
      {formData.SleepHours} hrs/night
    </span>
  </div>

  <div className="data-item">
    <span className="data-label">Stress Level</span>
    <span className="data-value">
      {formData.StressLevel}/10
    </span>
  </div>

  <div className="data-item">
    <span className="data-label">Work Pressure</span>
    <span className="data-value">
      {formData.WorkPressure}/10
    </span>
  </div>

  <div className="data-item">
    <span className="data-label">Meetings/Day</span>
    <span className="data-value">
      {formData.MeetingsPerDay}
    </span>
  </div>

  <div className="data-item">
    <span className="data-label">Experience</span>
    <span className="data-value">
      {formData.ExperienceYears} yrs
    </span>
  </div>
</motion.div>


        {/* Smart Recommendations */}
        <motion.div 
          className="recommendations"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h3 className="section-title">Personalized Action Plan</h3>
          <div className="tips-grid">
            {riskConfig.tips.map((tip, index) => (
              <motion.div 
                key={index}
                className="tip-card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              >
                <span className="tip-icon">→</span>
                <span>{tip}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          className="action-buttons"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <motion.button 
            className="neon-button primary"
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/analysis")}
          >
            🔄 New Assessment
          </motion.button>
          
            
        </motion.div>
      </motion.div>
    </div>
  );
}

export default ResultPanel;
