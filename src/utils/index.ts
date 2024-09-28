export const formatSeconds = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(remainingSeconds).padStart(2, "0")}`
    : `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(
        2,
        "0"
      )}`;
};

export const truncateSongTitle = (title: string, maxLength = 60): string => {
  if (title.length <= maxLength) {
    return title;
  }
  return title.substring(0, maxLength) + "...";
};
