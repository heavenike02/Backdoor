'use client';

import CountrySelector from '@/components/BankAccount/CountrySelector';
import InstitutionSelector from '@/components/BankAccount/InstitutionSelector';
import {
  Config,
  Country,
  Institution,
} from '@/components/BankAccount/utils/types';
import { useToastMutation } from '@/hooks/useToastMutation';
import '@public/nordigen-bank-ui/selector.css';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import LoadingIndicator from '../../../../../../../../components/BankAccount/LoadingIndicator';

const countries: Country[] = [
  { id: 'IE', name: 'Ireland', logo: 'path/to/flag/logo' },
  { id: 'DE', name: 'Germany', logo: 'path/to/flag/logo' },
  { id: 'GB', name: 'United Kingdom', logo: 'path/to/flag/logo' },
  { id: 'FR', name: 'France', logo: 'path/to/flag/logo' },
  { id: 'SE', name: 'Sweden', logo: 'path/to/flag/logo' },
  { id: 'FI', name: 'Finland', logo: 'path/to/flag/logo' },
];

const testInstitution: Institution = {
  id: 'SANDBOXFINANCE_SFIN0000',
  name: 'SandBox Finance(TEST BANK)',
  bic: 'sandbox',
  transaction_total_days: '540',
  countries: ['GB'],
  logo: 'https://cdn-logos.gocardless.com/ais/SANDBOXFINANCE_SFIN0000.png',
};

const config: Config = {
  redirectUrl: 'https://app.backdoor.com',
  logoUrl: 'https://cdn-logos.gocardless.com/ais/Nordigen_Logo_Black.svg',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at enim nisl. Phasellus venenatis et nisl a vestibulum.',
  countryFilter: true,
  styles: {
    fontFamily: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
    fontSize: '16px',
    backgroundColor: '#BF00FF',
    textColor: '#1B2021',
    headingColor: '#222',
    linkColor: '#3F52E5',
    modalTextColor: '#1B2021',
    modalBackgroundColor: '#fff',
  },
};

const BankLinkPage: React.FC = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [countryId, setCountryId] = useState<string>('');
  const [institutionId, setInstitutionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const fetchInstitutions = async (id: string) => {
    const response = await axios.get('/api/go-cardless/bank', {
      params: { action: 'countries', countryId: id },
    });
    if (!response.data) {
      throw new Error('No Institutions Data');
    }
    return response.data;
  };

  const fetchInstitutionsMutation = useToastMutation(fetchInstitutions, {
    loadingMessage: 'Fetching institutions...',
    successMessage: (data) => `Institutions loaded!`,
    errorMessage: (error: Error) => `Error: ${error.message}`,
  });

  const fetchBankLink = async (id: string) => {
    const response = await axios.get('/api/go-cardless/bank', {
      params: { action: 'institutions', institutionId: id },
    });
    if (!response.data || !response.data.link) {
      throw new Error('No Bank Link Data');
    }
    return response.data.link;
  };

  const fetchBankLinkMutation = useToastMutation(fetchBankLink, {
    loadingMessage: 'Fetching bank link...',
    successMessage: (data) => `Redirecting to: ${data}`,
    errorMessage: (error: Error) => `Error: ${error.message}`,
  });

  const handleSelectCountry = useCallback(
    async (id: string) => {
      setCountryId(id);
      setLoading(true);
      fetchInstitutionsMutation.mutate(id, {
        onSuccess: (data) => {
          const institutionsWithTest = [testInstitution, ...data];
          setInstitutions(institutionsWithTest);
        },
        onError: () => {
          setCountryId(''); // Reset to re-render CountrySelector
        },
        onSettled: () => {
          setLoading(false);
          setTimeout(() => {
            fetchInstitutionsMutation.reset(); // Clear any lingering notifications
          }, 5000);
        },
      });
    },
    [fetchInstitutionsMutation],
  );

  const handleSelectInstitution = useCallback(
    async (id: string) => {
      setInstitutionId(id);
      setLoading(true);
      fetchBankLinkMutation.mutate(id, {
        onSuccess: (link) => {
          window.location.href = link; // Redirect to bank authorization
        },
        onError: () => {
          setInstitutionId(''); // Reset to re-render CountrySelector
        },
        onSettled: () => {
          setLoading(false);
          setTimeout(() => {
            fetchBankLinkMutation.reset(); // Clear any lingering notifications
          }, 5000);
        },
      });
    },
    [fetchBankLinkMutation],
  );

  const handleGoBack = () => {
    // Clear institutionId to show CountrySelector
    setCountryId('');
  };

  return (
    <div className="container mx-auto p-4">
      {loading && <LoadingIndicator />}
      {!loading && !countryId && !institutionId && (
        <CountrySelector
          countries={countries}
          config={config}
          onSelectCountry={handleSelectCountry}
        />
      )}
      {!loading && countryId && !institutionId && institutions.length > 0 && (
        <InstitutionSelector
          institutions={institutions}
          config={config}
          onSelectInstitution={handleSelectInstitution}
          onGoBack={() => setInstitutionId('')} // Handle go back
        />
      )}
    </div>
  );
};

export default BankLinkPage;
