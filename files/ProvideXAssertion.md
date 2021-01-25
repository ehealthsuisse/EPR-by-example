# Provide X-User Assertion
Method to provide a SAML 2.0 assertion in the Web Service Security header to authorize transactions. Primary systems shall use this transaction to provide a SAML Assertion to authorize transactions.

- [Overview](#overview)
- [Transaction](#transaction)
	* [Message Semantics](#message-semantics)
	* [Audit Log](#audit-log)
- [Test Opportunity](#test-opportunity)

# Overview
Primary systems shall use this transaction to provide SAML 2 assertions retrieved by the
**[Get X-User Assertion ](./GetXAssertion.md)** with XDS.b transactions as defined in the **[IHE XUA profile](https://profiles.ihe.net/ITI/TF/Volume1/ch-13.html)** with Swiss specific extensions defined in  
**[Amendment 1 to Annex 5](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/gesetze/anhang_5_ergaenzung_1_epdv_edi_20200415.PDF.download.PDF/Ergaenzung_1_Anhang_5_EPDV-EDI_20200415.pdf.PDF)**.   

# Transaction
This transaction is not used standalone and shall be used in conjunction with other transactions which require authorization. These are:
- **[Registry Stored Query](../main/files/RegistryStoredQuery.md)** - get and display document metadata
- **[Retrieve Document Set](../main/files/RetrieveDocumentSet.md)** - get and display documents
- **[Provide and Register Document Set](../main/files/ProvideAndRegister.md)** - store documents in the EPR  

## Message Semantics

Primary systems shall use a **[Get X-User Assertion ](./GetXAssertion.md)** transaction to retrieve XUA SAML Assertion for authorization, before performing transactions which require authorization. The XUA SAML Assertion for authorization shall be added to the *Security* header of the SOAP envelope used for the transaction, which requires authorization.  

The following snippet shows an abbreviated example message with a SAML Assertion:  

```
1 <?xml version="1.0" encoding="UTF-8"?>
2 <Envelope xmlns=" !-- namespaces omitted -- ">
3  <Header>
4    <To soapenv:mustUnderstand="1"> <!-- id of transaction used in conjunction --></wsa:To>
5    <MessageID soapenv:mustUnderstand="1">urn:uuid:31D7E4B5-C117-481E-9EE1-F32849E81BF8</wsa:MessageID>
6    <Action soapenv:mustUnderstand="1">urn:ihe:iti:2007:RegistryStoredQuery</wsa:Action>
7    <Security>
8      <saml2:Assertion>
9			  <!-- assertion content omitted for brevity -->
10      </saml2:Assertion>
11    <Security>
12  </Header>
13  <Body>
14   <!-- body elements of transaction used in conjunction omitted for brevity -->
15  <Body>
16 </soapenv:Envelope>    
```

For the details on the Assertion content, please see the step by step example in **[Get X-User Assertion ](./GetXAssertion.md)**.

## Audit Log

This transaction does not require separate ATNA audit log messages, but adds requirements to the transactions used with, as described in section 1.6.4.3.5 of **[Amendment 1 to Annex 5](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/gesetze/anhang_5_ergaenzung_1_epdv_edi_20200415.PDF.download.PDF/Ergaenzung_1_Anhang_5_EPDV-EDI_20200415.pdf.PDF)**.

# Test Opportunity

The transaction can be tested with the Gazelle test suite of the **[EPR reference environment](https://ehealthsuisse.ihe-europe.net)**, or test systems of the EPR communities. 
