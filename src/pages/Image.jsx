import React, { useState } from 'react';

function Image({ src, alt, placeholder = 'https://via.placeholder.com/150', style }) {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? placeholder : src}
      alt={alt}
      style={style}
      onError={() => setError(true)}
    />
  );
}

export default Image;
