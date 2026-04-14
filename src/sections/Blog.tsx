import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { blogConfig } from '../config';

const Blog = () => {
  const shouldRenderNothing = !blogConfig.heading && blogConfig.posts.length === 0;

  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showAllPosts, setShowAllPosts] = useState(false);
  const hasExtraPosts = blogConfig.posts.length > 2;
  const visiblePosts =
    showAllPosts || !hasExtraPosts
      ? blogConfig.posts
      : blogConfig.posts.slice(0, 2);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  if (shouldRenderNothing) return null;

  return (
    <section
      id="blog"
      ref={sectionRef}
      className="py-24 bg-[#f7f7f7]"
    >
      <div className="max-w-[1100px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className={`inline-block mb-4 text-sm tracking-[0.2em] text-[#5a1a2a] font-medium uppercase transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {blogConfig.tag}
          </span>
          <h2
            className={`font-serif text-4xl md:text-5xl text-black mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            {blogConfig.heading}
          </h2>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visiblePosts.map((post, index) => (
            <article
              key={post.id}
              className={`group relative h-[500px] overflow-hidden cursor-pointer transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${400 + index * 150}ms` }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-600"
                style={{ backgroundImage: `url(${post.image})` }}
              />

              {/* Dark overlay - appears on hover */}
              <div
                className="absolute inset-0 bg-black/60 opacity-60 group-hover:opacity-90 transition-opacity duration-600"
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                {/* Date */}
                <span className="text-sm font-light tracking-wide opacity-80 mb-3 transform translate-y-0 group-hover:-translate-y-4 transition-transform duration-600">
                  {post.date}
                </span>

                {/* Title */}
                <h3 className="font-serif text-2xl md:text-[26px] leading-tight mb-4 transform translate-y-0 group-hover:-translate-y-4 transition-transform duration-600">
                  {post.title}
                </h3>

                {/* Excerpt - hidden by default, shows on hover */}
                <p className="text-sm font-light opacity-0 transform translate-y-4 group-hover:opacity-80 group-hover:translate-y-0 transition-all duration-600 mb-4">
                  {post.excerpt}
                </p>

                {/* Read More Link */}
                <div className="flex items-center gap-2 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-600">
                  <span className="text-sm tracking-[0.2em] uppercase">{blogConfig.readMoreText}</span>
                  <ArrowRight size={16} />
                  {/* Underline animation */}
                  <div className="absolute bottom-6 left-6 h-[2px] bg-[#7f7e7e] w-0 group-hover:w-24 transition-all duration-600" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Link */}
        {blogConfig.viewAllText && hasExtraPosts && (
          <div
            className={`text-center mt-12 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '900ms' }}
          >
            <button
              type="button"
              onClick={() => setShowAllPosts((currentValue) => !currentValue)}
              className="inline-flex items-center gap-2 text-[#5a1a2a] font-medium tracking-wide hover:gap-4 transition-all duration-300"
            >
              {showAllPosts ? 'Show Fewer Articles' : blogConfig.viewAllText}
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
