export default function FundraiserStats() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 bg-white overflow-hidden">
      <div className="w-full max-w-6xl flex flex-wrap justify-center items-center md:space-x-10 space-x-0 space-y-10 md:space-y-0 md:flex-nowrap relative z-10">
        {/* Left Side Images */}
        <div className="flex flex-col items-center space-y-6 md:w-1/3 w-full">
          <div className="relative group">
            <img
              src="https://explorerchick.com/wp-content/uploads/2023/07/Untitled-design-10.png"
              alt="VibeTribe traveler 1"
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-60 lg:h-60 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <p className="absolute bottom-2 left-2 text-white font-semibold text-sm sm:text-base md:text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-2 py-1 rounded">
              Adventurous Explorer
            </p>
          </div>
          <div className="relative group">
            <img
              src="https://foodforthepoor.org/wp-content/uploads/Natalie-in-Puerto-Escondido.jpg"
              alt="VibeTribe traveler 2"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <p className="absolute bottom-2 left-2 text-white font-semibold text-sm sm:text-base md:text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-2 py-1 rounded">
              Community Connector
            </p>
          </div>
        </div>

        {/* Center Content */}
        <div className="text-center px-6 md:w-1/3 w-full">
          <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-600">
            Join the VibeTribe and Connect With
          </h3>
          <p className="text-4xl sm:text-5xl md:text-7xl font-bold text-green-600 mt-4">
            217,924+
          </p>
          <p className="text-lg sm:text-xl md:text-2xl font-medium text-gray-600 mt-2">
            Travelers Building a Better Way to Explore
          </p>
          <button className="mt-8 px-6 py-3 sm:px-8 sm:py-4 bg-green-500 text-white text-base sm:text-lg md:text-xl font-semibold rounded-md hover:bg-green-600 transition-all">
            <a href="/CommunityCards">Explore Communities</a>
          </button>
        </div>

        {/* Right Side Images */}
        <div className="flex flex-col items-center space-y-6 md:w-1/3 w-full">
          <div className="relative group">
            <img
              src="https://www.shutterstock.com/image-photo/outdoors-navigation-concept-compass-direction-600nw-2204875879.jpg"
              alt="VibeTribe traveler 3"
              className="w-28 h-28 sm:w-36 sm:h-36 md:w-48 md:h-48 lg:w-60 lg:h-60 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <p className="absolute bottom-2 left-2 text-white font-semibold text-sm sm:text-base md:text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-2 py-1 rounded">
              Global Adventurer
            </p>
          </div>
          <div className="relative group">
            <img
              src="https://journeyable.org/wp-content/uploads/2024/07/Welcome-to-Journeyable.jpg"
              alt="VibeTribe traveler 4"
              className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover rounded-lg shadow-lg transition-transform duration-300 group-hover:scale-105"
            />
            <p className="absolute bottom-2 left-2 text-white font-semibold text-sm sm:text-base md:text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-2 py-1 rounded">
              Shared Journey Builder
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
