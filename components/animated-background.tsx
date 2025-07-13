export function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="particle" />
      ))}
    </div>
  )
}
