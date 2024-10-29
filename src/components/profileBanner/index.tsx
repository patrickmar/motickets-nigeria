import { Link } from "react-router-dom";

const ProfileBanner = () => {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="my-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28 flex gap-3 lg:flex-justify lg:flex flex-col lg:flex-row">
        <div className="sm:text-center lg:text-left">
          <h1 className="text-4xl tracking-tight font-extrabold text-[#25aae1] sm:text-5xl md:text-6xl">
            Corporate Profile
          </h1>
          <p className="mt-3 text-base text-white sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
            MoTickets is not just a ticketing platform; it's a movement that
            celebrates the magic of shared experiences. Join us on this journey
            as we redefine the way people connect through events.
          </p>
          <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
            <div className="rounded-md shadow">
              <Link
                to="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-800 hover:bg-gray-600 md:py-4 md:text-lg md:px-10"
              >
                Get started
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link
                to="#"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-gray-800 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
              >
                Live demo
              </Link>
            </div>
          </div>
        </div>

        <div className="lg:inset-y-0 lg:right-0 lg:w-1/2 my-4">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://res.cloudinary.com/deluxe-bluz/image/upload/v1708430133/istockphoto-1473887939-612x612_hkdywx.jpg"
            alt="blue"
          />
        </div>
      </div>
    </section>
  );
};

export default ProfileBanner;
