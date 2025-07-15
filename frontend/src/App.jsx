import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Components/Login";
import Signup from "./Components/SignUp";
import CreateCommunity from "./Components/CreateCommunity";
import CommunityCards from "./Components/CommunityCards";
import InerCard from "./Components/InerCard";
import DonationPage from "./Components/DonationPage";
import HowItWorks from "./Components/HowItWorks";
import AboutUs from "./Components/AboutUs";
import Favorites from "./Components/Favorites";
import Profile from "./Components/Profile";
import ScrollToTop from "./Components/ScrollToTop";
import CommunityDetailPage from "./Components/CommunityDetailPage";
import "./App.css";
import EscrowTripPage from "./Components/EscrowTripPage";
import CCTSSwap from "./Components/CCTSSwap";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen">
        {" "}
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/CommunityCards" element={<CommunityCards />} />
          <Route path="/CreateCommunity" element={<CreateCommunity />} />
          <Route path="/InerCard" element={<InerCard />} />
          <Route path="/community/:id" element={<CommunityDetailPage />} />
          <Route path="/" element={<Home />} />
          <Route path="/DonationPage" element={<DonationPage />} />
          <Route path="/HowItWorks" element={<HowItWorks />} />
          <Route path="/AboutUs" element={<AboutUs />} />
          <Route path="/Favorites" element={<Favorites />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/escrowPay" element={<EscrowTripPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ccts-swap" element={<CCTSSwap />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
