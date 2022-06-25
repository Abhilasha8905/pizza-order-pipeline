export const getTimeTaken = (a, b) => {
  return Math.floor((a.getTime() - b.getTime()) / 1000);
}; 