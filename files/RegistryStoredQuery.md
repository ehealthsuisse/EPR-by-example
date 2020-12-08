# Registry Stored Query
Transaction to lookup the document metadata for the documents stored in a patient's EPR. Primary systems shall use this transaction to view the metadata of the available documents for to display the data in the UI.   

**CONTENTS**

- [Overview](#overview)
- [Transaction](#transaction)
	* [Message Semantics](#message-semantics)
		- [Request Message](#request-message)
		- [Response Message](#response-message)
		- [Message Interpretation](#message-interpretation)
	* [Transport Protocol](#transport-protocol)
	* [Adit Log](#audit-log)
- [Security Requirements](#security-requirements)
- [Test Opportunity](#test-opportunity)  

# Overview

Primary systems shall use this transaction to retrieve the document metadata for the documents stored in a patients EPR.
In the Swiss EPR the **[IHE XDS.b](https://profiles.ihe.net/ITI/TF/Volume1/ch-10.html)** profile and transactions shall
be used to retrieve the document metadata.

To retrieve the document metadata of the document stored in a patients EPR, the the primary system shall perform a
**[Registry Stored Query \[ITI-18\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-18.html)**. The
Registry Stored Query [ITI-18] supports various query parameter as search and filter parameter. The most
common parameter used in the Swiss EPR are the patient ID in CX format and the status information, which must be
*Approved*.

The community responds with the metadata sets of all documents registered in the patient's EPR, which match the search
and filter parameter of the query. The profile is based upon the **[ebXML](http://www.ebxml.org)** standard. Due to the
genericity of the ebXML standard, the response is not human readable and needs without background information given below.

# Transaction

## Message Semantics

Messages are encoded as described in the **[ebXML](http://www.ebxml.org)** standard with restictions defined in the IHE
profile and the ordinances to the Swiss EPR.

### Request Message

The following snippet displays a sample request recorded during the EPR projectathon in September 2020. Some elements
were ommitted to increase readability. The raw request file may be found **[here](https://github.com/msmock/AnnotatedTX/blob/main/samples/ITI-18_request_raw.xml)**.

The request message shall be a XML SOAP envelope with the query embedded in the *Body* element of the SOAP envelope.
The SOAP *Header* element conveys the following information:

- *To* element: The URL of the registry stored query service.
- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the query as defined in the IHE ITI Technical Framework.
- *Security* element: The Web Service Security header as defined in the **[WS Security](http://docs.oasis-open.org/wss-m/wss/v1.1.1/os/wss-SOAPMessageSecurity-v1.1.1-os.html)** specification. This element conveys the XUA Assertion used for authorization (see **[Provide X-User Assertion](../files/ProvideXAssertion.md)**).  


The SOAP *Body* element conveys the *AdhocQuery* (lines 15 to 26 below) with the following information:

- *Slot* element with name *$XDSDocumentEntryStatus*: The status filter parameter, which must take the value *urn:oasis:names:tc:ebxml-regrep:StatusType:Approved* (line 18).  
- *Slot* element with name *$XDSDocumentEntryPatientId*: The master patient ID (XAD-PID) of the patient in CX format
(see **[PIX Feed](./PIXFeed.md)**) (line 23).

```
0 <?xml version="1.0" encoding="UTF-8"?>
1 <soapenv:Envelope xmlns="!-- namespaces omitted -->">
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

Since the **[ebXML](http://www.ebxml.org)** standard is very generic, the response message is quite lengthy and needs some
background information to interpret.

The structure of the result set is as follows (see example below):
- The metadata of the individual documents are bundled in a *ExtrinsicObject* element.
- The metadata attributes are encoded as *Slot*, as *Classification* or as *ExternalIdentifier* elements.
- Metadata attributes encoded as *Slots* can be identified and interpreted by the slot's *name* attribute.
- Metadata attributes encoded as *Classification* can be identified and interpreted by the classification's *classificationScheme* attribute.
- The unique ID of the document is encoded as *ExternalIdentifier*, which has an *identificationScheme* attribute with a fixed value.

The table of the identifier used to indicate the metadata attributes is defined by the metadata model used by IHE XDS.b in **[IHE ITI Technical Framework Vol. 3, Section 4.2.5.2](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.2)**.

The corresponding interpretation of the metadata attributes in the Swiss EPR and the supported value sets may be found in
**[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)** of
the ordinances of the Swiss electronic patient dossier.

A request message is quite lengthy. A listing with abbrevations used in the step by step interpretation below is found
**[here](https://github.com/msmock/AnnotatedTX/blob/main/samples/ITI-18_response.xml)**. The raw version of the message may
be found **[here](https://github.com/msmock/AnnotatedTX/blob/main/samples/ITI-18_response_raw.xml)**.

### Message Interpretation

The response message is not complex in nature, but quite lengthy due to the genericity of the ebXML standard.
Therefore the following step by step interpretation may be of help to interpret the response.

The SOAP *Header* element conveys the following information:

- *Action* element: The SOAP action identifier of the response as defined in the IHE ITI Technical Framework.
- *RelatesTo* element: The *messageID* of the query request (see above).

```
2  <soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
3   <wsa:Action soapenv:mustUnderstand="1">urn:ihe:iti:2007:RegistryStoredQueryResponse</wsa:Action>
4   <wsa:RelatesTo>urn:uuid:31D7E4B5-C117-481E-9EE1-F32849E81BF8</wsa:RelatesTo>
5  </soapenv:Header>    
```

The SOAP *body* element conveys 0..N *ExtrinsicObject* elements, each conveying the metadata of a single document.

```
13     <ns2:ExtrinsicObject
14      mimeType="application/pdf"
15      lid="urn:uuid:c03c96ca-33a1-44bd-8b8f-b52d8cf69e65"
16      objectType="urn:uuid:7edca82f-054d-47f2-a032-9b2a5b5186c1"
17      status="urn:oasis:names:tc:ebxml-regrep:StatusType:Approved"
18      id="urn:uuid:c03c96ca-33a1-44bd-8b8f-b52d8cf69e65"
19      home="urn:oid:1.3.6.1.4.1.21367.2017.2.6.19">
...
165    </ns2:ExtrinsicObject>   
```

The element has fixed attributes defined in the IHE ITI Technical Framework. Beyond these, the **ExtrinsicObject** conveys the following information for the primary system:

- *mimeType* attribute: The document mime type. It's value must match a mime type supported by the Swiss EPR as defined in
**[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)**.
- *status* attribute: The status of the document, which should be *Approved*.  

As explained above, a subset of the relevant metadata are defined in ebXML *slot* elements. These are:   

```
25      <ns2:Slot name="languageCode">
26       <ns2:ValueList>
27        <ns2:Value>de-CH</ns2:Value>
28       </ns2:ValueList>
29      </ns2:Slot>    
```

- *languageCode*: The coded value of the documents language. It's value must match one code value supported by the Swiss
EPR as defined in **[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)**.

```
35      <ns2:Slot name="repositoryUniqueId">
36       <ns2:ValueList>
37        <ns2:Value>1.3.6.1.4.1.21367.2017.2.3.54</ns2:Value>
38       </ns2:ValueList>
39      </ns2:Slot>   
```

- *repositoryUniqueId*: The unique ID of the repository the document is stored. This value must be used when retrieving documents to display (see **[Retrieve Document Set](../files/RetrieveDocumentSet.md)**).

```
45      <ns2:Slot name="creationTime">
46       <ns2:ValueList>
47        <ns2:Value>20200921112949</ns2:Value>
48       </ns2:ValueList>
49      </ns2:Slot>
```

- *creationTime*: The timestamp the document was uploaded to the patient EPR (or last modified).

```
55      <ns2:Name>
56       <ns2:LocalizedString value="TestdokumentWHO"/>
57      </ns2:Name>
```

- *Name*: The document name to display in the UI.

As explained above, a subset of the relevant metadata are defined in ebXML *Classification* elements. These are:  

```
59      <ns2:Classification
60       classificationScheme="urn:uuid:41a5887f-8865-4c09-adf7-e362475b143a"
61       classifiedObject="urn:uuid:c03c96ca-33a1-44bd-8b8f-b52d8cf69e65"
62       nodeRepresentation="734163000"
63       id="urn:uuid:27952372-8ea3-4502-9730-3aaf50f49970">
64       <ns2:Slot name="codingScheme">
65        <ns2:ValueList>
66         <ns2:Value>2.16.840.1.113883.6.96</ns2:Value>
67        </ns2:ValueList>
68       </ns2:Slot>
69       <ns2:Name>
70        <ns2:LocalizedString value="Care Plan (record artifact)"/>
71       </ns2:Name>
72      </ns2:Classification>   
```

- Class Code: The document Class Code metadata attribute, indicated by the value of the *classificationScheme* equal to
*urn:uuid:41a5887f-8865-4c09-adf7-e362475b143a* as defined in **[IHE ITI Technical Framework Vol. 3, Section 4.2.5.2](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.2)**. The value conveyed with the *nodeRepresentation*
attribute and the *codingScheme* value must match one of the supported values in the Swiss EPR as defined in **[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)**.
- *Name* : The human readable display name of the document class.

```
115      <ns2:Classification
116       classificationScheme="urn:uuid:cccf5598-8b07-4b77-a05e-ae952c785ead"
117       classifiedObject="urn:uuid:c03c96ca-33a1-44bd-8b8f-b52d8cf69e65"
118       nodeRepresentation="394579002"
119       id="urn:uuid:c06cc1de-8f54-43e0-96bc-9f6b75868edf">
120       <ns2:Slot name="codingScheme">
121        <ns2:ValueList>
122         <ns2:Value>2.16.840.1.113883.6.96</ns2:Value>
123        </ns2:ValueList>
124       </ns2:Slot>
125       <ns2:Name>
126        <ns2:LocalizedString value="Cardiology (qualifier value)"/>
127       </ns2:Name>
128      </ns2:Classification>   
```

- Practice Setting Code: The practice setting code the document is regostered with. The value conveyed with the
*nodeRepresentation* attribute and the *codingScheme* value must match one of the supported values in the Swiss EPR as
defined in **[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)**.
- *Name* : The human readable display name of the practice setting code.

```
115      <ns2:Classification
116       classificationScheme="urn:uuid:cccf5598-8b07-4b77-a05e-ae952c785ead"
117       classifiedObject="urn:uuid:c03c96ca-33a1-44bd-8b8f-b52d8cf69e65"
118       nodeRepresentation="394579002"
119       id="urn:uuid:c06cc1de-8f54-43e0-96bc-9f6b75868edf">
120       <ns2:Slot name="codingScheme">
121        <ns2:ValueList>
122         <ns2:Value>2.16.840.1.113883.6.96</ns2:Value>
123        </ns2:ValueList>
124       </ns2:Slot>
125       <ns2:Name>
126        <ns2:LocalizedString value="Cardiology (qualifier value)"/>
127       </ns2:Name>
128      </ns2:Classification>   
```

- Practice Setting Code: The practice setting code the document is registered with. The value conveyed with the
*nodeRepresentation* attribute and the *codingScheme* value must match one of the supported values in the Swiss EPR as
defined in **[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)**.
- *Name* : The human readable display name of the practice setting code.

```
129      <ns2:Classification
130       classificationScheme="urn:uuid:f0306f51-975f-434e-a61c-c59651d33983"
131       classifiedObject="urn:uuid:c03c96ca-33a1-44bd-8b8f-b52d8cf69e65"
132       nodeRepresentation="773130005"
133       id="urn:uuid:24686d21-85a4-43d9-9153-04fa469a50f4">
134       <ns2:Slot name="codingScheme">
135        <ns2:ValueList>
136         <ns2:Value>2.16.840.1.113883.6.96</ns2:Value>
137        </ns2:ValueList>
138       </ns2:Slot>
139       <ns2:Name>
140        <ns2:LocalizedString value="Nursing care plan (record artifact)"/>
141       </ns2:Name>
142      </ns2:Classification>
```

- Document Type Code: The type code of the document. The value conveyed with the *nodeRepresentation* attribute and the
*codingScheme* value must match one of the supported values in the Swiss EPR as defined in **[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)**.
- *Name* : The human readable display name of the document type code.


```
129      <ns2:Classification
130       classificationScheme="urn:uuid:f0306f51-975f-434e-a61c-c59651d33983"
131       classifiedObject="urn:uuid:c03c96ca-33a1-44bd-8b8f-b52d8cf69e65"
132       nodeRepresentation="773130005"
133       id="urn:uuid:24686d21-85a4-43d9-9153-04fa469a50f4">
134       <ns2:Slot name="codingScheme">
135        <ns2:ValueList>
136         <ns2:Value>2.16.840.1.113883.6.96</ns2:Value>
137        </ns2:ValueList>
138       </ns2:Slot>
139       <ns2:Name>
140        <ns2:LocalizedString value="Nursing care plan (record artifact)"/>
141       </ns2:Name>
142      </ns2:Classification>
```

- Document Type Code: The type code of the document. The value conveyed with the *nodeRepresentation* attribute and the
*codingScheme* value must match one of the supported values in the Swiss EPR as defined in **[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)**.
- *Name* : The human readable display name of the document type code.

As explained above, a subset of the relevant metadata are defined in ebXML *ExternalIdentifier* elements. These are:  

```
143      <ns2:ExternalIdentifier
144       registryObject="urn:uuid:c03c96ca-33a1-44bd-8b8f-b52d8cf69e65"
145       identificationScheme="urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab"
146       value="1.3.6.1.4.1.21367.2017.2.1.75.20200922130227623"
147       lid="urn:uuid:8514c34f-1d54-4b94-9a28-a54f7b88b60d"
148       objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:ExternalIdentifier"
149       id="urn:uuid:8514c34f-1d54-4b94-9a28-a54f7b88b60d">
150       <ns2:Name>
151        <ns2:LocalizedString value="XDSDocumentEntry.uniqueId"/>
152       </ns2:Name>
153      </ns2:ExternalIdentifier>
```

- The document unique ID, indicated by the value of the *identificationScheme* equal to *urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab* as defined in **[IHE ITI Technical Framework Vol. 3, Section 4.2.5.2](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.2)**. The value conveyed with the *id* attribute uniquely identifies the document in the repository. It's
value must be used when retrieving documents to display (see **[Retrieve Document Set](../files/RetrieveDocumentSet.md)**).

```
154      <ns2:ExternalIdentifier
155       registryObject="urn:uuid:c03c96ca-33a1-44bd-8b8f-b52d8cf69e65"
156       identificationScheme="urn:uuid:58a6f841-87b3-4a3e-92fd-a8ffeff98427"
157       value="7e1c6e78-58f1-4a43-ae88-0d5a5c4ab43e^^^&amp;1.3.6.1.4.1.21367.2017.2.5.45&amp;ISO"
158       lid="urn:uuid:c38c7f5f-02f2-4eca-841f-5b9eea0b7a95"
159       objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:ExternalIdentifier"
160       id="urn:uuid:c38c7f5f-02f2-4eca-841f-5b9eea0b7a95">
161       <ns2:Name>
162        <ns2:LocalizedString value="XDSDocumentEntry.patientId"/>
163       </ns2:Name>
164      </ns2:ExternalIdentifier>
```

- The master patient ID (XAD-SPID): The value conveyed with the *value* attribute conveys the master patient ID (XAD-SPID)
in the repository. It's value must be used when retrieving documents to display (see **[Retrieve Document Set](../files/RetrieveDocumentSet.md)**).

## Transport Protocol

The primary system shall send the request messages to the registry of the community using the http POST binding as defined
in the **[W3C SOAP specification](https://www.w3.org/TR/2007/REC-soap12-part0-20070427/#L26866)**. It may look like:  

```
POST /RegistryStoredQueryService HTTP/1.1
Host: company.example.org
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
Content-Type: application/soap+xml; charset="utf-8"
Content-Length: nnnn  
```

## Audit Log

Primary systems shall store syslog messages to the audit record repository of the community using TLS transport protocol.
The audit message uses XML formatting as specified in **[RFC 3881](https://tools.ietf.org/html/rfc3881)** with restrictions
specified in the **[IHE ITI TF](https://ehealthsuisse.ihe-europe.net/gss/audit-messages/view.seam?id=697)** and the
**[Extension 1 to Annex5](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/gesetze/anhang_5_ergaenzung_1_epdv_edi_20200415.PDF.download.PDF/Ergaenzung_1_Anhang_5_EPDV-EDI_20200415.pdf.PDF)** in the ordinances of the Swiss electronic patient record (see Section
1.5 "Requirements on ATNA").  

The following snippet shows a example audit message to be written by the primary system:

```
0 <?xml version="1.0"?>
1 <AuditMessage>
2  <EventIdentification EventActionCode="E" EventDateTime="2020-11-17T18:38:36+01:00" EventOutcomeIndicator="0">
3   <EventID csd-code="110112" originalText="Query" codeSystemName="DCM"/>
4   <EventTypeCode csd-code="ITI-18" originalText="Registry Stored Query" codeSystemName="IHE Transactions"/>
5  </EventIdentification>
6  <ActiveParticipant UserID="application" AlternativeUserID="8844" NetworkAccessPointID="127.0.0.1" NetworkAccessPointTypeCode="2">
7   <RoleIDCode csd-code="110153" originalText="Source" codeSystemName="DCM"/>
8  </ActiveParticipant>
9  <ActiveParticipant UserID="mia.muster@domain.com">
10   <RoleIDCode csd-code="HCP" originalText="Heathcare Professional" codeSystemName="DocumentEntry.author.authorRole"/>
11  </ActiveParticipant>
12  <ActiveParticipant UserID="https://service.com/registry" NetworkAccessPointID="127.0.0.1" NetworkAccessPointTypeCode="2">
13   <RoleIDCode csd-code="110152" originalText="Destination" codeSystemName="DCM"/>
14  </ActiveParticipant>
15  <AuditSourceIdentification code="1" AuditSourceID="application"/>
16  <ParticipantObjectIdentification ParticipantObjectID="123456789" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="24">
17   <ParticipantObjectIDTypeCode csd-code="ITI-18" originalText="Registry Stored Query" codeSystemName="IHE Transactions"/>
18   <ParticipantObjectQuery>PHF...!-- omitted for brevity --...yeTo==</ParticipantObjectQuery>
19  </ParticipantObjectIdentification>
20 </AuditMessage>    
```

The message is made of the following blocks:
- *EventIdentification*: Element with event related information including the timestamp.
- *ActiveParticipant*: Element of information related to the primary system performing the query.
- *ActiveParticipant*: Element with information on the authenticated user initiating the request.
- *ActiveParticipant*: Element with information on the responding service endpoint.
- *ParticipantObjectIdentification*: Element with request message related information including a UUencoded copy of the query.

**TODO**:
- use real world example  

# Security Requirements    

To ensure privacy the transction must be secured unsing https with mutual authentication, with X.509 certificates (extended
validation required) and client and server side certifcate validation.

To enable authorization, the transaction must convey the XUA Assertion for authorization in the security header of the SOAP
envelope. See **[Provide X-User Assertion](./ProvideXAssertion.md)** for the implementation details.

Note:
- Some test environments dropped the mutual authentication or TLS for testing purposes. Please contact your test system provider on the details.
- Some test environments may also drop authorization for testing purposes. Please contact your test system provider on the details.  

# Test Opportunity

TODO
