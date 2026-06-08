export function PageWrapper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`mx-auto max-w-2xl ${className ?? ""}`}>{children}</div>
}
