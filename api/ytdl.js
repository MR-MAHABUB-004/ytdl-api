import axios from "axios";

// Helper function to extract YouTube Video ID
const getYouTubeID = (url) => {
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Please provide a YouTube URL" });
  }

  const videoId = getYouTubeID(url);
  if (!videoId) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }

  try {
    const response = await axios.get(
      `https://api.cdnframe.com/api/v5/info/${videoId}`,
      {
        headers: {
          authority: "api.cdnframe.com",
          accept: "application/json",
          "accept-language": "en-US,en;q=0.9",
          authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmlnaW4iOiJodHRwczovL2NsaWNrYXBpLm5ldCIsInNlc3Npb25JZCI6IjYyNjUxNjExLTA0YTQtNDE4Ny1hMTMyLTZhMjEyMmEzNTc2YSIsImlhdCI6MTc2ODkyMjA0NSwiZXhwIjoxNzY4OTIyNjQ1fQ.8x2_WPK3V7PQqBz-s9NH2TqixUT6tkaq17-Kpp-AxMs",
          "cache-control": "no-cache",
          origin: "https://clickapi.net",
          pragma: "no-cache",
          referer: "https://clickapi.net/",
          "user-agent":
            "Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/137.0.0.0 Mobile Safari/537.36",
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(error.response?.status || 500).json({
      error: "Failed to fetch video info",
      details: error.message,
    });
  }
}
