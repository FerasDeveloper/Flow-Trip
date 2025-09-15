import { TOKEN } from "../Api/Api";
import OwnerDetailsComponent from "../Component/OwnerDetailsComponent";

export default function Profile() {
  const token = TOKEN
  
  return <OwnerDetailsComponent isAdmin={false} readOnly={false} />;
} 