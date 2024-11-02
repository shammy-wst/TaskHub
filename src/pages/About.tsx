import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useSound } from "../hooks/useSound";
import cubeGif from "../assets/cube.gif";
import Slide from "../components/Slide";
import { slides } from "../data/slides";

const About: React.FC = () => {
  const navigate = useNavigate();
  const { playClickSound } = useSound();
  const [currentSlide, setCurrentSlide] = useState(0);

  const navigationButtons = useMemo(() => {
    const prevSlide = () => {
      playClickSound();
      setCurrentSlide((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const nextSlide = () => {
      playClickSound();
      setCurrentSlide((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
    };

    return {
      prev: (
        <button
          onClick={prevSlide}
          className="border-2 border-white/50 bg-black/50 rounded-lg p-2
                  hover:bg-white hover:text-black transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      ),
      next: (
        <button
          onClick={nextSlide}
          className="border-2 border-white/50 bg-black/50 rounded-lg p-2
                  hover:bg-white hover:text-black transition-all duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      ),
    };
  }, [playClickSound]);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />

      {/* Background avec cube */}
      <div className="fixed inset-0 z-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${cubeGif})`,
            backgroundSize: "25%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-4xl flex flex-col">
          <button
            onClick={() => {
              playClickSound();
              navigate("/");
            }}
            className="self-start mb-8 border-2 border-white/50 bg-black/50 rounded-lg px-4 py-2
                     hover:bg-white hover:text-black transition-all duration-200 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </button>

          {/* Contenu des slides */}
          <div className="flex-1 flex flex-col items-center">
            <div className="w-full">
              <Slide {...slides[currentSlide]} />
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-center items-center gap-4 mt-8">
            {navigationButtons.prev}
            <span className="text-white">
              {currentSlide + 1} / {slides.length}
            </span>
            {navigationButtons.next}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default About;
