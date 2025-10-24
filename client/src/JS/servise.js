const API_KEY = "52883499-f8b872ddd9da854394a79b614"; 
const BASE_URL = "https://pixabay.com/api/";

export async function fetchImages(query, page = 1) {
  const url = `${BASE_URL}?image_type=photo&orientation=horizontal&q=${encodeURIComponent(
    query
  )}&page=${page}&per_page=12&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const data = await response.json();
    return data.hits;
  } catch (error) {
    console.error("Error fetching images:", error);
    throw error;
  }
}
