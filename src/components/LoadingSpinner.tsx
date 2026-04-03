export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-64">
      <div className="loader"></div>
    </div>
  );
}

export function SkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton h-64 rounded-lg"></div>
      ))}
    </div>
  );
}
