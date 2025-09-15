import React from "react";
import { useParams } from "react-router-dom";
import OwnerDetailsComponent from "../Component/OwnerDetailsComponent";
import { TOKEN } from "../Api/Api";

export default function OwnerDetails() {
  const { id } = useParams();
  const token =  TOKEN;
  
  return <OwnerDetailsComponent id={id} isAdmin={true} readOnly={false}/>;
}