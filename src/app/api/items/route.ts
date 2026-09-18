import { NextRequest, NextResponse } from 'next/server';
import { findItems, createItem } from '@/lib/db';
import { ItemType, ItemCategory } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get('search') || undefined;
    const category = searchParams.get('category') || undefined;
    const location = searchParams.get('location') || undefined;
    const type = (searchParams.get('type') as any) || undefined;
    const status = searchParams.get('status') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await findItems({
      search,
      category,
      location,
      type,
      status,
      page,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: result.items,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    });
  } catch (error: any) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve campus items' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      type,
      category,
      location,
      locationDetails,
      date,
      imageUrl,
      proofQuestion,
      contactName,
      contactEmail,
      contactPhone,
      reportedBy,
    } = body;

    // Server-side input validation
    const validationErrors: Record<string, string> = {};

    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      validationErrors.title = 'Title must be at least 3 characters';
    }
    if (!description || typeof description !== 'string' || description.trim().length < 5) {
      validationErrors.description = 'Description must be at least 5 characters';
    }
    if (!type || (type !== 'lost' && type !== 'found')) {
      validationErrors.type = "Type must be either 'lost' or 'found'";
    }
    if (!category) {
      validationErrors.category = 'Category is required';
    }
    if (!location) {
      validationErrors.location = 'Campus location is required';
    }
    if (!date) {
      validationErrors.date = 'Date is required';
    }
    if (!contactName || typeof contactName !== 'string') {
      validationErrors.contactName = 'Contact name is required';
    }
    if (!contactEmail || typeof contactEmail !== 'string' || !contactEmail.includes('@')) {
      validationErrors.contactEmail = 'Valid contact email is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed on submitted item',
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    const newItem = await createItem({
      title: title.trim(),
      description: description.trim(),
      type: type as ItemType,
      category: category as ItemCategory,
      location: location.trim(),
      locationDetails: locationDetails?.trim() || undefined,
      date,
      imageUrl: imageUrl?.trim() || undefined,
      proofQuestion: type === 'found' && proofQuestion?.trim() ? proofQuestion.trim() : undefined,
      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone?.trim() || undefined,
      reportedBy: reportedBy || 'user_guest',
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Item posted successfully',
        data: newItem,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while creating item' },
      { status: 500 }
    );
  }
}
