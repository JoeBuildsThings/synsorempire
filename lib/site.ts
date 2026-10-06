export const site = {
  name: "Synsorempire",
  phoneDisplay: "07040679105",
  whatsappNumber: "2347040679105",
  email: "Lawalife2004@gmail.com",
  location: "Ibadan, Ogunpa",
  paymentPolicy: "Payment is required before delivery.",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export const categoryNotes: Record<string, string> = {
  corporate_wear: "Shirts, T-shirts, trousers, corporate outfits and more",
  corporate_shoes: "Formal shoes in different styles and brands and more",
  sneakers_casual: "Quality sneakers, Crocs, other casual footwear and more",
  streetwear:
    "Jeans, baggy jeans, sweatpants, tops, hoodies, shirts, jerseys, tank tops, crop tops, two piece outfits, shorts and more",
  caps_headwear: "Snapbacks, head warmers, other caps and headwear and more",
  belts: "Stone belts, fashion belts and more",
  bags: "Combo bags, fashion bags and more",
  essentials: "Socks, boxers and more",
};