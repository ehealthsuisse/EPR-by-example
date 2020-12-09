# Provide X-User Assertion
Method to provide a SAML 2.0 assertion in the Web Service Security header to authorize transactions. Primary systems shall use this transaction to incorporate a SAML Assertion to authorize transactions.

- [Overview](#overview)
- [Transaction](#transaction)
	* [Message Semantics](#message-semantics)
	* [Audit Log](#audit-log)
- [Test Opportunity](#test-opportunity)

# Overview
Primary systems shall use this transaction to incorporate SAML 2 assertions retrieved by the
**[Get X-User Assertion ](./GetXAssertion.md)** to XDS.b transactions as defined in the **[IHE XUA profile(https://profiles.ihe.net/ITI/TF/Volume1/ch-13.html)** with Swiss specific extensions defined in  
**[Ammendment 1 to Annex 5](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/gesetze/anhang_5_ergaenzung_1_epdv_edi_20200415.PDF.download.PDF/Ergaenzung_1_Anhang_5_EPDV-EDI_20200415.pdf.PDF)**.   

# Transaction

In constrast to the other transactions used in the Swiss EPR, this transaction is not standalone and shall be used in conjunction with other transactions which require authorization. These are:
- **[Registry Stored Query](../main/files/RegistryStoredQuery.md)** - get and display document metadata
- **[Retrieve Document Set](../main/files/RetrieveDocumentSet.md)** - get and display documents
- **[Provide and Register Document Set](../main/files/ProvideAndRegister.md)** - store documents in the EPR  

## Message Semantics

TBD

```
code block here    
```

## Audit Log

TBD

```
code block here    
```

# Test Opportunity

TBD
