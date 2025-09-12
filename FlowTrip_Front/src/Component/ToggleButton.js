import React, { useId } from 'react';
import './ToggleButton.css';

const Switch = ({ width = 150, height = 60, toggleWidth = 80, toggleHeight = 50, checked = false, onChange, ...rest }) => {
  // توليد id فريد لكل زر
  const id = useId();

  const handleChange = (e) => {
    if (onChange) {
      onChange(e);
    }
  };

  const containerStyle = {
    position: 'relative',
    width: `${width}px`,
    height: `${height}px`,
    background: '#d6d6d6',
    borderRadius: '50px',
    boxShadow: 'inset -8px -8px 16px #ffffff, inset 8px 8px 16px #b0b0b0'
  };

  const toggleStyle = {
    position: 'absolute',
    width: `${toggleWidth}px`,
    height: `${toggleHeight}px`,
    background: checked ? 'linear-gradient(145deg, #cfcfcf, #a9a9a9)' : 'linear-gradient(145deg, #d9d9d9, #bfbfbf)',
    borderRadius: '50px',
    top: '5px',
    left: checked ? `${width - toggleWidth - 10}px` : '5px',
    boxShadow: checked ? '-4px -4px 8px #ffffff, 4px 4px 8px #8a8a8a' : '-4px -4px 8px #ffffff, 4px 4px 8px #b0b0b0',
    transition: 'all 0.3s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingLeft: '10px'
  };

  const ledStyle = {
    width: '10px',
    height: '10px',
    background: checked ? 'red' : 'grey',
    borderRadius: '50%',
    boxShadow: checked ? '0 0 15px 4px red' : '0 0 10px 2px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s linear'
  };

  return (
    <div className="toggle-wrapper" style={containerStyle} {...rest}>
      <input 
        className="toggle-checkbox" 
        id={id} 
        type="checkbox" 
        checked={checked}
        onChange={handleChange}
      />
      <label className="switch" htmlFor={id} style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '100%', transform: 'translateY(-50%)', borderRadius: '50px', overflow: 'hidden', cursor: 'pointer' }}>
        <div className="toggle" style={toggleStyle}>
          <div className="led" style={ledStyle}></div>
        </div>
      </label>
    </div>
  );
}

export default Switch;
