import { NextRequest, NextResponse } from 'next/server';
import { findClaims, createClaim, findItemById } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const itemId = searchParams.get('itemId') || undefined;

    const claims = await findClaims(itemId);
    return NextResponse.json({
      success: true,
      data: claims,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve claims' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { itemId, claimantId, claimantName, claimantEmail, claimantPhone, proofAnswer } = body;

    // Server-side validation
    if (!itemId) {
      return NextResponse.json(
        { success: false, error: 'Target itemId is required' },
        { status: 400 }
      );
    }
    if (!claimantName || typeof claimantName !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Claimant name is required' },
        { status: 400 }
      );
    }
    if (!claimantEmail || typeof claimantEmail !== 'string' || !claimantEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid claimant email is required' },
        { status: 400 }
      );
    }
    if (!proofAnswer || typeof proofAnswer !== 'string' || proofAnswer.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'Proof of ownership answer is required' },
        { status: 400 }
      );
    }

    const item = await findItemById(itemId);
    if (!item) {
      return NextResponse.json(
        { success: false, error: 'Target item does not exist' },
        { status: 404 }
      );
    }

    const claim = await createClaim({
      itemId,
      itemTitle: item.title,
      claimantId: claimantId || 'user_guest',
      claimantName: claimantName.trim(),
      claimantEmail: claimantEmail.trim(),
      claimantPhone: claimantPhone?.trim() || undefined,
      proofAnswer: proofAnswer.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Verification claim submitted successfully',
        data: claim,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating claim:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing claim' },
      { status: 500 }
    );
  }
}
