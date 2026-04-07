import Image from 'next/image'

interface LogoProps {
  className?: string
}

export default function Logo({ className = '' }: LogoProps) {
  return (
    <Image
      src="/comercial/logo.png"
      alt="VilaColab"
      width={1274}
      height={810}
      priority
      className={className}
      style={{ height: '72px', width: 'auto' }}
    />
  )
}
