import './LoadingSpinner.css';

export const LoadingSpinner = ({ size = 'medium', centered = true }) => {
  return (
    <div className={`spinner-container ${centered ? 'centered' : ''}`}>
      <div className={`spinner spinner-${size}`}></div>
    </div>
  );
};
