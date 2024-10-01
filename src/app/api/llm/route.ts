import { postLlm } from './llm';

export async function POST(req: any): Promise<any> {
  console.log('REQUEST:', req.body);
  return postLlm(req);
}
