import Script from "next/script";

type TagManagerProps = {
  gtmId: string | null;
};

export default function TagManager({ gtmId }: TagManagerProps) {
  if (!gtmId) return null;

  return (
    <>
      <Script
        id="gtm-init"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              'gtm.start': new Date().getTime(),
              event: 'gtm.js',
            });
            window.dataLayer.push({
              event: 'page_view',
              page_path: window.location.pathname + window.location.search,
              page_location: window.location.href,
              page_title: document.title
            });
            window.dataLayer.push({
              event: 'gtm_bootstrap',
              app_name: 'amader-product',
              app_env: '${process.env.NODE_ENV ?? "development"}'
            });
          `,
        }}
      />
      <Script
        id="gtm-src"
        src={`https://www.googletagmanager.com/gtm.js?id=${gtmId}`}
        strategy="beforeInteractive"
      />
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
          title="gtm"
        />
      </noscript>
    </>
  );
}
