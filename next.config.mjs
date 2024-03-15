/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  output: "standalone",
  images: {
    domains: [
      "localhost",
      "diva-backend-iukkr.ondigitalocean.app",
      "diva-images.blr1.digitaloceanspaces.com",
    ],
  },
};

export default nextConfig;
