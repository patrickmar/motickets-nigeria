// import billboard from "../../assets/images/billboard.jpg";
import moroccobanner from "../../assets/images/moroccobanner.jpeg";

const BannerBill = () => {
  return (
    <div>
      <div
        className="w-full bg-cover bg-center"
        style={{
          height: "44rem",
          backgroundImage: `url(${moroccobanner})`, // Use the imported image
          // "url(https://images.unsplash.com/photo-1504384308090-c894fdcc538d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80)",
        }}
      >
        <div className="flex items-center justify-center h-full w-full bg-gray-900 bg-opacity-50">
          <div className="text-center">
            {/* <h1 className="text-white text-2xl font-semibold uppercase md:text-3xl">
              Build Your new{" "}
              <span className="underline text-blue-400">Saas</span>
            </h1>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm uppercase font-medium rounded hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
              Start project
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerBill;
