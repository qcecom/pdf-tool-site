import Link from 'next/link';

export const metadata = {
  title: 'ATS-ready CV Toolkit',
  description: 'Private client-side CV tools. No uploads.',
};

const tools = [
  { href: '/cv/compress', title: 'Compress', desc: 'Shrink your resume PDF for uploads.' },
  { href: '/cv/ats-export', title: 'ATS Export', desc: 'Extract clean text for job portals.' },
  { href: '/cv/ocr', title: 'OCR', desc: 'Recognize text from scanned resumes.' },
  { href: '/cv/jd-match', title: 'JD Match', desc: 'Match your resume to a job description.' },
];

export default function CvIndex() {
  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'ATS-ready CV Toolkit',
            operatingSystem: 'any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
              {
                '@type': 'Question',
                name: 'Are my files uploaded?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'No, everything runs in your browser.',
                },
              },
              {
                '@type': 'Question',
                name: 'Is it free?',
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: 'Yes, all tools are free.',
                },
              },
            ],
          }),
        }}
      />
      <h1 className="text-3xl font-bold">ATS-ready CV Toolkit</h1>
      <ul className="space-y-4">
        {tools.map((t) => (
          <li key={t.href} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{t.title}</h2>
            <p className="mb-2">{t.desc}</p>
            <Link href={t.href} className="px-4 py-2 bg-blue-600 text-white rounded">
              Open
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
