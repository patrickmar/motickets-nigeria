import React from 'react';

const TableForPrivacy = () => {
  return (
    <div className=" mx-auto p-4 contain">
      <table className=" bg-white border border-gray-300 ">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Type of Cookie
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
              Purpose
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-100 border-b text-black">
            <td className="px-6 py-4 whitespace-wrap">
              Strictly necessary cookies
            </td>
            <td className="px-6 py-4 whitespace-wrap">
              These are cookies that are required for the operation of our
              website. They include, for example, cookies that enable you to log
              into secure areas of our website, use a shopping cart or make use
              of e-billing services.
            </td>
          </tr>
          <tr className="bg-white border-b flex-1 text-black">
            <td className="px-6 py-4 nowrap text-black">
              Analytical/performance cookies
            </td>
            <td className="px-6 py-4  whitespace-wrap">
              Analytical/performance cookies They allow us to recognise and
              count the number of visitors and to see how visitors move around
              our website when they are using it. This helps us to improve the
              way our website works, for example, by ensuring that users are
              finding what they are looking for easily.
            </td>
          </tr>
          <tr className="bg-gray-100 border-b text-black">
            <td className="px-6 py-4 whitespace-wrap">Functionality cookies</td>
            <td className="px-6 py-4 whitespace-wrap">
              These are used to recognise you when you return to our website.
              This enables us to personalise our content for you, greet you by
              name and remember your preferences (for example, your choice of
              language or region). By using the Website, you agree to our
              placement of functionality cookie.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TableForPrivacy;
