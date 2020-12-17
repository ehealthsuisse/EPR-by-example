
![logo](media/logo.png)

# Swiss EPR Transactions

Primary systems need to integrate only a handful of transactions to connect to the Swiss Electronic Patient Record (EPR), i.e., for Patient and Document Mangement as well as for Authentication and Authorisation.

The specification of the transactions are published in the ordinances of the law of the electronic patient dossier. There all details and options are found in the ordinances and the references therein.

This pages explain the transactions by using samples recorded or adapted from transactions performed during the annual Swiss projectathon (September 2020). The pages shall be used as additional material to support developer and architects of primary systems to integrate to the Swiss EPR or plan to do so in the near future.  

## Patient Management

**[PDQ V3](../main/files/PDQ.md)** - Search for patient data using demographic data as search criteria

**[PIX V3 Feed](../main/files/PIXFeed.md)** - Register patient data

**[PIX V3 Query](../main/files/PIXQuery.md)** - Query the master patient ID and EPR-SPID for patients

## Document Management

**[Registry Stored Query](../main/files/RegistryStoredQuery.md)** - Get and display document metadata

**[Retrieve Document Set](../main/files/RetrieveDocumentSet.md)** - Get and display documents

**[Provide and Register Document Set](../main/files/ProvideAndRegister.md)** - Store documents in the EPR

## Authentication

**[Authenticate User](../main/files/AuthenticateUser.md)** - Authenticate a user

**[IdP Renew](../main/files/IdPRenew.md)** - Renew a IdP assertion

**[SSO Logout](../main/files/SSOLogout.md)** - Logout of authenticated user  

## Authorization

**[Get X-User Assertion](../main/files/GetXAssertion.md)** - Retrieve SAML 2.0 Assertions for authorization

**[Provide X-User Assertion](../main/files/ProvideXAssertion.md)** - Use SAML 2.0 Assertion in transactions to authorize access
