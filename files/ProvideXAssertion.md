# Provide X-User Assertion
Method to provide a SAML 2.0 assertion in the Web Service Security header to authorize transactions. Primary systems shall use this transaction to provide a SAML Assertion to authorize transactions.

## Overview
Primary systems shall use this transaction to provide SAML 2 assertions retrieved by the
[Get X-User Assertion ](GetXAssertion.md) with XDS.b transactions as defined in the [IHE XUA profile](https://profiles.ihe.net/ITI/TF/Volume1/ch-13.html) with Swiss specific extensions defined in  
[Amendment 1 to Annex 5][annexes].   

## Transaction
This transaction is not used standalone and shall be used in conjunction with other transactions which require authorization. These are:

- [Registry Stored Query](RegistryStoredQuery.md) - get and display document metadata
- [Retrieve Document Set](RetrieveDocumentSet.md) - get and display documents
- [Provide and Register Document Set](ProvideAndRegister.md) - store documents in the EPR  

### Message Semantics

Primary systems shall use a [Get X-User Assertion ](GetXAssertion.md) transaction to retrieve XUA SAML Assertion for authorization, before performing transactions which require authorization. The XUA SAML Assertion for authorization shall be added to the *Security* header of the SOAP envelope used for the transaction, which requires authorization.  

The following snippet shows an abbreviated example message with a SAML Assertion:  

```xml linenums="1"
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns=" !-- namespaces omitted -- ">
 <soap:Header>
   <wsa:To soap:mustUnderstand="1"> <!-- id of transaction used in conjunction --></wsa:To>
   <wsa:MessageID soap:mustUnderstand="1">urn:uuid:31D7E4B5-C117-481E-9EE1-F32849E81BF8</wsa:MessageID>
   <wsa:Action soap:mustUnderstand="1">urn:ihe:iti:2007:RegistryStoredQuery</wsa:Action>
   <wsse:Security>
     <saml2:Assertion>
       <!-- assertion content omitted for brevity -->
     </saml2:Assertion>
   </wsse:Security>
 </soap:Header>
 <soap:Body>
  <!-- body elements of transaction used in conjunction omitted for brevity -->
 </soap:Body>
</soap:Envelope>
```

For the details on the Assertion content, please see the step by step example in [Get X-User Assertion ](GetXAssertion.md).

### Audit Log

This transaction does not require separate ATNA audit log messages, but adds requirements to the transactions used with, as described in section 1.6.4.3.5 of [Amendment 1 to Annex 5][annexes].

## Test Opportunity

The transaction can be tested with the test suite of the [EPR reference environment](gazelle.md) or test systems of the EPR communities.
