"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
          <button onClick={() => reset()} className="px-4 py-2 bg-blue-500 text-white rounded">
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
