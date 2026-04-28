import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { amount } = await req.json()

    if (!amount || amount < 50) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    console.log("Stripe Key Set:", !!process.env.STRIPE_SECRET_KEY)
    console.log("Amount:", amount)
    console.log("Base URL:", baseUrl)

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Logo Design Order",
              description: "Professional logo design service",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/branding-calculator`,
    })

    console.log("Session Created:", session.id)
    console.log("Session URL:", session.url)

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Checkout failed" },
      { status: 500 }
    )
  }
}
