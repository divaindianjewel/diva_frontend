import { unified } from 'unified';
import remark from 'remark';
import react from 'remark-react';

const processor = unified()
  .use(remark)
  .use(react);

export async function markdownToJSX(markdown: string) {
  const result = await processor.process(markdown);
  return result.contents;
}