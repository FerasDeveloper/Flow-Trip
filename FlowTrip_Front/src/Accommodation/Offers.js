import axios from "axios";
import { useEffect, useState } from "react";
import OwnerCard from "../Component/OwnerCard";
import OwnerCardSkeleton from "../Component/OwnerCardSkeleton";
import { useNavigate } from "react-router-dom";
import { baseURL,SHOW_OFFERS, TOKEN } from "../Api/Api";

export default function Offers() {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading,setLoading] = useState(true);
  var token =TOKEN;

  useEffect(() => {
    const getOffers = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseURL}/${SHOW_OFFERS}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOffers(res.data.offers || []);
      } catch (e) {
        console.log(e);
      }
      finally{
        setLoading(false);
      }
    };
    getOffers();
  }, []);

  if (loading) {
    return (
      <div className="owner-list-container">
        {Array.from({ length: 6 }).map((_, index) => (
          <OwnerCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="owner-list-container">
      {offers.length === 0 ? (
        <div>No offers found.</div>
      ) : (
        offers.map((offer) => (
          <OwnerCard
            key={offer.id}
            name={`Room #${offer.id}`}
            location={`${offer.area} m²`}
            phoneNumber={`$${offer.price}`}
            category={`$${offer.offer_price}`}
            isUserView={false}
            onClick={() => navigate(`/room-details/${offer.id}`)}
          />
        ))
      )}
    </div>
  );
}
