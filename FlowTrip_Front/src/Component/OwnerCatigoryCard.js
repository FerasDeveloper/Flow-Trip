import './OwnerCatigoryCard.css';

export default function OwnerCatigoryCard({ name, onClick }) {
  return (
    <div className="catigoryownerselect-card" onClick={onClick}>
      <strong>{name}</strong>
      <span>Select</span>
    </div>
  );
}
