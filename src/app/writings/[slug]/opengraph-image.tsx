import {
  SITE_NAME,
  SOCIAL_IMAGE_CONTENT_TYPE,
  SOCIAL_IMAGE_SIZE,
} from "@/lib/site";
import { createSocialImage } from "@/lib/social-image";
import { getWritingBySlug } from "@/lib/writings";

type WritingImageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateImageMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const writing = await getWritingBySlug(params.slug);

  if (!writing) {
    return [];
  }

  return [
    {
      id: writing.slug,
      alt: `${writing.title} — ${SITE_NAME}`,
      size: SOCIAL_IMAGE_SIZE,
      contentType: SOCIAL_IMAGE_CONTENT_TYPE,
    },
  ];
}

export default async function Image({ params }: WritingImageProps) {
  const { slug } = await params;
  const writing = await getWritingBySlug(slug);

  if (!writing) {
    return new Response(null, { status: 404 });
  }

  return createSocialImage({ title: writing.title });
}
