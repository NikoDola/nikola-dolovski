import Link from 'next/link'

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <div className="text-green-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="mb-6">Thank you for your purchase.</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Return Home
        </Link>
      </div>
    </div>
  )
}