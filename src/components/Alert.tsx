type AlertType = "success" | "error" | "warning" | "info";

const styles: Record<AlertType, string> = {
  success: "bg-green-100 border-green-500 text-green-700",
  error: "bg-red-100 border-red-500 text-red-700",
  warning: "bg-yellow-100 border-yellow-500 text-yellow-700",
  info: "bg-blue-100 border-blue-500 text-blue-700",
};

const icons: Record<AlertType, string> = {
  success: "✅",
  error: "❌",
  warning: "⚠️",
  info: "ℹ️",
};

export const Alert = ({ type, message }: { type: AlertType; message: string }) => (
  <div class={`border-l-4 p-4 rounded ${styles[type]}`}>
    <span class="mr-2">{icons[type]}</span>
    {message}
  </div>
);

export const LogItem = ({ status, domain, message, time }: { status: string; domain: string; message: string; time?: string }) => {
  const isSuccess = status === "success";
  return (
    <div class={`p-2 border-l-4 ${isSuccess ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"} mb-2 rounded-r`}>
      <span class="font-medium">{isSuccess ? "✅" : "❌"} {domain}</span>
      <span class="text-gray-600 ml-2 text-sm">{message}</span>
      {time && <span class="text-gray-400 text-xs ml-2">{time}</span>}
    </div>
  );
};
