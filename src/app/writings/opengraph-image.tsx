import {
  SOCIAL_IMAGE_CONTENT_TYPE,
  SOCIAL_IMAGE_SIZE,
} from "@/lib/site";
import { createSocialImage } from "@/lib/social-image";

export const alt = "Musings by Steven Sarmiento";
export const size = SOCIAL_IMAGE_SIZE;
export const contentType = SOCIAL_IMAGE_CONTENT_TYPE;

export default function Image() {
  return createSocialImage({ title: "Musings" });
}
