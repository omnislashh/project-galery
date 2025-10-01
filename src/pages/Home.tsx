import React from "react";
import { useProjects } from "../context/ProjectsContext";
import { Link } from "react-router-dom";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Home() {
  const { projects, vote } = useProjects();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="p-6 flex flex-col items-center space-y-2 border-b border-gray-700">
        <img src="/elk_logo_black copie.jpg" alt="Logo" className="h-32 w-auto" />
        <h1 className="text-3xl font-bold">Project Gallery</h1>
        <p className="text-gray-400 text-center max-w-xl">
          Welcome! Browse creative projects including images and code. Click a project to see details and like your favorites!
        </p>
      </header>

      {/* Projects grid */}
      <main className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link
            key={p.id}
            to={`/project/${p.id}`}
            className="bg-gray-800 rounded-lg shadow-md overflow-hidden flex flex-col hover:scale-105 transform transition"
          >
            {/* Image for all projects */}
            <img
              src={p.imageUrl}
              alt={p.title}
              className="h-48 w-full object-cover"
            />

            <div className="p-4 flex flex-col flex-1">
              <h2 className="text-xl font-bold mb-2">{p.title}</h2>
              <p className="text-gray-300 flex-1">{p.description}</p>

              {/* Tech tags */}
              {Array.isArray(p.techTags) && p.techTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {p.techTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-green-600 text-white text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Code snippet */}
              {p.category === "code" && p.codeSnippet && (
                <SyntaxHighlighter
                  language="tsx"
                  style={oneDark}
                  className="mt-2 rounded max-h-40 overflow-auto"
                >
                  {p.codeSnippet}
                </SyntaxHighlighter>
              )}

              <div className="mt-4 flex items-center justify-between">
                <button
                  onClick={(e) => {
                    e.preventDefault(); // empêche la navigation
                    vote(p.id, p.votes);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
                >
                  👍 {p.votes}
                </button>

                {p.externalLink && (
                  <a
                    href={p.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:underline text-sm"
                  >
                    Open Project
                  </a>
                )}
              </div>
            </div>
          </Link>
        ))}
      </main>
    </div>
  );
}
