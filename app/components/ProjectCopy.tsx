"use client";
import content from "../../public/content.json";

type CopyKey = keyof typeof content;

export function ProjectCopy({ id }: { id: CopyKey }) {
  const slot = content[id];
  if (!slot?.text) return null;
  return <>{slot.text}</>;
}
