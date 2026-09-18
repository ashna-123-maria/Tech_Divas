import { NextRequest, NextResponse } from 'next/server';
import { findItemById, updateItem, deleteItem } from '@/lib/db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const item = await findItemById(id);

    if (!item) {
      return NextResponse.json(
        { success: false, error: `Item with id '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: item,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal server error retrieving item' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    const updated = await updateItem(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: `Item with id '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item updated successfully',
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal server error updating item' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteItem(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: `Item with id '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Item removed successfully',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Internal server error deleting item' },
      { status: 500 }
    );
  }
}
