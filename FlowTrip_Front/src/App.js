// import { Route, Routes } from "react-router-dom";
// import Auth from "./Auth/Auth";
// import DashBourd from "./Admin/DashBourd";

// // import OwnerRigester from "./Auth/OwnerRigester";
// import Packages from "./Admin/Packages";
// import PackageDetails from "./Component/PackageDetails";
// import Requist from "./Admin/Requist";
// import RequestDetails from "./Component/RequistDetails";
// import Owner from "./Admin/Owner";
// import PackageElementDetails from "./Component/PackageElementDetails";
// import Category from "./Admin/Category";
// import Activity from "./Admin/Activity";
// import SelectCountry from "./Auth/SelectCountry";
// import CreateOwnerStep3 from "./Auth/CreateOwnerStep3";
// import Verification from "./Auth/Verification";
// import OwnerCategoryList from "./Auth/OwnerCategoryList";
// import OwnerDetails from "./Admin/OwnerDetails";
// // import RoomDetails from "./Admin/RoomDetails";
// import Vehiclys from "./VehiclyOwner/Vehiclys";
// import VehicleDetails from "./Component/VehicleDetails";
// import CreateVehicle from "./VehiclyOwner/CreateVehicle";
// import AddVehicleImages from "./VehiclyOwner/AddVehicleImages";
// import Tourism_company_DashBoard from "./Tourism Company/Tourism_company_DashBoard";
// import PackagesTourism from "./Tourism Company/Packages";
// import AddPackageElement from "./Component/AddPackageElement";
// import AddPackageStep1 from "./Tourism Company/AddPackageStep1";
// import TourismRecords from "./Tourism Company/TourismRecords";
// import PackageRecords from "./Tourism Company/PackageRecords";
// import FlightSearch from "./User/FlightSearch";
// import FlightDetails from "./User/FlightDetails";
// import FlightsList from "./User/FlightsList";
// import ChatBot from "./User/ChatBot";
// import TripForm from "./User/TripForm";

// import RoomDetails from "./Accommodation/RoomDetails";
// import DashBoard2 from "./Accommodation/Dashboard";
// import Profile from "./Accommodation/Profile";
// import ShowRecords from "./Accommodation/ShowRecords";
// import Offers from "./Accommodation/Offers";
// import RoomsHome from "./Accommodation/RoomsHome";
// import SubAdmin from "./Admin/SubAdmin";
// import Users from "./Admin/Users";
// import AddRoom from "./Accommodation/AddRoom";
// import Advanced from "./Accommodation/Advanced";
// import Plans from "./Airline/plans";
// import ShowAllPlans from "./Airline/Showallplans";
// import PlanDetails from "./Airline/planditels";
// import EditPlane from "./Airline/editplane";
// import AddPlane from "./Airline/AddPlane";
// import GetEvaluation from "./Airline/GetEvaluation";
// import UserDashboard from "./User/UserDashboard";
// import AccommodationFilter from "./User/AccommodationFilter";
// import AccommodationPreview from "./User/AccommodationPreview";

// import DashBoardVehiclyOwner from "./VehiclyOwner/DashBoardVehiclyOwner";
// import TripSummary from "./User/TripSummary";
// import ActivityFilter from "./User/AcitvityFilter";
// import VerificationPassword from "./Auth/VerificationPassword";
// import Homepage from "./User/HomePage";
// // <<<<<<< HEAD
// import DashboardLayout from "./Component/DashboardLayout";
// import NotRegistered from "./Component/NotRegistered";

// // =======
// import CarFilter from "./User/CarFilter";
// import AllAcyivit from "./User/AllActivity";
// // >>>>>>> 8f6c837c3ba972d6555ab9b4fc3df5ae422b7eca
// function App() {
//   return (
//     <Routes>
//       <Route path="register" element={<Auth />} />
//       <Route path="auth" element={<Auth />} />
//       <Route path="verification" element={<Verification />} />
//       <Route path="verificationpassword" element={<VerificationPassword/>}/>
//       <Route path="/create-owner/step-1" element={<OwnerCategoryList />} />
//       <Route path="/create-owner/step-2" element={<SelectCountry />} />
//       <Route path="/create-owner/step-3" element={<CreateOwnerStep3 />} />

