export type Project = {
  id: string;
  title: string;
  description: string;
  category: "image" | "code";
  imageUrl: string;            // obligatoire pour tous
  externalLink?: string;       // facultatif, utilisé par le bouton Visit Project
  votes: number;
  createdAt: string;
  tags: string[];
  techTags?: string[];         // pour projets code
  codeSnippet?: string;        // optionnel, extrait de code
};
