/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled:
        process.env.ANALYZE === 'true' && process.env.NODE_ENV === 'production',
})

const nextConfig = {
    webpack(config) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        })

        return config
    },
}

nextConfig.reactStrictMode = true

nextConfig.images = {
    domains: ['lh3.googleusercontent.com'],
}

module.exports = withBundleAnalyzer(nextConfig)