//       {/* Admin */}
//       <Route>
//         {/* <Route path="ownerrigester" element={<OwnerRigester />} /> */}
//         <Route path="plans" element={<Plans />}>
//           <Route path="showallplans" element={<ShowAllPlans />} />
//           <Route path="showallplans/:planeId" element={<PlanDetails />} />
//           <Route path="/plans/edit/:planeId" element={<EditPlane />} />
//           <Route path="/plans/add" element={<AddPlane />} />
//           <Route path="getevaluation" element={<GetEvaluation />} />
//         </Route>
//         <Route>
//           <Route path="Admin/dashboard" element={<DashBourd />}>
//             <Route path="requist" element={<Requist />} />
//             <Route path="packages" element={<Packages />} />
//             <Route path="owners" element={<Owner />} />
//             <Route path="subadmin" element={<SubAdmin />} />
//             <Route path="users" element={<Users />} />
//             <Route path="catigory" element={<Category />} />
//             <Route path="activity" element={<Activity />} />
//           </Route>
//           <Route path="/package/:id" element={<PackageDetails />} />
//           <Route path="/request/:id" element={<RequestDetails />} />
//           <Route path="/element-details/:id" element={<PackageElementDetails />} />
//           <Route path="/owner_details/:id" element={<OwnerDetails />} />
//         </Route>
//         {/* Accommodation */}
//         <Route path="Accommodation/dashboard" element={<DashBoard2 />}>
//           <Route path="profile" element={<Profile />} />
//           <Route path="records" element={<ShowRecords />} />
//           <Route path="rooms" element={<RoomsHome />} />
//           <Route path="offers" element={<Offers />} />
//           <Route path="advanced" element={<Advanced />} />
//         </Route>
//         <Route path="room-details/:id" element={<RoomDetails />} />
//         <Route path="add-room" element={<AddRoom />} />
//         <Route path="catigory" element={<Category />} />
//       </Route>

//       {/* Vehicly Owner */}
//       <Route path="VehiclyOwner/dashboard" element={<DashBoardVehiclyOwner />}>
//         <Route path="vehiclys" element={<Vehiclys />} />
//       </Route>
//       <Route path="/vehicle/:id" element={<VehicleDetails />} />
//       <Route path="/create-vehicle" element={<CreateVehicle />} />
//       <Route path="/vehicle/add-images/:id" element={<AddVehicleImages />} />

//       {/* Tourism company */}
//       <Route
//         path="TourismCompany/dashboard"
//         element={<Tourism_company_DashBoard />}
//       >
//         <Route path="packages" element={<PackagesTourism />} />
//         <Route path="records" element={<TourismRecords />} />
//         <Route path="records/:id" element={<PackageRecords />} />
//       </Route>
//       <Route path="/add-package-element/:id" element={<AddPackageElement/>}/>
//       <Route path="/add-package/step1" element={<AddPackageStep1 />} />

//       {/* User */}
//       <Route path="/flight-search" element={<FlightSearch />} />
//       <Route path="/flight-details" element={<FlightDetails />} />
//       <Route path="/flights-list" element={<FlightsList />} />
//       <Route path="/chatBot" element={<ChatBot/>}/>
//       <Route path="/trip" element={<TripForm/>}/>
//       <Route path="/summary" element={<TripSummary />} />
//       <Route path="/" element={<Homepage/>} />
//       <Route path="/packages" element={<Packages />} />
//       <Route path="/All-Activity" element={<AllAcyivit />} />
//       <Route path="accommodation-filter" element={<AccommodationFilter />} />
//       <Route path="car-filter" element={<CarFilter />} />

//       {/* User */}
//       <Route path="User" element={<UserDashboard />}>
//         <Route path="accommodation-filter" element={<AccommodationFilter />} />
//         <Route path="activity-filter" element={<ActivityFilter />} />
//       </Route>
//       <Route path="accommodation-preview/:id" element={<AccommodationPreview />} />
//       <Route path="not-registered" element={<NotRegistered />} />

//       <Route
//         path="accommodation-preview/:id"
//         element={<AccommodationPreview />}
//       />

//       <Route path="/package/:id" element={<PackageDetails />} />
//       <Route path="/request/:id" element={<RequestDetails />} />
//       {/* <Route path="/element-details" element={<PackageElementDetails />} /> */}
//     </Routes>
//   );
// }

// export default App;

import { Route, Routes, useNavigate } from "react-router-dom";
import Auth from "./Auth/Auth";
// import DashboardLayout from "./Layout/DashboardLayout";

