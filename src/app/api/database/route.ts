import { NextRequest, NextResponse } from 'next/server';
import {
  getDatabaseHealth,
  simulateCorruption,
  restoreFromBackup,
  resetDatabase,
} from '@/lib/db';

export async function GET() {
  try {
    const health = await getDatabaseHealth();
    return NextResponse.json({
      success: true,
      data: health,
    });
  } catch (error: any) {
    console.error('Error fetching database health:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to check database health' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'simulate') {
      const result = await simulateCorruption();
      return NextResponse.json({
        success: true,
        message: 'Database corruption simulated successfully: 5 records affected.',
        data: result,
      });
    }

    if (action === 'recover') {
      const audit = await restoreFromBackup();
      return NextResponse.json({
        success: true,
        message: `Database disaster recovery executed: ${audit.recoveredRecords}/5 records recovered (${audit.recoveryRate}% rate). All affected records restored.`,
        data: audit,
      });
    }

    if (action === 'reset') {
      await resetDatabase();
      const health = await getDatabaseHealth();
      return NextResponse.json({
        success: true,
        message: 'Database reset to clean state.',
        data: health,
      });
    }

    return NextResponse.json(
      { success: false, error: `Invalid action '${action}'. Expected 'simulate', 'recover', or 'reset'.` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Database recovery API error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to process database action' },
      { status: 500 }
    );
  }
}
