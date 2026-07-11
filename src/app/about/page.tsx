import fs from "fs";
import path from "path";
import { marked } from "marked";

export default async function AboutPage() {
  const raw = fs.readFileSync(path.join(process.cwd(), "content", "about.mdx"), "utf-8");
  const html = await marked.parse(raw);
  return <article className="prose prose-zinc max-w-none py-8"><div dangerouslySetInnerHTML={{ __html: html }} /></article>;
}
