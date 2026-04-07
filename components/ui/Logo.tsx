import Image from 'next/image'

interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <Image
      src="/comercial/logo.png"
      alt="VilaColab"
      width={113}
      height={72}
      priority
      className={className}
    />
  )
}
