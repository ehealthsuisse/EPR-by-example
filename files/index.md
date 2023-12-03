# Swiss EPR Transactions

Primary systems need to implement only a handful of transactions to connect to the Swiss Electronic Patient Record (EPR), i.e., for Patient and Document Mangement as well as for Authentication and Authorisation.

The specification of the transactions are published in the ordinances of the law of the electronic patient dossier. There all details and options are found in the ordinances and the references therein.

The pages explain the transactions by using samples recorded or adapted from transactions performed during the annual Swiss projectathon (September 2020). The pages shall be used as additional material to support developer and architects of primary systems to integrate to the Swiss EPR or plan to do so in the near future.

Primary systems which wan't to test their implementation of the EPR transactions may either use the test systems provided by the communities or public available test systems. Currently there are two public test systems available:

The Gazelle test environment provides the full set of tests available for EPR transactions. Tests may be used to verify the EPR compliance of each isolated transation.

The EPR Playground is a public available installation of the EPR core infrastructure provided the BfH Bern. To reduce the gap for primary systems and ease the usage, the EPR playground dropped some of the security functions present in the Swiss EPR (e.g., mutual authentication, authorization). Up to this limitation the EPR playground supports the requirements of the Swiss EPR and vendors of primary systems may use the EPR playground to verify the transactions but also full use cases from patient registration to document exchange scenarios.

Please see section below for details on the available public test systems.

### Patient Management

**[PDQ V3](PDQ.md)** - Search for patient data using demographic data as search criteria

**[PIX V3 Feed](PIXFeed.md)** - Register patient data

**[PIX V3 Query](PIXQuery.md)** - Query the master patient ID and EPR-SPID for patients

### Document Management

**[Registry Stored Query](RegistryStoredQuery.md)** - Get and display document metadata

**[Retrieve Document Set](RetrieveDocumentSet.md)** - Get and display documents

**[Provide and Register Document Set](ProvideAndRegister.md)** - Store documents in the EPR

### Authentication

**[Authenticate User](AuthenticateUser.md)** - Authenticate a user

**[IdP Renew](IdPRenew.md)** - Renew a IdP assertion

**[SSO Logout](SSOLogout.md)** - Logout of authenticated user

### Authorization

**[Get X-User Assertion](GetXAssertion.md)** - Retrieve SAML 2.0 Assertions for authorization

**[Provide X-User Assertion](ProvideXAssertion.md)** - Use SAML 2.0 Assertion in transactions to authorize access

### Public Test Systems

**[EPR Playground](playground.md)** - Public available test system to test transaction messages and complex use cases.

**[EPR Reference Environment](gazelle.md)** - Public available test system to test isolated transaction for EPR compliance.

## Swiss EPR Exchange Formats

Exchange formats permit the simple exchange of data between different health professionals' information technology systems without the need for any special agreement. The specifications of the exchange formats define the technical, syntactic and semantic standards required for the consistent exchange of information. The objective is to standardize data exchange in the healthcare sector, especially with regard to the Swiss Electronic Patient Record (EPR).

### eMedication

**[Medication Card document](MedicationCardDocument.md)** - Complete overview about the current Medication from the patient.

### eVaccination

**[Immunization Administration Document](ImmunizationAdministrationDocument.md)** - Contains information on applied immunizations.

### FHIR Questionnaire
**[How to build a FHIR-Questionnaire](Questionnaire.md)** - Contains information on how a FHIR Questionnaire can be built and displayed for an user to fill out.
