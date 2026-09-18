import { NextRequest, NextResponse } from 'next/server';
import { updateClaim } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status, reviewerNotes } = body;

    if (!status || (status !== 'approved' && status !== 'rejected')) {
      return NextResponse.json(
        { success: false, error: "Status must be either 'approved' or 'rejected'" },
        { status: 400 }
      );
    }

    const updated = await updateClaim(id, {
      status,
      reviewerNotes: reviewerNotes || undefined,
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Claim with id '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Claim successfully ${status}`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal server error updating claim' },
      { status: 500 }
    );
  }
}
