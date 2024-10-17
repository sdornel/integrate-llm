import { postLlm } from './llm';

export async function POST(req: any): Promise<any> {
  return postLlm(req);
}
