import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb";
import Order from "../../../models/Order";

export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const customer = searchParams.get("customer");

    let orders;

    if (customer) {
      orders = await (Order as any)
        .find({
          customer,
        })
        .sort({
          createdAt: -1,
        });
    } else {
      orders = await (Order as any)
        .find()
        .sort({
          createdAt: -1,
        });
    }

    return NextResponse.json(orders);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const order = await (Order as any).create({
      product: body.product,
      customer: body.customer,
      amount: body.amount,
      status: body.status || "Processing",
    });

    return NextResponse.json(order);
  } catch {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    await (Order as any).findByIdAndUpdate(
      body.id,
      {
        status: body.status,
      }
    );

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}