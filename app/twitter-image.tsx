import { ImageResponse } from "next/og";
import { SocialImageContent, socialImageSize } from "@/app/_components/socialImage";

export const dynamic = "force-static";
export const size = socialImageSize;
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<SocialImageContent />, { ...size });
}
