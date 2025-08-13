import React, { useState } from 'react';

const Logo = ({ size = '60px', logoUrl, primaryColor }) => {
  const [imageError, setImageError] = useState(false);

  // Default logo component
  const DefaultLogo = () => (
    <div style={{ 
      width: size, 
      height: size, 
      backgroundColor: primaryColor || '#e53935', 
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '18px',
      fontWeight: 'bold'
    }}>
      RG
    </div>
  );

  // If we have a dynamic logo URL and no error, use it
  if (logoUrl && !imageError) {
    return (
      <img 
        src={logoUrl}
        alt="Logo"
        style={{ 
          height: size,
          width: 'auto',
          maxWidth: '200px',
          objectFit: 'contain'
        }}
        onError={(e) => {
          console.error('Logo failed to load:', logoUrl);
          setImageError(true);
        }}
      />
    );
  }

  // Fallback to default logo
  return <DefaultLogo />;
};

export default Logo;
