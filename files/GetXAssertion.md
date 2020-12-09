# Get X-User Assertion
Transaction to retrieve a SAML 2.0 assertion for authorization of transactions in the Swiss EPR.  

- [Overview](#overview)
- [Transaction](#transaction)
	* [Message Semantics](#message-semantics)
		- [Request Message](#request-message)
		- [Response Message](#response-message)
	* [Transport Protocol](#transport-protocol)
	* [Adit Log](#audit-log)
- [Security Requirements](#security-requirements)
- [Test Opportunity](#test-opportunity)

# Overview

Primary systems shall use this transaction to retrieve a SAML 2 assertions to be used with the
**[Provide X-User Assertion](./ProvideXAssertion.md)** with XDS.b transactions as defined in the **[IHE XUA profile](https://profiles.ihe.net/ITI/TF/Volume1/ch-13.html)** with Swiss specific extensions defined in  
**[Ammendment 1 to Annex 5](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/gesetze/anhang_5_ergaenzung_1_epdv_edi_20200415.PDF.download.PDF/Ergaenzung_1_Anhang_5_EPDV-EDI_20200415.pdf.PDF)**.

The primary system shall provide claims (e.g., user role, purpose of use) with the request.   

The community verifies the claims and responds with a XUA compliant SAML 2.0 Assertion defined in **[Ammendment 1 to Annex 5](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/gesetze/anhang_5_ergaenzung_1_epdv_edi_20200415.PDF.download.PDF/Ergaenzung_1_Anhang_5_EPDV-EDI_20200415.pdf.PDF)**. 

# Transaction

TBD

## Message Semantics  

TBD

```
code block here    
```

### Request Message

TBD

```
code block here    
```

### Response Message

TBD

```
code block here    
```

## Transport Protocol

TBD

```
code block here    
```

## Audit Log

TBD

```
code block here    
```

## Security Requirements  

TBD

# Test Opportunity

TBD
