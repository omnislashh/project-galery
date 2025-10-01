import { useState } from "react";
import { useProjects } from "../context/ProjectsContext";

export default function ProjectForm() {
  const { addProject } = useProjects();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState<"image" | "code">("image");
  const [externalLink, setExternalLink] = useState(""); // Optionnel

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // On construit l'objet à envoyer à Firestore
      const projectToAdd = {
        title: title.trim(),
        description: description.trim(),
        tags: [], // toujours un tableau
        imageUrl: imageUrl.trim() || "", // jamais undefined
        category,
        externalLink: externalLink.trim() || undefined, // optionnel
      };

      console.log("Projet à ajouter :", projectToAdd);

      await addProject(projectToAdd);

      // Reset du formulaire
      setTitle("");
      setDescription("");
      setImageUrl("");
      setExternalLink("");
      setCategory("image");

      alert("✅ Projet ajouté avec succès !");
    } catch (err) {
      console.error("Erreur lors de l’ajout du projet :", err);
      alert("❌ Erreur lors de l’ajout du projet");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Ajouter un projet</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border p-2"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border p-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="w-full border p-2"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <input
          className="w-full border p-2"
          placeholder="Lien externe (GitHub, ArtStation, etc.)"
          value={externalLink}
          onChange={(e) => setExternalLink(e.target.value)}
        />
        <select
          className="w-full border p-2"
          value={category}
          onChange={(e) => setCategory(e.target.value as "image" | "code")}
        >
          <option value="image">Image</option>
          <option value="code">Code</option>
        </select>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          type="submit"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}
