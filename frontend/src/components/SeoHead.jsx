import React from 'react';
import { Helmet } from 'react-helmet';
import {
  SITE_ORIGIN,
  SITE_NAME,
  SITE_LANGUAGE,
  DEFAULT_OG_IMAGE,
  DEFAULT_TITLE,
  DEFAULT_DESCRIPTION,
} from '@/config/seo';
import { absoluteUrl } from '@/utils/seoText';

/**
 * Central SEO head tags — single canonical source per page.
 */
const SeoHead = ({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  canonicalPath,
  robots = 'index, follow',
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  ogImageAlt,
  jsonLd,
  children,
}) => {
  const canonical = canonicalPath
    ? absoluteUrl(SITE_ORIGIN, canonicalPath)
    : undefined;

  const schemas = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet prioritizeSeoTags>
      <html lang={SITE_LANGUAGE.split('-')[0]} />
      <title>{title}</title>
      <meta name="description" content={description} />
      {robots ? <meta name="robots" content={robots} /> : null}
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}
      {ogImageAlt ? <meta property="og:image:alt" content={ogImageAlt} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}

      {schemas.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {typeof schema === 'string' ? schema : JSON.stringify(schema)}
        </script>
      ))}

      {children}
    </Helmet>
  );
};

export default SeoHead;
