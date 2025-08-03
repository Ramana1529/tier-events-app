'use client';

export default function Error({ error, reset }) {
  return (
    <div className="p-6 text-red-600">
      <h2 className="text-xl font-bold">Something went wrong:</h2>
      <pre className="mt-4">{error.message}</pre>
      <button
        onClick={() => reset()}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Try again
      </button>
    </div>
  );
}
