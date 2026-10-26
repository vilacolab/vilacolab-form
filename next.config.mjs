/** @type {import('next').NextConfig} */
const nextConfig = {
  // O formulário vive em /comercial. A raiz redireciona para ele (307, temporário),
  // para que o portfólio possa ocupar a raiz do domínio no futuro.
  async redirects() {
    return [
      { source: '/', destination: '/comercial', permanent: false },
      { source: '/obrigado', destination: '/comercial/obrigado', permanent: false },
    ]
  },
}

export default nextConfig
