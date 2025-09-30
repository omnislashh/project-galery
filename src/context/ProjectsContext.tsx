// src/context/ProjectsContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Project } from '../types';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";

type ContextValue = {
  projects: Project[];
  addProject: (p: Omit<Project, 'id'|'votes'|'createdAt'>) => Promise<void>;
  vote: (id: string, votes: number) => Promise<void>;
};

const ProjectsContext = createContext<ContextValue | undefined>(undefined);

export const ProjectsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  // Listen to Firestore in real-time
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "projects"), (snapshot) => {
      const data: Project[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Project, "id">)
      }));
      setProjects(data.sort((a, b) => b.votes - a.votes)); // sort by votes
    });
    return unsubscribe;
  }, []);

  // Add project to Firestore
  const addProject = async (p: Omit<Project, 'id'|'votes'|'createdAt'>) => {
    await addDoc(collection(db, "projects"), {
      ...p,
      votes: 0,
      createdAt: serverTimestamp()
    });
  };

  // Vote for a project
  const vote = async (id: string, votes: number) => {
    const ref = doc(db, "projects", id);
    await updateDoc(ref, { votes: votes + 1 });
  };

  return (
    <ProjectsContext.Provider value={{ projects, addProject, vote }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectsProvider');
  return ctx;
};
