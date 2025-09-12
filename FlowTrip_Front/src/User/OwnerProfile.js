import React from "react";
import { useParams } from "react-router-dom";
import OwnerDetailsComponent from "../Component/OwnerDetailsComponent";
import { TOKEN } from "../Api/Api";

export default function OwnerProfile() {
  const { id } = useParams();
  const token = TOKEN;

  return <OwnerDetailsComponent id={id} isAdmin={false} readOnly={true}  />;
}
