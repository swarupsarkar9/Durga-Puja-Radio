import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import YouTubePlayer from "./components/YouTubePlayer";
import MusicPlayer from "./components/MusicPlayer";
import HomePage from "./pages/HomePage";
import SongsPage from "./pages/SongsPage";
import { usePlayerStore } from "./store/playerStore";

function App() {
  const hasStarted = usePlayerStore((s) => s.hasStarted);

  const handleSeek = (time: number) => {
    const seek = (window as any).__durgaPujaSeek;
    if (seek) seek(time);
  };

return (
  <BrowserRouter>
    <div className="min-h-screen text-[#e5e5e5]">
      <div className="noise-overlay" />

      <Navbar />

      <div className={`relative z-10 ${hasStarted ? "pb-28" : ""}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/songs" element={<SongsPage />} />
        </Routes>
      </div>

      <YouTubePlayer />
      {hasStarted && <MusicPlayer onSeek={handleSeek} />}
    </div>
  </BrowserRouter>
);
}

export default App;
