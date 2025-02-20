import React, { useState } from "react";
import DonationPage from "./DonationPage";
import { ChevronLeft, ChevronRight } from "lucide-react"; // For icons

const CommunityPage = () => {
  const images = [
    "https://media.istockphoto.com/id/510978989/photo/hawa-mahal-palace-in-jaipur-rajasthan.jpg?s=612x612&w=0&k=20&c=-2ijZ9kpofMH1jJhaxFF1hJ5oqjdXfOtIu0BlwXwdls=",
    "https://media-cdn.tripadvisor.com/media/photo-s/09/32/7a/e7/jaipur.jpg",
    "https://static.toiimg.com/photo/107164723.cms",
    "https://media.gettyimages.com/id/2078643682/video/aerial-view-of-surrounding-wall-in-jaipur-and-amber.jpg?s=640x640&k=20&c=J0OXhcq783p5l6x5zwEvHX0QIRjV30oYdhMV6HFRaDQ=",
    "https://www.abhibus.com/blog/wp-content/uploads/2023/06/Top-10-Places-to-Visit-in-Jaipur-How-to-Reach-Best-Time-Tourist-Attractions.jpg",
  ];

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const changeImage = (next) => {
    if (animating) return; // Prevent rapid clicks
    setAnimating(true);
    setDirection(next);

    setTimeout(() => {
      setIndex((prevIndex) =>
        next === 1
          ? (prevIndex + 1) % images.length
          : (prevIndex - 1 + images.length) % images.length
      );
      setAnimating(false);
    }, 500); // Animation duration
  };

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const newMessage = {
        text: messageInput.trim(),
        time: new Date().toLocaleTimeString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessageInput("");
    }
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6 gap-6">
      {/* Image Carousel */}
      <div className="relative flex justify-center items-center w-full max-w-7xl h-[450px] overflow-hidden">
        {/* Left Arrow */}
        <button
          onClick={() => changeImage(-1)}
          className="absolute left-5 z-30 bg-black/30 p-3 rounded-full hover:bg-black/50 transition"
        >
          <ChevronLeft className="text-white w-8 h-8" />
        </button>

        <div className="flex w-full h-full justify-center items-center relative">
          {/* Left Image */}
          <img
            src={images[(index + images.length - 1) % images.length]}
            alt="Previous"
            className={`absolute left-0 w-1/3 h-full object-cover transition-transform duration-500 opacity-70 transform scale-95 ${
              animating && direction === -1
                ? "translate-x-full"
                : "-translate-x-32"
            }`}
          />

          {/* Center (Big) Image */}
          <img
            src={images[index]}
            alt="Current"
            className={`w-2/3 h-full object-cover rounded-2xl shadow-2xl transition-transform duration-500 transform scale-110 absolute z-20 ${
              animating
                ? direction === 1
                  ? "-translate-x-full"
                  : "translate-x-full"
                : "translate-x-0"
            }`}
          />

          {/* Right Image */}
          <img
            src={images[(index + 1) % images.length]}
            alt="Next"
            className={`absolute right-0 w-1/3 h-full object-cover transition-transform duration-500 opacity-70 transform scale-95 ${
              animating && direction === 1
                ? "-translate-x-full"
                : "translate-x-32"
            }`}
          />
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => changeImage(1)}
          className="absolute right-5 z-30 bg-black/30 p-3 rounded-full hover:bg-black/50 transition"
        >
          <ChevronRight className="text-white w-8 h-8" />
        </button>
      </div>

      {/* Chat & Payments Section */}
      <div className="flex flex-col md:flex-row w-full max-w-7xl gap-6 mx-auto">
        {/* Chat Section */}
        <div className="w-full md:w-[65vw] p-6 bg-white rounded-3xl shadow-lg">
          <div className="container mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-500 text-white p-4 rounded-t-3xl shadow-xl">
              <div className="flex items-center">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4WdhdzVmMpbLBtUoewasFi-1BMvFDZ0tkQA&s"
                  alt="User"
                  className="w-14 h-14 rounded-full border-4 border-white shadow-lg mr-4"
                />
                <div>
                  <p className="font-semibold text-xl">Community Chat</p>
                  <span className="text-sm text-green-200">🟢 Online</span>
                </div>
              </div>
              <button className="text-white text-lg opacity-80 hover:opacity-100 transition">
                <i className="bi bi-three-dots-vertical"></i>
              </button>
            </div>

            {/* Message Container (Fixed Height & Scrollable) */}
            <div className="bg-gray-50 border-b border-gray-300 rounded-b-3xl p-4 h-[300px] overflow-y-auto space-y-4 flex flex-col">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-3 rounded-lg shadow-md max-w-[70%] ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p className="text-lg">{msg.text}</p>
                    <span className="block text-gray-400 text-xs mt-2 flex justify-between">
                      {msg.time}
                      {msg.sender === "user" && (
                        <i className="bi bi-check2-all text-blue-300 ml-2"></i>
                      )}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input and Send Button */}
            <div className="flex items-center border-t border-gray-300 p-4 bg-gray-100 rounded-b-3xl">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Write a message..."
                className="flex-1 rounded-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-sm transition duration-300 ease-in-out bg-white"
              />
              <button
                onClick={sendMessage}
                className="ml-3 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-center"
              >
                <i className="bi bi-send text-xl"></i> {/* Proper Send Icon */}
              </button>
            </div>
          </div>
        </div>

        {/* Payments section (Fixed Height) */}
        <div className="w-full md:w-[30vw] p-8 bg-white rounded-3xl shadow-lg mx-4 mt-4 md:mt-0 h-[450px] flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Trip Details
            </h2>
            <h5 className="text-xl text-gray-700 mb-2">Trip to Manali</h5>
            <p className="text-gray-600">No. of Places: 2</p>
            <ul className="text-gray-600 list-disc pl-6 mb-4">
              <li>Rohtang Pass</li>
              <li>Solang Valley</li>
            </ul>
            <p className="text-gray-600">Total Price: 5 DOJ</p>
          </div>
          <button className="bg-teal-500 text-white py-3 px-8 rounded-lg w-full transition-all duration-200 hover:bg-teal-600 focus:outline-none">
            <a href="/DonationPage">Proceed to Payment</a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
