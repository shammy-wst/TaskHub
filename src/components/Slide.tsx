import React from "react";

interface SlideProps {
  title: string;
  content: string;
}

const Slide: React.FC<SlideProps> = ({ title, content }) => {
  return (
    <div className="flex flex-col gap-6 p-8 border-[3px] border-white rounded-lg">
      <h2 className="text-3xl font-bold">{title}</h2>
      <p className="text-lg text-zinc-300">{content}</p>
    </div>
  );
};

export default Slide;
