import { Helmet } from 'react-helmet-async';
import { siteConfig, company } from '../content/company';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  children?: React.ReactNode;
}

export function Seo({ title, description, image, children }: SeoProps) {
  const pageTitle = title
    ? `${title} | ${siteConfig.title}`
    : siteConfig.title;
  const pageDescription = description || siteConfig.description;
  const pageImage = image || '/logo.png';

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={siteConfig.url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />

      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: siteConfig.title,
          url: siteConfig.url,
          logo: `${siteConfig.url}/logo.png`,
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+254721148009',
            contactType: 'customer service',
            email: 'ridgewillglobal@gmail.com',
            availableLanguage: ['en', 'sw', 'fr'],
          },
          sameAs: company.socialLinks.map((link) => link.url),
        })}
      </script>

      {children}
    </Helmet>
  );
}
