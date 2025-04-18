import Link from 'next/link';
import React from 'react';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-100 to-pink-50 px-6 py-12">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to LUMA</h1>
        <p className="text-lg text-gray-700 mb-6">
          This isn’t a quiz. It’s a mirror. Answer honestly. Answer instinctively. Reflect deeply. Laugh nervously.
        </p>

        <Link href="https://form.typeform.com/to/umwDrURP" legacyBehavior>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Take the Quiz
          </a>
        </Link>
      </div>
    </main>
  );
}
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-purple-100 to-pink-50 px-6 py-12">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-extrabold mb-4">Welcome to LUMA</h1>
        <p className="text-lg text-gray-700 mb-6">
          This isn’t a quiz. It’s a mirror. Answer honestly. Answer instinctively. Reflect deeply. Laugh nervously.
        </p>

        <Link href="https://form.typeform.com/to/umwDrURP" legacyBehavior>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Take the Quiz
          </a>
        </Link>
      </div>
    </main>
  );
}
