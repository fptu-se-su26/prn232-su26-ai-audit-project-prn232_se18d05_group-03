export default function Skeleton({ className }: { className?: string }) {
  return <div className={`bg-surface-container-low animate-pulse rounded ${className ?? ""}`} />;
}
