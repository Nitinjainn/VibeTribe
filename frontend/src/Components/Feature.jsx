import { FaCheckCircle } from "react-icons/fa";

const campaigns = [
  {
    id: 1,
    org: 'Enjoy At your fullest',
    name: '"VibeTribe" gives a lively & energetic vibe',
    imageSrc: 'https://img.freepik.com/premium-photo/happy-tourist-having-fun-enjoying-group-camel-ride-tour-desert_220770-30947.jpg?w=360',
    imageAlt: 'Environmental campaign for sustainability',
  },
  {
    id: 2,
    org: 'Travel Smart Travel Safe ',
    name: 'Powered by Fellow Traveler Feedback.',
    imageSrc: 'https://static.wixstatic.com/media/8859a2_38b45e00be994b32afb1fd3001f8604f~mv2.jpeg/v1/fill/w_640,h_856,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/8859a2_38b45e00be994b32afb1fd3001f8604f~mv2.jpeg',
    imageAlt: 'Healthcare support for senior citizens',
  },
  {
    id: 3,
    org: 'Join Like-Minded Adventurers',
    name: 'Effortless Payments, Unique Experiences, Instant Connections!',
    imageSrc: 'https://img.freepik.com/premium-photo/friends-taking-selfie-winter-time-ai-generated_145713-11960.jpg',
    imageAlt: 'Disaster relief support campaign',
  },
  // More campaigns...
];

export default function CampaignList() {
  return (
    <div className="bg-white py-16">
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12">
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 text-center">Fuel the Journey!</h2>
<p className="mt-2 text-lg text-gray-600 text-center">
   Be a part of something extraordinary! <span className="font-semibold">Act NOW</span> to uplift explorers and empower global communities. Together, let’s make every moment count!
</p>


        <div className="mt-10 grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="group relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200">
              <div className="aspect-w-3 aspect-h-2">
                <img
                  src={campaign.imageSrc}
                  alt={campaign.imageAlt}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-2">
                  <FaCheckCircle className="text-blue-500 text-sm" />
                  <span className="text-sm font-semibold text-gray-500">{campaign.org}</span>
                </div>
                <h3 className="mt-3 text-lg font-semibold text-gray-800">{campaign.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
