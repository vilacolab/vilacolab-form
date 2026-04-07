import Image from 'next/image'

interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <Image
      src="/comercial/logo.png"
      alt="VilaColab"
      width={120}
      height={76}
      priority
      className={className}
      style={{ height: '68px', width: 'auto' }}
    />
  )
}
