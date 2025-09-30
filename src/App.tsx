// src/App.tsx
import { useEffect, useState } from "react";
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  votes: number;
  createdAt: any;
};

function App() {
  const [projects, setProjects] = useState<Project[]>([]);

  // Load projects from Firestore
  useEffect(() => {
    const fetchProjects = async () => {
      const snapshot = await getDocs(collection(db, "projects"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Project, "id">)
      }));
      setProjects(data);
    };
    fetchProjects();
  }, []);

  // Add a new project to Firestore
  const addTestProject = async () => {
    await addDoc(collection(db, "projects"), {
      title: "New Project",
      description: "Created from React app",
      tags: ["demo"],
      votes: 0,
      createdAt: serverTimestamp()
    });
    alert("New project added! Refresh the page to see it.");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>🚀 Firebase Test</h1>
      <button onClick={addTestProject} style={{ marginBottom: 20 }}>
        Add Test Project
      </button>
      <ul>
        {projects.map(p => (
          <li key={p.id}>
            <strong>{p.title}</strong> — {p.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
