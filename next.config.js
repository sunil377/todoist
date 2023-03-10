/** @type {import('next').NextConfig} */

const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        })

        return config
    },
    reactStrictMode: true,
    images: {
        domains: ['lh3.googleusercontent.com'],
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/app/today',
                permanent: true,
            },
        ]
    },
}

module.exports = nextConfig
