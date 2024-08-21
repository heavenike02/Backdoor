import React, { useEffect, useState } from 'react';
import { TranslationMappingList } from './utils/translationMapping';
import { Config, Institution } from './utils/types';

// Define the component
const InstitutionSelector: React.FC<{
  institutions: Institution[];
  config?: Config;
  onSelectInstitution: (id: string) => void; // Callback prop for institution selection
}> = ({ institutions, config, onSelectInstitution }) => {
  const [i18n, setI18n] = useState({
    country: TranslationMappingList.en['Select your country'],
    institution: TranslationMappingList.en['Select your bank'],
    search: TranslationMappingList.en['Search'],
    goBack: TranslationMappingList.en['Go back'],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredInstitutions, setFilteredInstitutions] =
    useState(institutions);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langQuery = params.get('lang') || 'en';
    const lang = TranslationMappingList[langQuery] ? langQuery : 'en';
    setI18n({
      country: TranslationMappingList[lang]['Select your country'],
      institution: TranslationMappingList[lang]['Select your bank'],
      search: TranslationMappingList[lang]['Search'],
      goBack: TranslationMappingList[lang]['Go back'],
    });

    // Include CSS file for flag icons
    const link = document.createElement('link');
    link.href = 'https://unpkg.com/flag-icons@6.1.1/css/flag-icons.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Clean up
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  useEffect(() => {
    setFilteredInstitutions(
      institutions.filter((inst) =>
        inst.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm, institutions]);

  const handleInstitutionClick = (
    e: React.MouseEvent<HTMLDivElement>,
    id: string,
  ) => {
    e.preventDefault(); // Prevent default link navigation
    onSelectInstitution(id); // Trigger the callback with the selected institution's ID
  };
  const createInstitutionListView = () => {
    return (
      <div className="institution-content-wrapper">
        <div
          className=" institution-modal-content"
          id="institution-modal-content"
        >
          <header id="institution-modal-header">
            <h2>{i18n.institution}</h2>
          </header>
          <a href="#" className="back-button">
            {i18n.goBack}
          </a>
          <div className="institution-container institution-search-bx-body m-5">
            <div className="institution-search">
              <input
                id="institution-search"
                type="text"
                placeholder={i18n.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-box-input"
              />
            </div>
          </div>
          <div className="institution-container">
            {filteredInstitutions.length > 0 ? (
              filteredInstitutions.map((inst) => (
                <div
                  key={inst.id}
                  className="ob-institution ob-list-institution"
                  onClick={(e) => handleInstitutionClick(e, inst.id)}
                >
                  <a href="#">
                    <img
                      src={inst.logo}
                      alt={inst.name}
                      className="ob-institution-logo"
                    />
                    <span className="ob-span-text">{inst.name}</span>
                  </a>
                </div>
              ))
            ) : (
              <p>Not found </p> //update
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container-onboarding">
        {config?.logoUrl && (
          <div className="company-image-wrapper">
            <img
              src={config.logoUrl}
              className="institution-company-logo"
              alt="Logotype"
            />
          </div>
        )}
        {config?.text && <p>{config.text}</p>}
        <a href="#institution-modal-content">
          <img
            src="data:image/svg+xml;base64,..."
            alt="arrow image"
            className="ob-arrow-down"
          />
        </a>
      </div>
      {createInstitutionListView()}
    </div>
  );
};

export default InstitutionSelector;