import Packages from "./Admin/Packages";
import PackageDetails from "./Component/PackageDetails";
import Requist from "./Admin/Requist";
import RequestDetails from "./Component/RequistDetails";
import Owner from "./Admin/Owner";
import PackageElementDetails from "./Component/PackageElementDetails";
import Category from "./Admin/Category";
import Activity from "./Admin/Activity";
import SelectCountry from "./Auth/SelectCountry";
import CreateOwnerStep3 from "./Auth/CreateOwnerStep3";
import Verification from "./Auth/Verification";
import OwnerCategoryList from "./Auth/OwnerCategoryList";
import OwnerDetails from "./Admin/OwnerDetails";
import Vehiclys from "./VehiclyOwner/Vehiclys";
import VehicleDetails from "./Component/VehicleDetails";
import CreateVehicle from "./VehiclyOwner/CreateVehicle";
import AddVehicleImages from "./VehiclyOwner/AddVehicleImages";
import PackagesTourism from "./Tourism Company/Packages";
import AddPackageElement from "./Component/AddPackageElement";
import AddPackageStep1 from "./Tourism Company/AddPackageStep1";
import TourismRecords from "./Tourism Company/TourismRecords";
import PackageRecords from "./Tourism Company/PackageRecords";
import FlightSearch from "./User/FlightSearch";
import UserFlightDetails from "./User/FlightDetails";
import FlightsList from "./User/FlightsList";
import ChatBot from "./User/ChatBot";
import TripForm from "./User/TripForm";
import RoomDetails from "./Accommodation/RoomDetails";
import Profile from "./Accommodation/Profile";
import ShowRecords from "./Accommodation/ShowRecords";
import Offers from "./Accommodation/Offers";
import RoomsHome from "./Accommodation/RoomsHome";
import SubAdmin from "./Admin/SubAdmin";
import Users from "./Admin/Users";
import AddRoom from "./Accommodation/AddRoom";
import AirlineDashboard from "./Airline/AirlineDashboard";
import ViewFlights from "./Airline/ViewFlights";
import AddFlight from "./Airline/AddFlight";
import EditSeatsPrice from "./Airline/EditSeatsPrice";
import FlightDetails from "./Airline/FlightDetails";
import EditFlight from "./Airline/EditFlight";
import Advanced from "./Accommodation/Advanced";
import ShowAllPlans from "./Airline/Showallplans";
import PlanDetails from "./Airline/planditels";
import EditPlane from "./Airline/editplane";
import AddPlane from "./Airline/AddPlane";
import Records from "./Airline/Records";
import GetEvaluation from "./Airline/GetEvaluation";
import UserDashboard from "./User/UserDashboard";
import AccommodationFilter from "./User/AccommodationFilter";
import AccommodationPreview from "./User/AccommodationPreview";
import TripSummary from "./User/TripSummary";
import FlightReservation from "./Airline/FlightReservation";
import ActivityFilter from "./User/AcitvityFilter";
import VerificationPassword from "./Auth/VerificationPassword";
import UserFlightInformation from "./User/UserFlightInformation";
import Homepage from "./User/HomePage";
import Notifications from "./User/Notifications";
import DashboardLayout from "./Component/DashboardLayout";
import AllAcyivit from "./User/AllActivity";
import CarFilter from "./User/CarFilter";
import NotRegistered from "./Component/NotRegistered";
import AboutUs from "./User/AboutUs";
import Bookings from "./User/Boocking";
import { USERID } from "./Api/Api";
import echo from "./echo";
import { toast } from "react-toastify";
import { useEffect } from "react";
import OwnerProfile from "./User/OwnerProfile";
import ActivityOwner from "./User/ActivityOwner";

