# EPR Playground

The EPR Playground is a sponsored project provided by the BfH Medizininformtik in Biel to provide a testbed for the implementation of Use Cases on the Swiss EPR. It provides the components and actors of a typical EPR community it-infrastructure with a focus on patient management and document sharing.   

The characteristics of the EPR Playground are:
- no registration required. Knowing the endpoints is all you need to connect to the EPR Playground.
- mTLS authentication is not required. The endpoints can be accessed without exchanging X.509 certificates.
- Authoritzation is deactivaed to lower the gap and complexity of Use Cases.

## Endpoint URLs
For Use Case testing the EPR Playground offers the following endpoints to the EPR components:

| Transaction | URL                                               |
|-------------|---------------------------------------------------|
| ITI-47 Patient Demographics Query HL7V3 | https://epdplayground.i4mi.bfh.ch:7443/PIXPDQ/services/PIXPDQV3ManagerService|
| ITI-44 Patient Identity Feed HL7V3 | https://epdplayground.i4mi.bfh.ch:7443/PIXPDQ/services/PIXPDQV3ManagerService|
| ITI-45 PIXV3 Query | https://epdplayground.i4mi.bfh.ch:7443/PIXPDQ/services/PIXPDQV3ManagerService|
| ITI-18 RegistryStoredQuery| https://epdplayground.i4mi.bfh.ch:6443/Repository/services/RepositoryService|  
| ITI-41 Provide and Register Document Set| https://epdplayground.i4mi.bfh.ch:6443/Repository/services/RepositoryService|
| ITI-43 Retrieve Document Set| https://epdplayground.i4mi.bfh.ch:6443/Repository/services/RepositoryService|
| ITI-20 Record Audit Event| https://epdplayground.i4mi.bfh.ch:5232|

## Optional Service URLs
In addition the EPR playground provides further endpoints for optional transactions not described in this documentation as follows:

| Transaction | URL                                               |
|-------------|---------------------------------------------------|
| ATC-81 Retrieve ATNA Audit Record | https://epdplayground.i4mi.bfh.ch:7443/ARR/fhir|
| ITI-58 Provider Information Query | https://epdplayground.i4mi.bfh.ch:7443/HPD/services/HPDService|
| ITI-59 Provider Information Feed | https://epdplayground.i4mi.bfh.ch:7443/HPD/services/HPDService|
| ITI-48 Retrieve Value Set | https://epdplayground.i4mi.bfh.ch:7443/ValueSetRepository/services/ValueSetRepositoryService|
| ITI-60 Retrieve Multiple Value Sets | https://epdplayground.i4mi.bfh.ch:7443/ValueSetRepository/services/ValueSetRepositoryService|

## Mobile Access Gateway
The EPR Playground can also be accessed via the mHealth Gateway which implements the mHealth transactions planned for future releases of the Swiss EPR. The mHealth Gateway can be reached as followed:      

| Component   | URL                                               |
|-------------|---------------------------------------------------|
| Mobile Access Gateway | https://test.ahdis.ch/mag-bfh/fhir/|
