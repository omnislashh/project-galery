import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export default function TestAddProject() {
  const handleAdd = async () => {
    try {
      await addDoc(collection(db, "projects"), {
        title: "Projet Test",
        description: "Ajout via TestAddProject",
        tags: [],
        votes: 0,
        createdAt: serverTimestamp(),
        category: "image",
        imageUrl: "https://via.placeholder.com/150",
        externalLink: null, // toujours préciser null si pas de lien
      });

      alert("✅ Projet ajouté avec succès !");
    } catch (err) {
      console.error("❌ Erreur Firebase:", err);
      alert("Erreur: " + JSON.stringify(err));
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleAdd}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        ➕ Ajouter un projet test
      </button>
    </div>
  );
}
