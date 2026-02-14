from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load trained ML model
model = joblib.load("model.pkl")

@app.route("/")
def home():
    return "🔥 AI Burnout Prediction API is running successfully!"

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # Convert incoming data safely
        features = np.array([[
            int(data["Age"]),
            int(data["Gender"]),              # 0 = Female, 1 = Male
            float(data["WorkingHours"]),
            float(data["SleepHours"]),
            int(data["StressLevel"]),
            int(data["WorkPressure"]),
            int(data["MeetingsPerDay"]),
            float(data["ExperienceYears"]),
            int(data["Remote"])               # 0 = No, 1 = Yes
        ]])

        # Make prediction
        prediction = model.predict(features)[0]

        # Risk mapping
        risk_map = {
            0: "Low",
            1: "Medium",
            2: "High"
        }

        risk = risk_map.get(prediction, "Unknown")

        # 🔥 Try getting probability score
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(features)[0]
            score = round(max(probabilities) * 100)
        else:
            # Fallback scoring logic (if model has no predict_proba)
            score = int((prediction + 1) * 30)  # basic scaling

        return jsonify({
            "risk": risk,
            "score": score
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 400


if __name__ == "__main__":
    app.run()
