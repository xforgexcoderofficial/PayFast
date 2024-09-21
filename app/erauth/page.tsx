"use client"

import { Suspense } from 'react';
import ErAuthContent from './ErAuthContent';

export default function ErAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErAuthContent />
    </Suspense>
  );
}