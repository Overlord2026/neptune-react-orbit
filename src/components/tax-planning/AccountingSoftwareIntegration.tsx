
import React from 'react';
import { useIntegrationState } from './software-integration/hooks/useIntegrationState';
import IntegrationGrid from './software-integration/components/IntegrationGrid';
import IntegrationHeader from './software-integration/IntegrationHeader';

const AccountingSoftwareIntegration = () => {
  const { softwareOptions, handleConnect, handleSync } = useIntegrationState();

  return (
    <div className="my-8">
      <IntegrationHeader />
      <IntegrationGrid 
        softwareOptions={softwareOptions}
        onConnect={handleConnect}
        onSync={handleSync}
      />
    </div>
  );
};

export default AccountingSoftwareIntegration;
