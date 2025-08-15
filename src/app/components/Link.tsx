type Props = React.PropsWithChildren<{ href: string; className?: string; ariaLabel?: string }>
export function Link({ href, className, children, ariaLabel }: Props) {
  return (
    <a className={className} href={href} aria-label={ariaLabel}>
      {children}
    </a>
  )
}
