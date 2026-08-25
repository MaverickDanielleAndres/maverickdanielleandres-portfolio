"use client";

/**
 * AsyncFont: loads a Google Fonts stylesheet without blocking the first
 * paint. The browser fetches the file with a hint to ignore it for
 * layout (media="print"), then swaps it to "all" once it lands — so
 * Lighthouse never flags it as a render-blocking request.
 */
export default function AsyncFont({
  href,
}: {
  href: string;
}) {
  return (
    <>
      <link
        rel="preload"
        as="style"
        href={href}
      />
      <link
        rel="stylesheet"
        href={href}
        media="print"
        onLoad={(e) => {
          const el = e.currentTarget as HTMLLinkElement;
          el.media = "all";
        }}
      />
      <noscript>
        <link rel="stylesheet" href={href} />
      </noscript>
    </>
  );
}
