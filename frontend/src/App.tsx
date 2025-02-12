import React, { useEffect, useState } from 'react';
import { translations } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { getCurrentUser } from 'aws-amplify/auth';
import { I18n } from 'aws-amplify/utils';
import '@aws-amplify/ui-react/styles.css';
import AuthAmplify from './components/AuthAmplify';
import AuthCustom from './components/AuthCustom';
import { Authenticator } from '@aws-amplify/ui-react';
import { useTranslation } from 'react-i18next';
import './i18n';
import { validateSocialProvider } from './utils/SocialProviderUtils';
import AppContent from './components/AppContent';
import { ErrorBoundary } from 'react-error-boundary';
import ErrorFallback from './pages/ErrorFallback';

const customProviderEnabled =
  import.meta.env.VITE_APP_CUSTOM_PROVIDER_ENABLED === 'true';
const socialProviderFromEnv = import.meta.env.VITE_APP_SOCIAL_PROVIDERS?.split(
  ','
).filter(validateSocialProvider);
const MISTRAL_ENABLED: boolean =
  import.meta.env.VITE_APP_ENABLE_MISTRAL === 'true';

  const PendoInitializer: React.FC<{ username: string }> = ({ username }) => {
    useEffect(() => {
      // Check if pendo is already loaded
      if (typeof window.pendo !== 'undefined') {
        window.pendo.initialize({
          visitor: {
            id: username,
            email: username, // Replace if you have a separate email attribute
          },
        });
      }
    }, [username]);
  
    return null; // This component doesn't render any UI
  };  

  const App: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState<string | null>(null);
  const pendoKey = import.meta.env.VITE_PENDO_KEY;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { username } = await getCurrentUser();
        setUsername(username);
      } catch (error) {
        console.error('Error fetching authenticated user', error);
      }
    };
    fetchUser();
  }, []);

  // Dynamically add the Pendo script if needed
  useEffect(() => {
    if (!document.getElementById('pendo-script')) {
      const script = document.createElement('script');
      script.id = 'pendo-script';
      script.src = `https://cdn.pendo.io/agent/static/${pendoKey}/pendo.js`;
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    // set header title
    document.title = !MISTRAL_ENABLED
      ? t('app.name')
      : t('app.nameWithoutClaude');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: import.meta.env.VITE_APP_USER_POOL_ID,
        userPoolClientId: import.meta.env.VITE_APP_USER_POOL_CLIENT_ID,
        loginWith: {
          oauth: {
            domain: import.meta.env.VITE_APP_COGNITO_DOMAIN,
            scopes: ['openid', 'email'],
            redirectSignIn: [import.meta.env.VITE_APP_REDIRECT_SIGNIN_URL],
            redirectSignOut: [import.meta.env.VITE_APP_REDIRECT_SIGNOUT_URL],
            responseType: 'code',
          },
        },
      },
    },
  });

  I18n.putVocabularies(translations);
  I18n.setLanguage(i18n.language);

  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {username && typeof window.pendo !== 'undefined' && (
        <PendoInitializer username={username} />
      )}
      {customProviderEnabled ? (
        <AuthCustom>
          <AppContent />
        </AuthCustom>
      ) : (
        <Authenticator.Provider>
          <AuthAmplify socialProviders={socialProviderFromEnv}>
            <AppContent />
          </AuthAmplify>
        </Authenticator.Provider>
      )}
    </ErrorBoundary>
  );
};

export default App;
