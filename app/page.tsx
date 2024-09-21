"use client"

import { Suspense } from 'react'
import SkeletonLoader from './SkeletonLoader'
import HomeContent from './HomeContent'

export default function Home() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <HomeContent />
    </Suspense>
  )
}
