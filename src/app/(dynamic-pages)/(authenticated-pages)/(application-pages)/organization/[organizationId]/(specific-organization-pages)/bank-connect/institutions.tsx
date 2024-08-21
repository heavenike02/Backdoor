import InstitutionSelector from '@/components/BankAccount/InstitutionSelector';
import { Config, Institution } from '@/components/BankAccount/utils/types';
import '@public/nordigen-bank-ui/selector.css';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import LoadingIndicator from '../../../../../../../../components/BankAccount/LoadingIndicator';
import Notifications from '../../../../../../../../components/BankAccount/Notification';

interface NotificationsProps {
  message: string;
  type: 'success' | 'error';
}

const institutionList: Institution[] = [
  {
    id: 'SANDBOXFINANCE_SFIN0000',
    name: 'SandBox Finance(TEST BANK)',
    bic: 'sandbox',
    transaction_total_days: '540',
    countries: ['GB'],
    logo: 'https://cdn-logos.gocardless.com/ais/SANDBOXFINANCE_SFIN0000.png',
  },
  {
    id: 'ABNAMRO_ABNAGB2LXXX',
    name: 'ABN AMRO Bank Commercial',
    bic: 'ABNAGB2LXXX',
    transaction_total_days: '540',
    countries: ['GB'],
    logo: 'https://cdn-logos.gocardless.com/ais/ABNAMRO_FTSBDEFAXXX.png',
  },
  {
    id: 'BBVAUK_BBVAGB2L',
    name: 'BBVA',
    bic: 'BBVAGB2L',
    transaction_total_days: '730',
    countries: ['GB'],
    logo: 'https://cdn-logos.gocardless.com/ais/BBVABE_BBVABEBB.png',
  },
  {
    id: 'BANK_OF_SCOTLAND_BUSINESS_BOFSGBS1',
    name: 'Bank of Scotland Business',
    bic: 'BOFSGBS1',
    transaction_total_days: '90',
    countries: ['GB'],
    logo: 'https://cdn-logos.gocardless.com/ais/BANK_OF_SCOTLAND_BUSINESS_BOFSGBS1.png',
  },
  {
    id: 'BANK_OF_SCOTLAND_COMMERCIAL_BOFSGBS1',
    name: 'Bank of Scotland Commercial',
    bic: 'BOFSGBS1',
    transaction_total_days: '90',
    countries: ['GB'],
    logo: 'https://cdn-logos.gocardless.com/ais/BANK_OF_SCOTLAND_BUSINESS_BOFSGBS1.png',
  },
  {
    id: 'BANK_OF_SCOTLAND_BOFSGBS1',
    name: 'Bank of Scotland Personal',
    bic: 'BOFSGBS1',
    transaction_total_days: '90',
    countries: ['GB'],
    logo: 'https://cdn-logos.gocardless.com/ais/BANK_OF_SCOTLAND_BUSINESS_BOFSGBS1.png',
  },
  {
    id: 'BARCLAYCARD_COMMERCIAL_BUKBGB22',
    name: 'Barclaycard Commercial Payments',
    bic: 'BUKBGB22',
    transaction_total_days: '730',
    countries: ['GB'],
    logo: 'https://cdn-logos.gocardless.com/ais/BARCLAYCARD_COMMERCIAL_BUKBGB22.png',
  },
  {
    id: 'BARCLAYCARD_BUKBGB22',
    name: 'Barclaycard UK',
    bic: 'BUKBGB22',
    transaction_total_days: '730',
    countries: ['GB'],
    logo: 'https://cdn-logos.gocardless.com/ais/BARCLAYCARD_COMMERCIAL_BUKBGB22.png',
  },
  {
    id: 'BARCLAYS_BUSINESS_BUKBGB22',
    name: 'Barclays Business',
    bic: 'BUKBGB22',
    transaction_total_days: '730',
    countries: ['GB'],
    logo: 'https://cdn-logos.gocardless.com/ais/BARCLAYS_WEALTH_BUKBGB22.png',
  },
  {
    id: 'BARCLAYS_CORPORATE_BUKBGB22',
    name: 'Barclays Corporate',
    bic: 'BUKBGB22',
    transaction_total_days: '730',
    countries: ['GB'],
    logo: 'https://cdn-logos.gocardless.com/ais/BARCLAYS_WEALTH_BUKBGB22.png',
  },
  {
    id: 'BARCLAYS_BUKBGB22',
    name: 'Barclays Personal',
    bic: 'BUKBGB22',
    transaction_total_days: '730',
    countries: ['GB'],
    logo: 'https://cdn-logos.gocardless.com/ais/BARCLAYS_WEALTH_BUKBGB22.png',
  },
  {
    id: 'ALLGEMEINE_SPARKASSE_OBEROSTERREICH_AG_ASPKAT2LXXX',
    name: 'Allgemeine Sparkasse Oberösterreich Bank AG',
    bic: 'ASPKAT2LXXX',
    transaction_total_days: '730',
    countries: ['AT'],
    logo: 'https://cdn-logos.gocardless.com/ais/KARNTNER_SPARKASSE_AG_KSPKAT2KXXX.png',
  },
  {
    id: 'KLARNA_KLRNSESS',
    name: 'Klarna Bank AB',
    bic: 'KLRNSESS',
    transaction_total_days: '730',
    countries: ['SE', 'FI', 'DE', 'DK', 'AT', 'GB', 'NL', 'NO'],
    logo: 'https://cdn-logos.gocardless.com/ais/KLARNA_KLRNSESS.png',
  },
];

const config: Config = {
  redirectUrl: 'https://www.example.com',
  logoUrl: 'https://cdn-logos.gocardless.com/ais/Nordigen_Logo_Black.svg',
  text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi at enim nisl. Phasellus venenatis et nisl a vestibulum.',
  countryFilter: true,
  styles: {
    fontFamily: 'https://fonts.googleapis.com/css2?family=Roboto&display=swap',
    fontSize: '16px',
    backgroundColor: '#F2F2F2',
    textColor: '#1B2021',
    headingColor: '#222',
    linkColor: '#3F52E5',
    modalTextColor: '#1B2021',
    modalBackgroundColor: '#fff',
  },
};

const BankLinkPage: React.FC = () => {
  const [institutionId, setInstitutionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<NotificationsProps>({
    message: '',
    type: 'success',
  });

  // Callback function to handle institution selection
  const handleSelectInstitution = useCallback(async (id: string) => {
    setInstitutionId(id);
    setLoading(true);
    try {
      const response = await axios.get('/api/go-cardless/bank', {
        params: { action: 'authorize', institutionId: id },
      });
      if (!response.data || !response.data.link) {
        throw new Error('No Bank Link Data');
      }
      window.location.href = response.data.link; // Redirect to bank authorization
    } catch (error) {
      setNotification({
        message: 'Error Fetching Bank Link',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Optionally handle side effects related to institutionId here
  }, [institutionId]);

  const handleError = (error: Error) => {
    setNotification({
      message: 'Error connecting bank account',
      type: 'error',
    });
  };

  return (
    <div className="container mx-auto p-4">
      {notification.message && (
        <Notifications
          message={notification.message}
          type={notification.type}
        />
      )}
      {loading ? (
        <LoadingIndicator />
      ) : (
        <InstitutionSelector
          institutions={institutionList}
          config={config}
          onSelectInstitution={handleSelectInstitution}
        />
      )}
    </div>
  );
};

export default BankLinkPage;
