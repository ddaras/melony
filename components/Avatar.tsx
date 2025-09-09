// Avatar component
export function Avatar({ name, isUser }: { name: string; isUser: boolean }) {
  const avatarStyle: React.CSSProperties = {
    width: "2rem", // w-8
    height: "2rem", // h-8
    borderRadius: "50%", // rounded-full
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem", // text-xs
    fontWeight: "600", // font-semibold
    color: "white",
    backgroundColor: isUser ? "#3b82f6" : "#6b7280", // bg-blue-500 : bg-gray-500
    flexShrink: 0,
  };

  return <div style={avatarStyle}>{name.charAt(0).toUpperCase()}</div>;
}
