import React from 'react';
import Carousel from './Carousel';

const App = () => {
  const items = [
    { src: 'https://example.com/img1.jpg', caption: 'Image 1' },
    { src: 'https://example.com/img2.jpg', caption: 'Image 2' },
    { src: 'https://example.com/img3.jpg', caption: 'Image 3' },
  ];

  const handleImageClick = (index, imageSrc) => {
    console.log(`Image clicked: ${imageSrc}, at index: ${index}`);
    // You can perform any action when the image is clicked, like opening a modal, etc.
  };

  return (
    <div className="App">
      <Carousel items={items} onImageClick={handleImageClick} />
    </div>
  );
};

export default App;
