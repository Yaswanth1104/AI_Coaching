export default function StatusBadge({ label, type }) {

  const styles = {
    emotion: "bg-yellow-500 text-black",
    positive: "bg-green-600",
    negative: "bg-red-600",
    neutral: "bg-gray-600",
    high: "bg-red-600",
    medium: "bg-yellow-500 text-black",
    low: "bg-green-600",
    info: "bg-blue-600"
  };

  return (
    <span
      className={`px-4 py-1 rounded-full text-sm font-semibold ${
        styles[type] || "bg-blue-600"
      }`}
    >
      {label}
    </span>
  );
}