import { Link } from "react-router-dom";
import CorporateBanner from "../../components/corporateBanner";

const Philosophy = () => {
  return (
    <div className="">
      <div>
        <CorporateBanner />
      </div>
      {/* End of Bannee */}
      <h1 className=" flex justify-center text-4xl text-[#25aae1]">
        Core Values
      </h1>
      <div className="relative overflow-hidden bg-gray-900 pt-16 pb-32 space-y-24">
        <div className="relative">
          <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8 ">
            <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0 ">
              <div>
                <div className="mt-6">
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Innovation:
                  </h2>
                  <p className="mt-4 text-lg text-gray-300">
                    We embrace innovation to redefine the ticketing experience,
                    introducing cutting-edge solutions that simplify the process
                    for both organizers and attendees.
                  </p>
                  <div className="mt-6">
                    <Link
                      className="inline-flex rounded-lg bg-[#25aae1] px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-[#25aae1] hover:bg-blue-400 hover:ring-blue-400"
                      to="/contact"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0">
              <div className="-mr-48 pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                <img
                  loading="lazy"
                  width="647"
                  height="486"
                  className="w-full rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none"
                  style={{ color: "transparent" }}
                  src="https://images.unsplash.com/photo-1569144157591-c60f3f82f137"
                  alt="blue"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8 ">
            <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0 lg:col-start-2">
              <div>
                <div className="mt-6">
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Accessibility:
                  </h2>
                  <p className="mt-4 text-lg text-gray-300">
                    We are committed to making events accessible to everyone.
                    Our platform ensures inclusivity, allowing diverse audiences
                    to participate in a wide array of experiences.
                  </p>
                  <div className="mt-6">
                    <Link
                      className="inline-flex rounded-lg bg-[#25aae1] px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-[#25aae1] hover:bg-blue-400 hover:ring-blue-400"
                      to="/login"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0">
              <div className="-ml-48 pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                <img
                  alt="Inbox user interface"
                  loading="lazy"
                  width="647"
                  height="486"
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                  style={{ color: "transparent" }}
                  src="https://images.unsplash.com/photo-1599134842279-fe807d23316e"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8 ">
            <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0 ">
              <div>
                <div className="mt-6">
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Reliability:
                  </h2>
                  <p className="mt-4 text-lg text-gray-300">
                    Trust is the foundation of our service. We prioritize
                    reliability in every aspect, from secure transactions to
                    accurate ticketing information.
                  </p>
                  <div className="mt-6">
                    <Link
                      className="inline-flex rounded-lg bg-[#25aae1] px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-[#25aae1] hover:bg-blue-400 hover:ring-blue-400"
                      to="/login"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0">
              <div className="-mr-48 pl-6 md:-mr-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                <img
                  alt="bluz"
                  loading="lazy"
                  width="646"
                  height="485"
                  className="w-full rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 lg:absolute lg:left-0 lg:h-full lg:w-auto lg:max-w-none transparent"
                  style={{ color: "transparent" }}
                  src="https://images.unsplash.com/photo-1483478550801-ceba5fe50e8e"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="lg:mx-auto lg:grid lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-2 lg:gap-24 lg:px-8 ">
            <div className="mx-auto max-w-xl px-6 lg:mx-0 lg:max-w-none lg:py-16 lg:px-0 lg:col-start-2">
              <div>
                <div className="mt-6">
                  <h2 className="text-3xl font-bold tracking-tight text-white">
                    Community:
                  </h2>
                  <p className="mt-4 text-lg text-gray-300">
                    MoTickets is more than a platform; it's a community. We
                    foster connections, bringing people together through a
                    shared passion for events and live experiences.
                  </p>
                  <div className="mt-6">
                    <Link
                      className="inline-flex rounded-lg bg-[#25aae1] px-4 py-1.5 text-base font-semibold leading-7 text-white shadow-sm ring-1 ring-[#25aae1] hover:bg-blue-400 hover:ring-blue-400"
                      to="/login"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12 sm:mt-16 lg:mt-0">
              <div className="-ml-48 pr-6 md:-ml-16 lg:relative lg:m-0 lg:h-full lg:px-0">
                <img
                  alt="Inbox user interface"
                  loading="lazy"
                  width="647"
                  height="486"
                  className="w-full rounded-xl shadow-xl ring-1 ring-black ring-opacity-5 lg:absolute lg:right-0 lg:h-full lg:w-auto lg:max-w-none"
                  style={{ color: "transparent" }}
                  src="https://images.unsplash.com/photo-1599134842279-fe807d23316e"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Philosophy;
