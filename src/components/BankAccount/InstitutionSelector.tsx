import React, { useEffect, useState } from 'react';
import { TranslationMappingList } from './utils/translationMapping';
import { Config, Institution } from './utils/types';

// Define the component
const InstitutionSelector: React.FC<{
  institutions: Institution[];
  config?: Config;
}> = ({ institutions, config }) => {
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

  const createInstitutionListView = () => {
    return (
      <div className="institution-modal-content" id="institution-modal-content">
        <header id="institution-modal-header">
          <h2>{i18n.institution}</h2>
        </header>
        <div className="institution-search">
          <input
            type="text"
            placeholder={i18n.search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="institution-search">
          <div className="institution-container">
            {filteredInstitutions.length > 0 ? (
              institutions.map((inst) => (
                <div
                  key={inst.id}
                  className="ob-institution ob-list-institution"
                >
                  <a href={inst.id} data-institution={inst.id}>
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
              <p>
                {i18n.search}... {i18n.goBack}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-w-full flex justify-center items-center h-screen ">
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
