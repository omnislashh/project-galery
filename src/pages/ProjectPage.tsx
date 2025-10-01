import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import type { Project } from "../types";
import { useProjects } from "../context/ProjectsContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vote } = useProjects();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchProject = async () => {
      const ref = doc(db, "projects", id);
      const snapshot = await getDoc(ref);
      if (snapshot.exists()) setProject(snapshot.data() as Project);
    };
    fetchProject();
  }, [id]);

  if (!project) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;

  const handleVote = () => {
    const votedProjects: string[] = JSON.parse(localStorage.getItem("votedProjects") || "[]");
    if (votedProjects.includes(project.id)) {
      alert("You already voted for this project!");
      return;
    }
    vote(project.id, project.votes);
    votedProjects.push(project.id);
    localStorage.setItem("votedProjects", JSON.stringify(votedProjects));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-gray-700 px-4 py-2 rounded hover:bg-gray-600"
      >
        ← Back
      </button>

      <div className="max-w-3xl mx-auto bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <img src={project.imageUrl} alt={project.title} className="w-full h-64 object-cover" />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{project.title}</h1>
          <p className="mb-4">{project.description}</p>

          {project.category === "code" && Array.isArray(project.techTags) && project.techTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {project.techTags.map((tag, idx) => (
                <span key={idx} className="bg-green-600 px-2 py-1 rounded text-xs">{tag}</span>
              ))}
            </div>
          )}

          {project.category === "code" && project.codeSnippet && (
            <SyntaxHighlighter
              language="tsx"
              style={oneDark}
              className="rounded mb-4 max-h-64 overflow-auto"
            >
              {project.codeSnippet}
            </SyntaxHighlighter>
          )}

          {project.externalLink && (
            <a
              href={project.externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mb-4 transition"
            >
              Visit Project
            </a>
          )}

          <div className="mt-4">
            <button
              onClick={handleVote}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded transition"
            >
              👍 {project.votes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
