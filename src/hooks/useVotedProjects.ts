import { useEffect, useState } from "react";

const STORAGE_KEY = "project-gallery:votedProjects";

export function useVotedProjects() {
  const [votedProjects, setVotedProjects] = useState<string[]>([]);

  // Charger depuis localStorage une seule fois au montage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        console.log("📥 votedProjects loaded:", parsed);
        setVotedProjects(parsed);
      } else {
        setVotedProjects([]);
      }
    } catch (err) {
      console.error("Error reading votedProjects from localStorage:", err);
      setVotedProjects([]);
    }
  }, []);

  // addVote écrit D'ABORD dans localStorage (synchronique), puis met à jour le state
  const addVote = (id: string) => {
    try {
      const normalizedId = String(id);
      // relire pour éviter overwrite de concurrents
      const raw = localStorage.getItem(STORAGE_KEY);
      const current: string[] = raw ? JSON.parse(raw) : [];
      if (current.includes(normalizedId)) return;
      const next = [...current, normalizedId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setVotedProjects(next);
      console.log("💾 added vote to localStorage:", normalizedId, next);
    } catch (err) {
      console.error("Error saving votedProjects:", err);
    }
  };

  const hasVoted = (id: string) => {
    return votedProjects.includes(String(id));
  };

  const resetVotesForDebug = () => {
    localStorage.removeItem(STORAGE_KEY);
    setVotedProjects([]);
    console.log("🗑️ votedProjects cleared");
  };

  return { votedProjects, hasVoted, addVote, resetVotesForDebug };
}
