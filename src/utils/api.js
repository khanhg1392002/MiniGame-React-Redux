export const fetchData = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

// export const fetchWheelData = async () => {
//   const response = await fetch('/data.json');
//   const data = await response.json();
//   return data;
// };