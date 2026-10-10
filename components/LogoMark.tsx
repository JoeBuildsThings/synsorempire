export default function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 70 70"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
    >
      <polygon
        points="20,2 44,2 62,20 62,44 44,62 20,62 2,44 2,20"
        transform="translate(3 3)"
        fill="#fd6cc6"
      />
      <polygon
        points="20,2 44,2 62,20 62,44 44,62 20,62 2,44 2,20"
        fill="#93c554"
      />
      <polygon
        points="22,8 42,8 56,22 56,42 42,56 22,56 8,42 8,22"
        fill="#0f3d24"
      />
      <text
        x="32"
        y="46"
        textAnchor="middle"
        fontSize="40"
        fontWeight="900"
        fill="#93c554"
        style={{ fontFamily: "var(--fontDisplay), Arial, sans-serif" }}
      >
        S
      </text>
    </svg>
  );
}
