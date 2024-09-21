"use client"

import { Suspense } from 'react';
import CardContent from './CardContent';

export default function CardPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardContent />
    </Suspense>
  );
}