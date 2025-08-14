import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const generateMetadata = (): Metadata => {
  const title = `Privacy Policy | ${siteConfig.name}`;
  const description = "How we protect your data and how the service handles uploaded files.";
  const url = `${siteConfig.url}/privacy`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: siteConfig.ogImage }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [siteConfig.ogImage],
    },
  };
};

export default function PrivacyPage() {
  const year = new Date().getFullYear();
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-gray-500">Last updated {year}</p>
      </header>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Overview</h2>
        <p>
          {siteConfig.name} converts and processes your files securely over HTTPS.
          Files are handled in memory or temporary storage only for the purpose of
          conversion.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Data We Process</h2>
        <p>
          Uploaded files are used solely for the requested operation and are
          automatically deleted after processing. They are never stored long term
          or used for model training. We keep minimal operational logs containing
          error codes and timestamps but no file contents.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Cookies</h2>
        <p>
          We only use essential cookies needed for the site to function unless
          you explicitly opt-in to analytics.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Security</h2>
        <p>
          All connections use HTTPS and access is restricted to authorized
          systems. We do not share your files with third parties except trusted
          infrastructure providers that help deliver the service.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Retention</h2>
        <p>
          Temporary files are removed automatically after processing is complete,
          and operational logs are kept only as long as necessary to ensure the
          service runs smoothly.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Rights</h2>
        <p>
          If you have questions about your data or want it removed from our
          logs, please contact us and we will assist you.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>
          Reach us at <a className="text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-blue-500" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </section>
    </main>
  );
}
