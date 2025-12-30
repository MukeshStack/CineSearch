import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Pages/Home";
import MovieDetails from "./components/Pages/MovieDetails";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
