import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '../../../lib/database';
import { Calculation } from '../../../entities/Calculation';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);
    const records = await repo.find({
      order: { createdAt: 'DESC' },
      take: 50,
    });
    return NextResponse.json(records);
  } catch (error) {
    console.error('GET /api/calculations error:', error);
    return NextResponse.json({ error: 'Failed to fetch calculations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { expression, result, type } = body;

    if (!expression || !result) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);

    const calc = repo.create({
      expression,
      result,
      type: type || 'basic',
    });

    await repo.save(calc);
    return NextResponse.json(calc, { status: 201 });
  } catch (error) {
    console.error('POST /api/calculations error:', error);
    return NextResponse.json({ error: 'Failed to save calculation' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);
    await repo.clear();
    return NextResponse.json({ message: 'History cleared' });
  } catch (error) {
    console.error('DELETE /api/calculations error:', error);
    return NextResponse.json({ error: 'Failed to clear history' }, { status: 500 });
  }
}
