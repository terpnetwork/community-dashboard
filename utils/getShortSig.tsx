export function getShortSig(str: string | any[]) {
  if (str && str.length >= 10) {
    const firstFive = str.slice(0, 5);
    const lastFive = str.slice(-5);
    return firstFive + "..." + lastFive;
  }
  return str; // Return the original string if it's too short to truncate
}