import { useEffect, useRef, useState } from "react";
import { countries } from "../../constant";
import { Link } from "react-router-dom";

const DropdownCountry = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  return (
    <div className="relative">
      {/* Render the button with the country's logo and name */}
      <button
        ref={trigger}
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-4"
      >
        <img
          src={`https://flagcdn.com/w320/ng.png`}
          className="h-5 w-5 rounded-full me-2"
          alt="forallevent"
        />
        <span className="hidden sm:block">Nigeria (NG)</span>
        <svg
          className={`hidden fill-current sm:block ${
            dropdownOpen ? "rotate-180" : ""
          }`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.410765 0.910734C0.736202 0.585297 1.26384 0.585297 1.58928 0.910734L6.00002 5.32148L10.4108 0.910734C10.7362 0.585297 11.2638 0.585297 11.5893 0.910734C11.9147 1.23617 11.9147 1.76381 11.5893 2.08924L6.58928 7.08924C6.26384 7.41468 5.7362 7.41468 5.41077 7.08924L0.410765 2.08924C0.0853277 1.76381 0.0853277 1.23617 0.410765 0.910734Z"
            fill=""
          />
        </svg>
      </button>

      {/* <!-- Dropdown --> */}
      <div
        ref={dropdown}
        onFocus={() => setDropdownOpen(true)}
        onBlur={() => setDropdownOpen(false)}
        className={`absolute right-0 mt-4 flex w-62.5 flex-col rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark ${
          dropdownOpen === true ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-1 border-b border-stroke py-7 dark:border-black">
          {countries.map((item, i) => (
            <li key={i}>
              <Link
                to={item.url}
                target="_blank"
                className="flex px-6 py-2 text-customBlack items-center gap-2 text-sm font-medium duration-300 ease-in-out hover:bg-red-600 hover:text-white lg:text-base"
              >
                {/* Render the country's logo and name */}
                <img
                  src={`https://flagcdn.com/w320/${item.code.toLowerCase()}.png`}
                  className="h-5 w-5 rounded-full me-2"
                  alt="country flag"
                />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {/* <!-- Dropdown End --> */}
    </div>
  );
};

export default DropdownCountry;