function App() {
  const navigate = useNavigate();

  const userId = USERID;
  useEffect(() => {
    if (!userId) return;

    const channel = echo.private(`user.${userId}`);
    channel.listen(".notification.sent", (e) => {
      const truncatedMessage =
        e.message.length > 60 ? e.message.slice(0, 60) + "..." : e.message;

      toast.info(truncatedMessage, {
        onClick: () => {
          localStorage.setItem("bookingClicked", "true");
          navigate("/notifications");
        },
        style: { cursor: "pointer" },
      });
    });

    return () => {
      echo.leave(`user.${userId}`);
    };
  }, [userId]);

  return (
    <Routes>
      <Route path="register" element={<Auth />} />
      <Route path="verification" element={<Verification />} />
      <Route path="verificationpassword" element={<VerificationPassword />} />
      <Route path="/create-owner/step-1" element={<OwnerCategoryList />} />
      <Route path="/create-owner/step-2" element={<SelectCountry />} />
      <Route path="/create-owner/step-3" element={<CreateOwnerStep3 />} />

      {/* Admin */}
      <Route path="Admin/dashboard" element={<DashboardLayout role="admin" />}>
        <Route path="requist" element={<Requist />} />
        <Route path="packages" element={<Packages />} />
        <Route path="owners" element={<Owner />} />
        <Route path="subadmin" element={<SubAdmin />} />
        <Route path="users" element={<Users />} />
        <Route path="catigory" element={<Category />} />
        <Route path="activity" element={<Activity />} />
      </Route>
      <Route path="/package/:id" element={<PackageDetails />} />
      <Route path="/request/:id" element={<RequestDetails />} />
      <Route path="/element-details/:id" element={<PackageElementDetails />} />
      <Route path="/owner_details/:id" element={<OwnerDetails />} />

      {/* Accommodation */}
      <Route
        path="Accommodation/dashboard"
        element={<DashboardLayout role="Accommodation" />}
      >
        <Route path="profile" element={<Profile />} />
        <Route path="records" element={<ShowRecords />} />
        <Route path="rooms" element={<RoomsHome />} />
        <Route path="offers" element={<Offers />} />
        <Route path="advanced" element={<Advanced />} />
        <Route path="Evaluation" element={<GetEvaluation />} />
      </Route>
      <Route path="room-details/:id" element={<RoomDetails />} />
      <Route path="add-room" element={<AddRoom />} />

      {/* Vehicly Owner */}
      <Route
        path="VehicleOwner/dashboard"
        element={<DashboardLayout role="Vehicle Owner" />}
      >
        <Route path="vehiclys" element={<Vehiclys />} />
        <Route path="profile" element={<Profile />} />
        <Route path="Evaluation" element={<GetEvaluation />} />
      </Route>
      <Route path="/vehicle/:id" element={<VehicleDetails />} />
      <Route path="/create-vehicle" element={<CreateVehicle />} />
      <Route path="/vehicle/add-images/:id" element={<AddVehicleImages />} />

      {/* Tourism company */}
      <Route
        path="TourismCompany/dashboard"
        element={<DashboardLayout role="Tourism Company" />}
      >
        <Route path="packages" element={<PackagesTourism />} />
        <Route path="records" element={<TourismRecords />} />
        <Route path="records/:id" element={<PackageRecords />} />
        <Route path="profile" element={<Profile />} />
        <Route path="Evaluation" element={<GetEvaluation />} />
        <Route path="profile" element={<Profile />} />
      </Route>
      <Route path="/add-package-element/:id" element={<AddPackageElement />} />
      <Route path="/add-package/step1" element={<AddPackageStep1 />} />

      {/* Airlines */}
      <Route>
        <Route
          path="Airline/dashboard"
          element={<DashboardLayout role={"Airline"} />}
        >
          <Route path="flights" element={<ViewFlights />} />
          <Route path="records" element={<Records />} />
          <Route path="showallplans" element={<ShowAllPlans />} />
          <Route path="getevaluation" element={<GetEvaluation />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="showallplans/:planeId" element={<PlanDetails />} />
        <Route path="/editPlane/:planeId" element={<EditPlane />} />
        <Route path="/addFlight" element={<AddFlight />} />
        <Route path="/editSeats" element={<EditSeatsPrice />} />
        <Route path="/flight/:id" element={<FlightDetails />} />
        <Route path="/editFlight" element={<EditFlight />} />
        <Route path="/flightReservation/:id" element={<FlightReservation />} />
      </Route>
      {/* Activity */}
      <Route
        path="Activity/dashboard"
        element={<DashboardLayout role={"Activity"} />}
      >
        <Route path="profile" element={<Profile />} />
      </Route>
      {/* User */}
      <Route path="/flight-search" element={<FlightSearch />} />
      <Route path="/flight-details" element={<UserFlightDetails />} />
      <Route path="/flights-list" element={<FlightsList />} />
      <Route
        path="/flight-information/:id"
        element={<UserFlightInformation />}
      />
      <Route path="/owner_profile/:id" element={<OwnerProfile />} />
      <Route path="/activity_profile/:id" element={<ActivityOwner />} />
      <Route path="/notifications" element={<Notifications />} />
      <Route path="/chatBot" element={<ChatBot />} />
      <Route path="/trip" element={<TripForm />} />
      <Route path="/summary" element={<TripSummary />} />
      <Route path="/" element={<Homepage />} />
      {/* <Route path="User" element={<UserDashboard />}> */}
      <Route path="accommodation-filter" element={<AccommodationFilter />} />
      <Route path="activity-filter" element={<ActivityFilter />} />
      <Route
        path="accommodation-preview/:id"
        element={<AccommodationPreview />}
      />
      <Route path="/packages" element={<Packages />} />
      <Route path="/All-Activity" element={<ActivityFilter />} />
      <Route path="car-filter" element={<CarFilter />} />
      <Route path="not-registered" element={<NotRegistered />} />
      <Route path="about-us" element={<AboutUs />} />
      <Route path="boocking" element={<Bookings />} />
      <Route path="/ActivityOwner/profile" element={<Profile/>}/>
    </Routes>
  );
}

export default App;

// VehiclyOwner/dashboard/vehiclys
// VehicleOwner/dashboard/Evaluation
