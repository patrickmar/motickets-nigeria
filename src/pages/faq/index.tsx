import React, { useEffect, useState } from 'react';
import TermsOfUse from '../../components/termsOfUse';
import AcceptableUsePolicy from '../../components/AcceptableUsePolicy.tsx';
import PrivacyPolicy from '../../components/PrivacyPolicy';

const Faq = () => {
  const [selectedContent, setSelectedContent] = useState<string>('term-of-use');

  // Function to handle click on sidebar items
  const handleItemClick = (content: string) => {
    setSelectedContent(content);
  };
  useEffect(() => {
    setSelectedContent('term-of-use');
  }, []);

  return (
    <div className="flex py-24">
      <div className="w-1/4 h-screen bg-[#04152d] sticky top-0 p-4  flex flex-col items-center">
        <h2 className="mb-8 text-[32px] font-bold  text-white">Our Policies</h2>
        <ul className="list-none justify-cenetr text-lg">
          <li className="mb-8" onClick={() => handleItemClick('term-of-use')}>
            <span className="text-white cursor-pointer">Term of Use</span>
          </li>
          <li
            className="mb-8"
            onClick={() => handleItemClick('acceptable-use-policy')}
          >
            <span className="text-white cursor-pointer">
              Acceptable Use Policy
            </span>
          </li>
          <li
            className="mb-8"
            onClick={() => handleItemClick('privacy-policy')}
          >
            <span className="text-white cursor-pointer">Privacy Policy</span>
          </li>
        </ul>
      </div>
      <div className="w-3/4 bg-[#04152d] p-4 text-white leading-8">
        {/* Display content based on selectedContent state */}
        {selectedContent === 'term-of-use' && <TermsOfUse />}
        {selectedContent === 'acceptable-use-policy' && <AcceptableUsePolicy />}
        {selectedContent === 'privacy-policy' && <PrivacyPolicy />}
      </div>
    </div>
  );
};

export default Faq;
