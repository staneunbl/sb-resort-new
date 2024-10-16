/* 
 @type {import('next').NextConfig} 

const nextConfig = {};
module.exports = nextConfig; */


const MillionCompiler = require("@million/lint");
const { env } = require("process");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "uaukaqfnisyvjiondsrq.supabase.co",
        pathname: "/**",
      }
    ]
  },
};

module.exports = nextConfig;

/* module.exports = MillionCompiler.next({
    rsc: true, // if used in the app router mode
})(nextConfig); */
