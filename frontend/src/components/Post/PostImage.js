import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PostImage = ({ post }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div className='h-[30rem] mb-8'>
      {Array.isArray(post.image) ? (
        <Slider {...settings}>
          {post.image.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`Image ${index + 1}`}
                // className='max-h-[30rem] w-auto mx-auto'
                className='h-[30rem] w-full object-cover mx-auto'
              />
            </div>
          ))}
        </Slider>
      ) : (
        <p>post.image is not an array</p>
      )}
    </div>
  );
};

export default PostImage;
