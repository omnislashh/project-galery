import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Project } from '../types';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";

type ContextValue = {
  projects: Project[];
  addProject: (p: Omit<Project, 'id' | 'votes' | 'createdAt'>) => Promise<void>;
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
      setProjects(data.sort((a, b) => b.votes - a.votes));
    }, (err) => {
      console.error("Erreur onSnapshot:", err);
    });

    return unsubscribe;
  }, []);

  // Add project
  const addProject = async (p: Omit<Project, 'id'|'votes'|'createdAt'>) => {
    try {
      const projectData: any = {
        ...p,
        votes: 0,
        createdAt: serverTimestamp(),
      };

      // Supprime les champs undefined pour éviter invalid-argument
      Object.keys(projectData).forEach(key => {
        if (projectData[key] === undefined) delete projectData[key];
      });

      await addDoc(collection(db, "projects"), projectData);
    } catch (err) {
      console.error("Erreur Firebase addProject:", err);
      throw err;
    }
  };

  // Vote for a project (limité à une fois par utilisateur avec localStorage)
  const vote = async (id: string, votes: number) => {
    try {
      const votedProjects: string[] = JSON.parse(localStorage.getItem("votedProjects") || "[]");

      if (votedProjects.includes(id)) {
        alert("You already voted for this project!");
        return;
      }

      const ref = doc(db, "projects", id);
      await updateDoc(ref, { votes: votes + 1 });

      // Enregistre le vote dans localStorage
      votedProjects.push(id);
      localStorage.setItem("votedProjects", JSON.stringify(votedProjects));
    } catch (err) {
      console.error("Erreur vote:", err);
    }
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
