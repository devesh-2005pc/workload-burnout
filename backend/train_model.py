import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

np.random.seed(42)

# Number of samples
n = 2000

# Generate features
age = np.random.randint(21, 60, n)
gender = np.random.randint(0, 2, n)
working_hours = np.random.randint(4, 14, n)
sleep_hours = np.random.randint(3, 9, n)
stress_level = np.random.randint(1, 11, n)
work_pressure = np.random.randint(1, 11, n)
meetings = np.random.randint(0, 8, n)
experience = np.random.randint(0, 35, n)
remote = np.random.randint(0, 2, n)

# Burnout score logic
burnout_score = (
    working_hours * 0.4 +
    stress_level * 0.8 +
    work_pressure * 0.7 -
    sleep_hours * 0.6 +
    meetings * 0.3
)

# Create burnout category
burnout_risk = []

for score in burnout_score:
    if score < 10:
        burnout_risk.append(0)  # Low
    elif score < 18:
        burnout_risk.append(1)  # Medium
    else:
        burnout_risk.append(2)  # High

# Create DataFrame
data = pd.DataFrame({
    "Age": age,
    "Gender": gender,
    "WorkingHours": working_hours,
    "SleepHours": sleep_hours,
    "StressLevel": stress_level,
    "WorkPressure": work_pressure,
    "MeetingsPerDay": meetings,
    "ExperienceYears": experience,
    "Remote": remote,
    "BurnoutRisk": burnout_risk
})

# Split data
X = data.drop("BurnoutRisk", axis=1)
y = data["BurnoutRisk"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Test accuracy
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)

print("Model Accuracy:", accuracy)

# Save model
joblib.dump(model, "model.pkl")
print("Model saved as model.pkl")
