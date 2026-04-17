import { promises as fs } from 'fs';
import path from 'path';

const DATA_PATH = path.join(process.cwd(), 'public', 'products.json');

export async function GET() {
  try {
    const data = await fs.readFile(DATA_PATH, 'utf8');
    return Response.json(JSON.parse(data));
  } catch (err) {
    return Response.json({ error: 'Data not found' }, { status: 404 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await fs.writeFile(DATA_PATH, JSON.stringify(body, null, 2), 'utf8');
    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
