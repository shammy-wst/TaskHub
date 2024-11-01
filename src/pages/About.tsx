import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import cubeGif from "../assets/cube.gif";
import chickenGif from "../assets/chicken.gif";
import galaxyGif from "../assets/galaxy.gif";
const About: React.FC = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slides] = useState([
    {
      title: "The genesis of TaskHub",
      content:
        "In the neon-lit hours of a sleepless night in 2024, TaskHub was born from chaos. As a freelance developer drowning in sticky notes and missed deadlines, I hit rock bottom after losing a dream project due to poor organization. That night, staring at my cluttered desk illuminated by monitor glow I realized something: he tools I needed didn't exist because they were trying to be everything for everyone.",
    },
    {
      title: "The digital revolution",
      content:
        "TaskHub isn't just another task manager – it's a rebellion against complexity. Inspired by the elegant simplicity of retro gaming consoles and the raw efficiency of command-line interfaces, we stripped away the unnecessary. Every pixel, every interaction was crafted with one goal: to help you enter the flow state where real productivity happens.",
    },
    {
      title: "The TaskHub Philosophy",
      content:
        "We believe that great work happens when you're in the zone – that magical state where time melts away and pure creativity flows. TaskHub is designed to be your digital dojo, a sacred space where distractions fade and focus reigns supreme. Our minimalist interface isn't just aesthetic; it's a statement about what truly matters in productivity.",
    },
    {
      title: "Join the Movement",
      content:
        "Today, TaskHub is more than a tool – it's a community of creators, developers, and dreamers who believe in the power of focused work. Every task you complete, every project you conquer adds to our collective story. We're not here to manage your time; we're here to help you make history. 'In a world of endless notifications and constant distractions, TaskHub stands as a beacon for those who dare to focus, create, and achieve. dare to focus, create, and achieve.'- Icham M'MADI, Creator of TaskHub",
    },
    {
      title: "Meet the Creator",
      content: `Hi, I'm Icham M'MADI, a junior freelance developer in my final year of a web development bachelor's degree. I find joy in coding and creating innovative, visually appealing experiences. Currently studying at HETIC, I'm driven by passion rather than profit - what matters most is being fulfilled in what I do.

      My approach to both code and life is straightforward: I love sports, enjoy simplicity, and am always eager to explore new creative possibilities.`,
      links: [
        {
          icon: "LinkedIn",
          url: "https://www.linkedin.com/in/aichammmadi/",
          label: "Connect with me",
        },
        {
          icon: "Portfolio",
          url: "https://icham-mmadi.fr/projects",
          label: "See my work",
        },
        {
          icon: "Discord",
          url: "https://discord.gg/sA6cEFxQ",
          label: "Join my community",
        },
      ],
    },
  ]);

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % slides.length);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Background animation */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${cubeGif})`,
            backgroundSize: "50%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col w-full h-screen p-8">
        {/* Header section with back button */}
        <div className="flex w-full mb-8">
          <button
            onClick={() => navigate("/")}
            className="border-[3px] border-white px-4 py-2 font-mono text-sm flex items-center gap-2 group relative"
          >
            <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-200 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
              Back to TaskHub
            </span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <img
                src={chickenGif}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </button>
        </div>

        {/* Carousel section */}
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-4xl w-full">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-4">
                    <div className="border-[3px] border-white p-6">
                      <h2 className="text-2xl font-bold mb-6 font-mono">
                        {slide.title}
                      </h2>
                      <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                        {slide.content}
                      </p>
                      {slide.links && (
                        <div className="flex flex-wrap gap-4 mt-6">
                          {slide.links.map((link, i) => (
                            <a
                              key={i}
                              href={link.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border-[3px] border-white px-4 py-2 text-white transition-all duration-200 font-mono text-sm flex items-center gap-2 group relative"
                            >
                              <span className="relative z-10 group-hover:opacity-0 transition-opacity duration-200">
                                {link.label}
                              </span>
                              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <img
                                  src={galaxyGif}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevSlide}
                className="border-[3px] border-white px-4 py-2 font-mono text-sm"
              >
                Previous
              </button>
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 border-2 border-white ${
                      currentSlide === index ? "bg-white" : ""
                    }`}
                  />
                ))}
              </div>
              <button
                onClick={nextSlide}
                className="border-[3px] border-white px-4 py-2 font-mono text-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
