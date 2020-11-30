# Registry Stored Query
Transaction to lookup the document metadata for the documents stored in a patients EPR.

# Overview

Primary systems shall use this transaction to retrieve the document metadata for the documents stored in a patients EPR. In the Swiss EPR the **[IHE XDS.b](https://profiles.ihe.net/ITI/TF/Volume1/ch-10.html)** profile and transactions shall be used to retrieve the document metadata.

To retrieve the document metadata of the doczûmet stored in a patients EPR, the the primary system shall perform a **[Registry Stored Query \[ITI-18\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-18.html#3.18)**. The Registry Stored Query [ITI-18] supports various query parameter as search and filter parameter. The most common parameter used in the Swiss EPR are the patient ID in CX format and the status information, which must be *Approved*. 

The community responds with the metadata sets of all documents registered in the patient's EPR, which match the search and filter parameter of the query. The profile is based upon the **[ebXML](http://www.ebxml.org)** standard. Due to the genericity of the ebXML standard, the response is not human readable and needs without background information given below.


# Transaction 

## Message Semantics

Messages are encoded as described in the **[ebXML](http://www.ebxml.org)** standard with restictions defined in the IHE profile and the ordinances to the Swiss EPR. 

### Request Message

The following snippet displays a sample requests recorded during the EPR projectathon in September 2020, with abbrevations to increase readability. The raw request file may be found **[here]()**. 

The sample request is a standard XML SOAP request with the query embedded in the *Body* element of the SOAP envelope. 

The SOAP *Header* element conveys the following information: 

- *To* : The URL of the registry stored query service. 
- *MessageID* : a UUID of the message. 
- *Action* : The SOAP action identifier of the query as defined in the IHE ITI Technical Framework. 
- *Security* : The Web Service Security header as defined in the **[WS Security](http://docs.oasis-open.org/wss-m/wss/v1.1.1/os/wss-SOAPMessageSecurity-v1.1.1-os.html)** specification. This element conveys the XUA Assertion used for authorization (see **[Get X-User Assertion](../main/GetXAssertion.md)**).  


The SOAP *Body* element conveys the *AdhocQuery* (lines 15 to 26 below) with the following information: 

- *Slot* element with name *$XDSDocumentEntryStatus*: The status filter parameter, which must take the value *urn:oasis:names:tc:ebxml-regrep:StatusType:Approved* (line 18).  
- *Slot* element with name *$XDSDocumentEntryPatientId*: The master patient ID (XAD-PID) of the patient in CX format (see **[PIX Feed](../main/PIXFeed.md)**) (line 23). 


```
0 <?xml version="1.0" encoding="UTF-8"?>
1 <soapenv:Envelope xmlns="!-- namespaces supressed -->">
2  <soapenv:Header>
3   <wsa:To soapenv:mustUnderstand="1">https://epd-test.com/Registry/services/RegistryService</wsa:To>
4   <wsa:MessageID soapenv:mustUnderstand="1">urn:uuid:31D7E4B5-C117-481E-9EE1-F32849E81BF8</wsa:MessageID>
5   <wsa:Action soapenv:mustUnderstand="1">urn:ihe:iti:2007:RegistryStoredQuery</wsa:Action>
6   <wsse:Security>
7    <saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion">
8     <!-- CH:XUA Assertion -->
9    </saml2:Assertion>
10   </wsse:Security>
11  </soapenv:Header>
12  <soapenv:Body>
13   <ns0:AdhocQueryRequest>
14    <ns0:ResponseOption returnType="ObjectRef" returnComposedObjects="true"/>
15    <rim:AdhocQuery id="urn:uuid:14d4debf-8f97-4251-9a74-a90016b0af0d">
16     <rim:Slot name="$XDSDocumentEntryStatus">
17      <rim:ValueList>
18       <rim:Value>('urn:oasis:names:tc:ebxml-regrep:StatusType:Approved')</rim:Value>
19      </rim:ValueList>
20     </rim:Slot>
21     <rim:Slot name="$XDSDocumentEntryPatientId">
22      <rim:ValueList>
23       <rim:Value>'7e1c6e78-58f1-4a43-ae88-0d5a5c4ab43e^^^&amp;1.3.6.1.4.1.21367.2017.2.5.45&amp;ISO'</rim:Value>
24      </rim:ValueList>
25     </rim:Slot>
26    </rim:AdhocQuery>
27   </ns0:AdhocQueryRequest>
28  </soapenv:Body>
29 </soapenv:Envelope>
```

### Response Message

Since the **[ebXML](http://www.ebxml.org)** standard is very generic, the response is hard to read for humans and needs some background information. 

The structure of the result set is as follows (see example below): 
- The metadata of the individual documents are bundled in a *ExtrinsicObject* XML schema.
- The metadata attributes are encoded either as *Slot*, as *Classification* or the *ExternalIdentifier* schema. 
- Metadata attributes encoded as *Slots* can be identified by the slot's *name* attribute. 
- Metadata attributes encoded as *Classification* can be identified by the classification's *classificationScheme* attribute.
- The unique ID of the document is encoded as *ExternalIdentifier*, which has an *identificationScheme* attribute with a fixed value.

The full table of the identifier used to indicate the metadata attributes is defined by the metadat model used by IHE XDS.b in **[IHE ITI Technical Framework Vol. 3, Section 4.2.5.2](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.2)**. The corresponding interpretation of the metadata attributes in the Swiss EPR and the supported value sets may be found in **[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)** of the ordinances of the Swiss electronic patient dossier.

### Protocol Message

TBD

```
code block here    
```

## Transport Protocol 

TBD 

## Security Requirements    

TBD

# Test Opportunity

TBD