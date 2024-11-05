import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from 'emailjs-com';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';

const ContactUs = () => {
  const form = useRef<HTMLFormElement>(null); // Initialize as null
  const [isCaptchaVerified, setIsCaptchaVerified] = useState<boolean>(false);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isCaptchaVerified) {
      toast.error('Please verify that you are not a robot.');
      return;
    }

    if (!form.current) return;

    // Email validation regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Accessing user's email input value
    const userEmail = form.current.user_email.value;

    // Checking if the entered email matches the email pattern
    if (!emailPattern.test(userEmail)) {
      // Display error toast if email is not valid
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      const response = await emailjs.sendForm(
        'service_nn4ceuv',
        'template_3hmj172',
        form.current,
        'ECfFboSu0y_L9md9N' // Replace with your actual EmailJS user ID
      );

      console.log('SUCCESS!', response);
      toast.success('Message sent successfully');

      // Resetting the form fields after successful sending
      form.current.reset();
    } catch (error) {
      console.error('FAILED...', error);
      toast.error('Failed to send message');
    }
  };
  const handleCaptchaChange = (value: string | null) => {
    if (value) {
      setIsCaptchaVerified(true);
    } else {
      setIsCaptchaVerified(false);
    }
  };

  return (
    <section className=" bg-[#e0e4eb]">
      <ToastContainer />
      <div className="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2 ">
        <form
          ref={form}
          onSubmit={sendEmail}
          className="px-6 pb-24 pt-20 sm:pb-32 lg:px-8 lg:py-32 bg-[#04152d]"
        >
          <div className="mx-auto max-w-xl lg:mr-0 lg:max-w-lg">
            <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold leading-6 text-white"
                >
                  Name
                </label>
                <div className="mt-2.5">
                  <input
                    type="name"
                    id="name"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="user_name"
                    onChange={(e) => e.target.name}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold leading-6 text-white"
                >
                  Email
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    id="email"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="user_email"
                    onChange={(e) => e.target.name}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="number"
                  className="block text-sm font-semibold leading-6 text-white"
                >
                  Phone Number
                </label>
                <div className="mt-2.5">
                  <input
                    type="number"
                    id="user_phone"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="user_phone"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="todo"
                  className="block text-sm font-semibold leading-6 text-white"
                >
                  What would you like to discuss?
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    id="user_reason"
                    className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="user_reason"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold leading-6 text-white"
                >
                  Message
                </label>
                <div className="mt-2.5">
                  <textarea
                    cols={30}
                    rows={6}
                    id="message"
                    className="block w-full rounded-lg border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    name="message"
                    onChange={(e) => e.target.name}
                  ></textarea>
                </div>
              </div>
            </div>
            <ReCAPTCHA
              sitekey="6Le-5L4pAAAAAJuOoXkgUGsBy1ZgQxj81Qxh6TzK"
              onChange={handleCaptchaChange}
              className="mt-4"
            />
            <div className="mt-8 flex justify-start">
              <button
                type="submit"
                className="w-max  rounded-2xl border-2 border-[#c10006] bg-[#c10006]  px-5 py-1.5 text-sm font-semibold text-white transition-colors duration-150 ease-in-out hover:border-red-400 hover:bg-red-400"
              >
                Send message
              </button>
            </div>
          </div>
        </form>
        <div className="relative px-6 pb-20 pt-24 sm:pt-32 lg:static lg:px-8 lg:py-32">
          <div className="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
            <div className="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10 lg:w-1/2">
              <svg
                className="absolute inset-0 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527"
                    width="200"
                    height="200"
                    x="100%"
                    y="-1"
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M130 200V.5M.5 .5H200" fill="none"></path>
                  </pattern>
                </defs>
                <rect
                  width="100%"
                  height="100%"
                  stroke-width="0"
                  fill="white"
                ></rect>
                <svg x="100%" y="-1" className="overflow-visible fill-gray-50">
                  <path d="M-470.5 0h201v201h-201Z" stroke-width="0"></path>
                </svg>
                <rect
                  width="100%"
                  height="100%"
                  stroke-width="0"
                  fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)"
                ></rect>
              </svg>
            </div>
            <h2 className="text-5xl font-bold tracking-tight text-[#25aae1]">
              Contact Us
            </h2>
            <p className="mt-6 text-sm leading-6 text-white">
              Got a query or need assistance? Whether you're an event organiser,
              partner, or customer buying tickets, MoTickets is here to help.
              Don't hesitate to get in touch for inquiries, technical support,
              or collaboration opportunities using the contact details provided
              below.{' '}
            </p>
            <dl className="mt-10 space-y-4 text-base leading-7 text-gray-600">
              <div className="flex gap-x-4">
                <dt className="flex-none  ">
                  <span className="sr-only ">Email</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-11 w-12 text-white bg-[#25aae1] p-4 rounded-full"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    ></path>
                  </svg>
                </dt>
                <dd>
                  <a
                    className="hover:text-white text-white"
                    href="mailto:help@motickets.co.uk"
                  >
                    Email Us:
                  </a>
                  <p className="text-white">
                    Sales & Partnership Queries - sales@motickets.co.uk
                  </p>
                  <p className="text-white">
                    Customer Support Queries -{' '}
                    <Link to={''}>Mail: help@motickets.co.uk</Link>
                    help@motickets.co.uk
                  </p>
                </dd>
              </div>
              <div className="flex gap-x-4 ">
                <dt className="flex-none">
                  <span className="sr-only">Address</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    version="1.1"
                    width="11"
                    height="12"
                    viewBox="0 0 256 256"
                    xmlSpace="preserve"
                    className="h-11 w-12 text-white bg-[#25aae1] p-4 rounded-full"
                  >
                    <defs></defs>
                    <g
                      style={{
                        stroke: 'none',
                        strokeWidth: '0',
                        strokeDasharray: 'none',
                        strokeLinecap: 'butt',
                        strokeLinejoin: 'miter',
                        strokeMiterlimit: '10',
                        fill: 'none',
                        fillRule: 'nonzero',
                        opacity: '1',
                      }}
                      transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                    >
                      <path
                        d="M 45 90 c -1.415 0 -2.725 -0.748 -3.444 -1.966 l -4.385 -7.417 C 28.167 65.396 19.664 51.02 16.759 45.189 c -2.112 -4.331 -3.175 -8.955 -3.175 -13.773 C 13.584 14.093 27.677 0 45 0 c 17.323 0 31.416 14.093 31.416 31.416 c 0 4.815 -1.063 9.438 -3.157 13.741 c -0.025 0.052 -0.053 0.104 -0.08 0.155 c -2.961 5.909 -11.41 20.193 -20.353 35.309 l -4.382 7.413 C 47.725 89.252 46.415 90 45 90 z"
                        style={{
                          stroke: 'none',
                          strokeWidth: '1',
                          strokeDasharray: 'none',
                          strokeLinecap: 'butt',
                          strokeLinejoin: 'miter',
                          strokeMiterlimit: '10',
                          fill: 'rgb(255,255,255)', // White fill color
                          fillRule: 'nonzero',
                          opacity: '1',
                        }}
                        transform=" matrix(1 0 0 1 0 0) "
                        strokeLinecap="round"
                      />
                      <path
                        d="M 45 45.678 c -8.474 0 -15.369 -6.894 -15.369 -15.368 S 36.526 14.941 45 14.941 c 8.474 0 15.368 6.895 15.368 15.369 S 53.474 45.678 45 45.678 z"
                        style={{
                          stroke: 'none',
                          strokeWidth: '1',
                          strokeDasharray: 'none',
                          strokeLinecap: 'butt',
                          strokeLinejoin: 'miter',
                          strokeMiterlimit: '10',
                          fill: 'rgb(255,255,255)', // White fill color
                          fillRule: 'nonzero',
                          opacity: '1',
                        }}
                        transform=" matrix(1 0 0 1 0 0) "
                        strokeLinecap="round"
                      />
                    </g>
                  </svg>
                </dt>
                <p className="text-white">
                  66 <br />
                  Bode Thomas, Surulere <br />
                  
                  <br></br>
                  Lagos <br />
                  Nigeria
                </p>
              </div>
            </dl>
            <p className="text-white mt-8 leading-6">
              Hey there! Before you reach out, have you checked our
              <br /> FAQs? They're packed with helpful info!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
