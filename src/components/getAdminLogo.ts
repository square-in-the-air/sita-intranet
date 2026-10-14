import type { Payload } from 'payload'

const DEFAULT_ADMIN_LOGO = 'SITA_Primary_Dark.svg'

// The logo for the admin panel, which has a light background so it needs a dark logo.
// Uses the alternative logo set in Globals → Logo, then SITA_Primary_Dark.svg from the media library.
export async function getAdminLogo(payload: Payload): Promise<{ url: string; alt: string }> {
  const { adminImage } = await payload.findGlobal({ slug: 'logo', depth: 1 })
  if (adminImage && typeof adminImage === 'object' && adminImage.url) {
    return { url: adminImage.url, alt: adminImage.alt || 'SITA' }
  }

  return { url: `/api/media/file/${DEFAULT_ADMIN_LOGO}`, alt: 'SITA' }
}
