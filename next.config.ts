import type { NextConfig } from 'next'
import createBundleAnalyzer from '@next/bundle-analyzer'

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

export default withBundleAnalyzer(config)
