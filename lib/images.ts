export function imageUrl(publicId: string, width = 800, ratio?: string) {
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const crop = ratio ? `c_fill,ar_${ratio},g_auto` : "c_limit";
  return `https://res.cloudinary.com/${cloud}/image/upload/f_auto,q_auto,${crop},w_${width}/${publicId}`;
}