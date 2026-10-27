import Image from 'next/image'

interface LogoProps {
  className?: string
  width?: number
}

// logo.png tem proporção 1274 × 810
export default function Logo({ className = '', width = 113 }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="VilaColab"
      width={width}
      height={Math.round((width * 810) / 1274)}
      priority
      className={className}
    />
  )
}
