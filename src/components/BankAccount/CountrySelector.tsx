import React, { useEffect, useState } from 'react';
import { TranslationMappingList } from './utils/translationMapping';
import { Config, Country } from './utils/types';

// Define the component
const CountrySelector: React.FC<{
  countries: Country[];
  config?: Config;
  onSelectCountry: (id: string) => void; // Callback prop for country selection
}> = ({ countries, config, onSelectCountry }) => {
  const [i18n, setI18n] = useState({
    country: TranslationMappingList.en['Select your country'],
    search: TranslationMappingList.en['Search'],
    goBack: TranslationMappingList.en['Go back'],
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCountries, setfilteredCountries] = useState(countries);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const langQuery = params.get('lang') || 'en';
    const lang = TranslationMappingList[langQuery] ? langQuery : 'en';
    setI18n({
      country: TranslationMappingList[lang]['Select your country'],
      search: TranslationMappingList[lang]['Search'],
      goBack: TranslationMappingList[lang]['Go back'],
    });

    // Include CSS file for flag icons
    const link = document.createElement('link');
    link.href = 'https://unpkg.com/flag-icons@6.1.1/css/flag-icons.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);
  useEffect(() => {
    setfilteredCountries(
      countries.filter((country) =>
        country.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm, countries]);

  const handleCountryClick = (
    e: React.MouseEvent<HTMLDivElement>,
    id: string,
  ) => {
    e.preventDefault();
    onSelectCountry(id);
  };
  const createInstitutionListView = () => {
    return (
      <div className="institution-content-wrapper">
        <div
          className=" institution-modal-content"
          id="institution-modal-content"
        >
          <header id="institution-modal-header">
            <h2>{i18n.country}</h2>
          </header>
          <div className="search-box m-5">
            <input
              id="institution-search"
              className="search-box-input"
              type="text"
              placeholder={i18n.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="overflow-visible institution-container institution-search-bx-body">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <div
                  key={country.id}
                  className="ob-institution ob-list-institution"
                  onClick={(e) => handleCountryClick(e, country.id)}
                >
                  <a href="#">
                    <img
                      src={country.logo}
                      alt={country.name}
                      className="ob-institution-logo"
                    />
                    <span className="ob-span-text">{country.name}</span>
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

export default CountrySelector;
