import "./EvaluationSkeleton.css";

export default function EvaluationSkeleton() {
  return (
    <div className="evaluation-container">
      <h2>Get Evaluation</h2>

      {/* Skeleton Average Box */}
      <div className="average-box">
        <div className="average-item">
          <div className="skeleton skeleton-value"></div>
          <div className="skeleton skeleton-label"></div>
        </div>
        <div className="average-item">
          <div className="skeleton skeleton-value"></div>
          <div className="skeleton skeleton-label"></div>
        </div>
      </div>

      {/* Skeleton Cards */}
      <div className="cards-grid">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="evaluation-card">
            <div className="skeleton skeleton-name"></div>
            <div className="skeleton skeleton-phone"></div>
            <div className="skeleton skeleton-stars"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
