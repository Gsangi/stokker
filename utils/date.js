export function formatDate(dateStr, formatString = "YYYY-MM-DD HH:mm:ss") {
  // 1. Create a Date object
  const date = new Date(dateStr);

  // 2.  Define format components (replace with library functions if desired)
  const formatComponents = {
    YYYY: date.getFullYear(),
    MM: (date.getMonth() + 1).toString().padStart(2, "0"),
    DD: date.getDate().toString().padStart(2, "0"),
    HH: date.getHours().toString().padStart(2, "0"),
    mm: date.getMinutes().toString().padStart(2, "0"),
    ss: date.getSeconds().toString().padStart(2, "0"),
  };

  // 3. Replace placeholders in the format string
  return formatString.replace(
    /(YYYY|MM|DD|HH|mm|ss)/g,
    (match) => formatComponents[match],
  );
}
