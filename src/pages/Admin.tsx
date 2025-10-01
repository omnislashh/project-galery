import { useState } from "react";
import { useProjects } from "../context/ProjectsContext";

export default function Admin() {
  const { addProject } = useProjects();

  // États du formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"image" | "code">("image");
  const [imageUrl, setImageUrl] = useState("");
  const [externalLink, setExternalLink] = useState("");
  const [techTags, setTechTags] = useState("");
  const [codeSnippet, setCodeSnippet] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description) {
      alert("Le titre et la description sont obligatoires.");
      return;
    }

    if (!imageUrl) {
      alert("L'image est obligatoire pour tous les projets.");
      return;
    }

    try {
      await addProject({
        title,
        description,
        category,
        imageUrl,
        externalLink: externalLink || undefined, // bouton Visit Project pour toutes les catégories
        tags: [],
        techTags: category === "code" && techTags ? techTags.split(",").map(t => t.trim()) : undefined,
        codeSnippet: category === "code" && codeSnippet ? codeSnippet : undefined,
      });

      alert("✅ Projet ajouté !");
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("image");
      setImageUrl("");
      setExternalLink("");
      setTechTags("");
      setCodeSnippet("");
    } catch (err) {
      console.error("Erreur Firebase addProject:", err);
      alert("Erreur lors de l'ajout du projet.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gray-50 rounded shadow mt-6">
      <h1 className="text-2xl font-bold mb-4">Ajouter un projet</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as "image" | "code")}
          className="w-full border p-2 rounded"
        >
          <option value="image">Image</option>
          <option value="code">Code</option>
        </select>

        <input
          type="text"
          placeholder="URL de l'image"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          placeholder="Lien externe (GitHub, ArtStation, portfolio...)"
          value={externalLink}
          onChange={(e) => setExternalLink(e.target.value)}
          className="w-full border p-2 rounded"
        />

        {category === "code" && (
          <>
            <input
              type="text"
              placeholder="Technologies utilisées (séparées par des virgules)"
              value={techTags}
              onChange={(e) => setTechTags(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <textarea
              placeholder="Extrait de code"
              value={codeSnippet}
              onChange={(e) => setCodeSnippet(e.target.value)}
              className="w-full border p-2 rounded"
            />
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}
