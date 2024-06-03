import DrinksManager from "./pages/DrinksManager.jsx";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Navbar from "./components/Navbar.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/drinks-manager" element={<DrinksManager />} />
      </Routes>
    </Router>
  );
}

export default App;