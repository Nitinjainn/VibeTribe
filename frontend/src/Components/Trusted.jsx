export default function Example() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-lg font-semibold text-gray-900">
          Trusted by the world’s most innovative teams
        </h2>
        <div className="mx-auto mt-10 flex flex-wrap justify-center gap-x-8 gap-y-10 sm:gap-x-10">
          <div className="flex justify-center w-full sm:w-auto">
            <img
              alt="MakeMyTrip"
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Makemytrip_logo.svg/2560px-Makemytrip_logo.svg.png"
              width={158}
              height={48}
              className="max-h-12 w-full object-contain"
            />
          </div>
          <div className="flex justify-center w-full sm:w-auto">
            <img
              alt="Trivago"
              src="https://logos-world.net/wp-content/uploads/2022/07/Trivago-Logo.png"
              width={158}
              height={48}
              className="max-h-12 w-full object-contain"
            />
          </div>
          <div className="flex justify-center w-full sm:w-auto">
            <img
              alt="MetaMask"
              src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg"
              width={158}
              height={48}
              className="max-h-12 w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
