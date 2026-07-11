import fs from "fs";
import path from "path";

export default function AboutPage() {
  const raw = fs.readFileSync(path.join(process.cwd(), "content", "about.mdx"), "utf-8");
  return <article className="prose prose-zinc max-w-none py-8"><div dangerouslySetInnerHTML={{ __html: raw }} /></article>;
}
