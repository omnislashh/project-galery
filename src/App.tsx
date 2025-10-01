import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProjectsProvider } from './context/ProjectsContext';
import Home from './pages/Home';
import Admin from './pages/Admin';
import ProjectPage from './pages/ProjectPage';

function App() {
  return (
    <ProjectsProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/project/:id" element={<ProjectPage />} />
        </Routes>
      </Router>
    </ProjectsProvider>
  );
}

export default App;
// import TestAddProject from "./components/TestAddProject";

// function App() {
//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-4">🚀 Firebase Test</h1>
//       <TestAddProject />
//     </div>
//   );
// }

// export default App;
