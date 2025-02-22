import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import Navbar from "./components/Navbar/Navbar";

// Lazy load Dashboard to improve performance
const Dashboard = lazy(() => import("./pages/Dashboard"));

const App = () => (
  <BrowserRouter basename="/">
    <Navbar />
    <main className="container">
      {/* Suspense for lazy-loaded components */}
      <Suspense fallback={<p>Loading...</p>}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </main>
  </BrowserRouter>
);

export default App;
