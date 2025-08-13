import Head from 'next/head';

interface Props {
  title: string;
  description: string;
}

export default function Seo({ title, description }: Props) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>
  );
}
