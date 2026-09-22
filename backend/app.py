import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load trained ML model using absolute path relative to this script
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Error loading model from {MODEL_PATH}: {e}")
    model = None

FEATURE_NAMES = [
    "Age",
    "Gender",
    "WorkingHours",
    "SleepHours",
    "StressLevel",
    "WorkPressure",
    "MeetingsPerDay",
    "ExperienceYears",
    "Remote"
]

@app.route("/")
def home():
    return jsonify({
        "status": "online",
        "message": "🔥 AI Burnout Prediction API is running successfully!",
        "model_loaded": model is not None
    })

@app.route("/predict", methods=["POST"])
def predict():
    if model is None:
        return jsonify({"error": "ML Model is not loaded properly on backend."}), 500

    try:
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "Invalid request. Expected JSON body."}), 400

        # Verify all required keys are present
        missing_fields = [field for field in FEATURE_NAMES if field not in data]
        if missing_fields:
            return jsonify({"error": f"Missing required fields: {', '.join(missing_fields)}"}), 400

        # Construct DataFrame with safe type conversions
        try:
            sample_dict = {
                "Age": [int(data["Age"])],
                "Gender": [int(data["Gender"])],              # 0 = Female, 1 = Male
                "WorkingHours": [float(data["WorkingHours"])],
                "SleepHours": [float(data["SleepHours"])],
                "StressLevel": [int(data["StressLevel"])],
                "WorkPressure": [int(data["WorkPressure"])],
                "MeetingsPerDay": [int(data["MeetingsPerDay"])],
                "ExperienceYears": [float(data["ExperienceYears"])],
                "Remote": [int(data["Remote"])]               # 0 = No, 1 = Yes
            }
            features_df = pd.DataFrame(sample_dict, columns=FEATURE_NAMES)
        except ValueError as ve:
            return jsonify({"error": f"Invalid numerical value in input fields: {str(ve)}"}), 400

        # Make prediction
        prediction_val = model.predict(features_df)[0]
        prediction = int(prediction_val)

        # Risk mapping
        risk_map = {
            0: "Low",
            1: "Medium",
            2: "High"
        }

        risk = risk_map.get(prediction, "Unknown")

        # Get probability score if available
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(features_df)[0]
            score = int(round(max(probabilities) * 100))
        else:
            # Fallback scoring logic
            score = int((prediction + 1) * 30)

        return jsonify({
            "risk": risk,
            "score": score,
            "prediction": prediction
        })

    except Exception as e:
        return jsonify({
            "error": f"Prediction server error: {str(e)}"
        }), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)

