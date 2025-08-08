import React from 'react';

// Define the TypeScript interface for the component's props
interface HeroProps {
  title: string;
  subtitle: string;
  backgroundColor: string;
  image: {
    src: string;
    alt: string;
  };
}

/**
 * A React component for rendering a hero scene using Tailwind CSS.
 */
const Hero: React.FC<HeroProps> = ({ title, subtitle, backgroundColor, image }) => {
  return (
    <section
      className="p-8 text-center"
      style={{ backgroundColor: backgroundColor }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
        <p className="mt-2 text-xl text-gray-600">{subtitle}</p>
        {image && (
          <img
            src={image.src}
            alt={image.alt}
            className="mt-8 rounded-lg shadow-xl mx-auto"
          />
        )}
      </div>
    </section>
  );
};

export default Hero;