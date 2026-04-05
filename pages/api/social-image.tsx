export const runtime = 'edge'

export default async function OGImage() {
  return new Response('Social image generation is disabled to save build size.', {
    status: 200
  })
}
