import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Product from "../../../models/Product";

export async function GET() {
  try {
    await connectDB();

    const products = await (Product as any)
      .find()
      .sort({
        createdAt: -1,
      });

    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const product = await (Product as any).create({
      name: body.name,
      price: body.price,
      category: body.category || "Office",
      description: body.description || "",
      image: body.image,
      galleryImages: body.galleryImages || [],
    });

    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { id } = await req.json();

    await (Product as any).findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    await (Product as any).findByIdAndUpdate(
      body.id,
      {
        name: body.name,
        price: body.price,
        category: body.category,
        description: body.description,
        image: body.image,
        galleryImages: body.galleryImages || [],
      }
    );

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}