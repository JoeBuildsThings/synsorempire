import { site, whatsappLink } from "@/lib/site";

export default function WhatsAppFloat() {
  return (
    <a
      className="floatChat"
      href={whatsappLink(`Hello ${site.name}, I have a question about your products. `)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Synsorempire on WhatsApp"
    >
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      </svg>
      <span>Chat with us</span>
    </a>
  );
}