/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  // Export each page as <route>/index.html so clean URLs (e.g. /privacy-policy)
  // resolve on plain static hosting, which does not map /x -> /x.html.
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
