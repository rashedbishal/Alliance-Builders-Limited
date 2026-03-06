import React from 'react';

// Define PropTypes for clarity and safety (optional but recommended)
// import PropTypes from 'prop-types';

/**
 * A responsive Google Maps iframe component.
 * @param {object} props - The component props.
 * @param {string} [props.width='100%'] - The width of the map container (e.g., '100%', '500px').
 * @param {string} [props.height='450px'] - The height of the map container (e.g., '450px', '50vh').
 */
const MapComponent = ({ width = '100%', height = '450px' }) => {
  const mapSrc = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d322.6673673552662!2d90.37134304784664!3d23.798516339002607!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c12fae71412b%3A0xb6df06aab789d2d1!2sAlliance%20Builders%20Ltd!5e0!3m2!1sen!2sbd!4v1759734531076!5m2!1sen!2sbd";

  return (
    // The container controls the dimensions
    <div
      className="relative overflow-hidden rounded-lg shadow-lg" // Added some basic styling
      style={{ width, height }}
    >
      <iframe
        src={mapSrc}
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