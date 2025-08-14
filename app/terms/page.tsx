import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const generateMetadata = (): Metadata => {
  const title = `Terms of Service | ${siteConfig.name}`;
  const description = "The rules you agree to when using our tools.";
  const url = `${siteConfig.url}/terms`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      images: [{ url: "/opengraph-image" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/opengraph-image"],
    },
  };
};

export default function TermsPage() {
  const year = new Date().getFullYear();
  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
        <p className="text-sm text-gray-500">Last updated {year}</p>
      </header>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Acceptable Use</h2>
        <p>
          You must have the rights to any content you upload and agree not to use
          the service for illegal purposes, malware distribution, or abusive
          automation.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Availability</h2>
        <p>
          We aim for high availability but do not guarantee uninterrupted access
          and may change or discontinue features at any time.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Disclaimer</h2>
        <p>
          The service is provided on an "as is" basis without warranties of any
          kind. Processing results may vary and we do not promise that the tools
          will meet your requirements.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, {siteConfig.name} and its
          providers are not liable for any damages arising from the use of the
          service.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Changes</h2>
        <p>
          We may update these terms from time to time. Continued use of the
          service after changes means you accept the revised terms.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Contact</h2>
        <p>
          Questions about these terms? Email us at <a className="text-blue-600 underline focus:outline-none focus:ring-2 focus:ring-blue-500" href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
        </p>
      </section>
    </main>
  );
}
