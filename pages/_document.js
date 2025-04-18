import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Fonts: Playfair Display for headings, Inter for body */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Inter:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="font-sans bg-luma-beige text-luma-brown">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
