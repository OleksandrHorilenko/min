import React from 'react';
import { CircleLoader } from 'react-spinners';

const Loader = () => {
  const styles: { [key: string]: React.CSSProperties } = {
    loaderContainer: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.8)', // Темный фон с прозрачностью
      zIndex: 9999, // Поверх всего
    },
    loaderText: {
      marginTop: 20,
      fontSize: 18,
      fontWeight: 500,
      color: '#ffffff',
    },
  };

  return (
    <div style={styles.loaderContainer}>
      <CircleLoader color="#3498db" size={100} />
      <div style={styles.loaderText}>Loading...</div>
    </div>
  );
};

export default Loader;

