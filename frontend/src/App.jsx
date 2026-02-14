import { Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import BurnoutForm from "./components/BurnoutForm";
import ResultPanel from "./components/ResultPanel";

function App() {
  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Hero />} />

      {/* Analysis Page */}
      <Route
        path="/analysis"
        element={
          <div className="analysis-page">
            <BurnoutForm />
          </div>
        }
      />

      {/* Result Page */}
      <Route path="/result" element={<ResultPanel />} />
    </Routes>
  );
}

export default App;
