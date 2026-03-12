import React from 'react';

// Define PropTypes for clarity and safety (optional but recommended)
// import PropTypes from 'prop-types';
interface MapComponentProps {
    width?: string;
    height?: string;
    src: string;
}

/**
 * A responsive Google Maps iframe component.
 * @param {object} props - The component props.
 * @param {string} [props.width='100%'] - The width of the map container (e.g., '100%', '500px').
 * @param {string} [props.height='450px'] - The height of the map container (e.g., '450px', '50vh').
 */
const MapComponent = ({ width = '100%', height = '450px', src }: MapComponentProps) => {
  return (
    // The container controls the dimensions
    <div
      className="relative overflow-hidden rounded-lg shadow-lg" // Added some basic styling
      style={{ width, height }}
    >
      <iframe
        src={src}
        className="absolute top-0 left-0 w-full h-full border-0"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Alliance Builders Ltd Location"
      />
    </div>
  );
};

/* Optional: Add PropTypes validation
ResponsiveMap.propTypes = {
  width: PropTypes.string,
  height: PropTypes.string,
};
*/

export default MapComponent;
