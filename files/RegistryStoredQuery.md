# Registry Stored Query
Transaction to lookup the document metadata for the documents stored in a patient's EPR. Primary systems shall use this transaction to view the metadata of the available documents for to display the data in the UI.   

## Overview

Primary systems shall use this transaction to retrieve the document metadata for the documents stored in a patients EPR.
In the Swiss EPR the [IHE XDS.b](https://profiles.ihe.net/ITI/TF/Volume1/ch-10.html) profile and transactions shall
be used to retrieve the document metadata.

To retrieve the document metadata of the document stored in a patients EPR, the primary system shall perform a
[Registry Stored Query \[ITI-18\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-18.html). The
Registry Stored Query [ITI-18] supports various query parameter as search and filter parameter. The most
common parameter used in the Swiss EPR are the patient ID in CX format and the status information, which must be
*Approved*.

The community responds with the metadata sets of all documents registered in the patient's EPR, which match the search
and filter parameter of the query. The profile is based upon the [ebXML][ebxml] standard. Due to the
genericity of the ebXML standard, the response is not human readable and needs without background information given below.

## Transaction

### Message Semantics

Messages are encoded as described in the [ebXML][ebxml] standard with restrictions defined in the IHE
profile and the ordinances to the Swiss EPR.

#### Request Message

The following snippet is taken from a sample request recorded during the EPR projectathon in September 2020. Some elements
were omitted to increase readability. The raw request file may be found [here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-18_request_raw.xml).

The request message shall be a XML SOAP envelope with the query embedded in the *Body* element of the SOAP envelope.
The SOAP *Header* element conveys the following information:

- *To* element: The URL of the registry stored query service.
- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the query as defined in the IHE ITI Technical Framework.
- *Security* element: The Web Service Security header as defined in the [WS Security][wss] specification. This element conveys the XUA Assertion used for authorization (see [Provide X-User Assertion](ProvideXAssertion.md)).  


The SOAP *Body* element conveys the *AdhocQuery* (lines 15 to 26 below) with the following information:

- *Slot* element with name *$XDSDocumentEntryStatus*: The status filter parameter, which must take the value *urn:oasis:names:tc:ebxml-regrep:StatusType:Approved* (line 18).  
- *Slot* element with name *$XDSDocumentEntryPatientId*: The master patient ID (XAD-PID) of the patient in CX format
(see [PIX Feed](PIXFeed.md)) (line 23).

```xml title="ITI-18_request.xml" linenums="1" hl_lines="18 23"
--8<-- "samples/ITI-18_request.xml"
```

#### Response Message

*TODO* add the originalProvider to the response message.

Since the [ebXML][ebxml] standard is very generic, the response message is quite lengthy and needs some
background information to interpret.

The structure of the result set is as follows (see example below):

- The metadata of the individual documents are bundled in a *ExtrinsicObject* element.
- The metadata attributes are encoded as *Slot*, as *Classification* or as *ExternalIdentifier* elements.
- Metadata attributes encoded as *Slots* can be identified and interpreted by the slot's *name* attribute.
- Metadata attributes encoded as *Classification* can be identified and interpreted by the classification's *classificationScheme* attribute.
- The unique ID of the document is encoded as *ExternalIdentifier*, which has an *identificationScheme* attribute with a fixed value.

The table of the identifier used to indicate the metadata attributes is defined by the metadata model used by IHE XDS.b in [IHE ITI Technical Framework Vol. 3, Section 4.2.5.2](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.2).

The corresponding interpretation of the metadata attributes in the Swiss EPR and the supported value sets may be found in
[Annex 3][annexes] of
the ordinances of the Swiss electronic patient dossier.

A request message is quite lengthy. A listing with abrevations used in the step by step interpretation below is found
[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-18_response.xml). The raw version of the message may
be found [here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-18_response_raw.xml).

#### Message Interpretation

The response message is not very complex, but quite lengthy due to the genericity of the ebXML standard.
Therefore the following step by step interpretation may be of help to interpret the response.

The SOAP *Header* element conveys the following information:

- *Action* element: The SOAP action identifier of the response as defined in the IHE ITI Technical Framework.
- *RelatesTo* element: The *messageID* of the query request (see above).

```xml title="ITI-18_request.xml" linenums="1" hl_lines="18 23"
--8<-- "samples/ITI-18_request.xml"
```

The SOAP *body* element conveys 0..N *ExtrinsicObject* elements, each conveying the metadata of a single document.

```xml linenums="13"
--8<-- "samples/ITI-18_response.xml:13:19"
```

The element has fixed attributes defined in the IHE ITI Technical Framework. Beyond these, the **ExtrinsicObject** conveys the following information for the primary system:

- *mimeType* attribute: The document mime type. It's value must match a mime type supported by the Swiss EPR as defined in
[Annex 3][annexes].
- *status* attribute: The status of the document, which should be *Approved*.  

As explained above, a subset of the relevant metadata are defined in ebXML *slot* elements. These are:   

```
14      <Slot name="repositoryUniqueId"
15       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
16       <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
17        <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">1.1.4567332.1.75</Value>
18       </ValueList>
19      </Slot> 
```

- *repositoryUniqueId*: The unique ID of the repository the document is stored. This value must be used when retrieving documents to display (see **[Retrieve Document Set](../files/RetrieveDocumentSet.md)**).

```
20      <Slot name="hash"
21       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
22       <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
23        <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">a72f1824ea1d57af00faf5dd5ccb9aea0b0ce390</Value>
24       </ValueList>
25      </Slot>
```

- *hash*: The hash value of the binary.

```
26      <Slot name="size"
27       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
28       <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
29        <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">5375</Value>
30       </ValueList>
31      </Slot>
```

- *hash*: The size of the binary.

```
32      <Slot name="creationTime"
33       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
34       <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
35        <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">20231219095121</Value>
36       </ValueList>
37      </Slot>
```

- *creationTime*: The timestamp the document was uploaded to the patient EPR (or last modified).

```
38      <Slot name="languageCode"
39       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
40       <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
41        <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">en</Value>
42       </ValueList>
43      </Slot>
```xml linenums="25"
--8<-- "samples/ITI-18_response.xml:25:29"
```

- *languageCode*: The coded value of the documents language. It's value must match one code value supported by the Swiss
EPR as defined in [Annex 3][annexes].

```xml linenums="35"
--8<-- "samples/ITI-18_response.xml:35:39"
```

- *sourcePatientId*: The local ID of the patient in the document source system which uploaded the document.

```xml linenums="45"
--8<-- "samples/ITI-18_response.xml:45:49"
```

- *urn:e-health-suisse:2020:originalProviderRole*: The Role of original uploader who uploaded the initial version of the document as defined in Attachment 1 to **[Annex 5](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**. This attribute is used to track the initial uploader role which shall never be modified by metadat update transactions.

```xml linenums="55"
--8<-- "samples/ITI-18_response.xml:55:57"
```

- *Name*: The document name to display in the UI.

```
60      <VersionInfo versionName="1"
61       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
```

- the version info to track upadated by metadata update transactions and document replacements. 


A subset of the relevant metadata are defined in ebXML *Classification* elements. These are:  

62      <Classification classificationScheme="urn:uuid:93606bcf-9494-43ec-9b4e-a7748d1a838d" classifiedObject="urn:uuid:1415538d-41bc-41b2-9ae6-8b785f7f3aa6" nodeRepresentation="" id="urn:uuid:e0fcf0a2-f44c-46c5-bc4a-26ac0743f193"
63       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
64       <Slot name="authorPerson"
65        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
66        <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
67         <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">^Max^Mustermann^^^Dr.Med</Value>
68        </ValueList>
69       </Slot>
70       <Slot name="authorRole"
71        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
72        <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
73         <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">HCP^^^&amp;2.16.756.5.30.1.127.3.10.6&amp;ISO</Value>
74        </ValueList>
75       </Slot>
76       <Slot name="authorSpecialty"
77        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
78        <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
79         <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">1050^^^&amp;2.16.756.5.30.1.127.3.5&amp;ISO</Value>
80        </ValueList>
81       </Slot>
82       <VersionInfo versionName="-1"
83        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
84      </Classification>

- authorPerson: The Name of the author of the document binary as defined in **[IHE ITI Technical Framework Vol. 3](https://profiles.ihe.net/ITI/TF/Volume3/)**. 
- authorRole: The Role of the author of the document binary as defined in **[IHE ITI Technical Framework Vol. 3](https://profiles.ihe.net/ITI/TF/Volume3/)** with a code value talen from **[Annex 3](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.
- authorSpeciality: The author speciality of the document binary as defined in **[IHE ITI Technical Framework Vol. 3](https://profiles.ihe.net/ITI/TF/Volume3/)** with a code value talen from **[Annex 3](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.

```xml linenums="59"
--8<-- "samples/ITI-18_response.xml:59:72"
```

- Class Code: The document Class Code metadata attribute, indicated by the value of the *classificationScheme* equal to
*urn:uuid:41a5887f-8865-4c09-adf7-e362475b143a* as defined in [IHE ITI Technical Framework Vol. 3, Section 4.2.5.2](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.2). The value conveyed with the *nodeRepresentation*
attribute and the *codingScheme* value must match one of the supported values in the Swiss EPR as defined in [Annex 3][annexes].
- *Name* : The human readable display name of the document class.

```xml linenums="115"
--8<-- "samples/ITI-18_response.xml:115:128"
```

- Practice Setting Code: The practice setting code the document is registered with. The value conveyed with the
*nodeRepresentation* attribute and the *codingScheme* value must match one of the supported values in the Swiss EPR as
defined in [Annex 3][annexes].
- *Name* : The human readable display name of the practice setting code.

```xml linenums="129"
--8<-- "samples/ITI-18_response.xml:129:142"
```

- Document Type Code: The type code of the document. The value conveyed with the *nodeRepresentation* attribute and the
*codingScheme* value must match one of the supported values in the Swiss EPR as defined in [Annex 3][annexes].
- *Name* : The human readable display name of the document type code.

```
160      <Classification classificationScheme="urn:uuid:f4f85eac-e6cb-4883-b524-f2705394840f" classifiedObject="urn:uuid:1415538d-41bc-41b2-9ae6-8b785f7f3aa6" nodeRepresentation="17621005" id="urn:uuid:4819ee10-581a-49f0-b144-6f85be87b38b"
161       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
162       <Slot name="codingScheme"
163        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
164        <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
165         <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">2.16.840.1.113883.6.96</Value>
166        </ValueList>
167       </Slot>
168       <Name xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
169        <LocalizedString xml:lang="en-US" charset="UTF-8" value="Normal"
170         xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
171       </Name>
172       <VersionInfo versionName="-1"
173        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
174      </Classification>
```

- confidentiality code: The confidentiality of the the document. The value conveyed with the *nodeRepresentation* attribute and the
*codingScheme* value must match one of the supported values in the Swiss EPR as defined in **[Annex 3](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.
- *Name* : The human readable display name of the document confidentiality.


A subset of the relevant metadata are defined in ebXML *ExternalIdentifier* elements. These are:  

```xml linenums="143"
--8<-- "samples/ITI-18_response.xml:143:153"
```

- The document unique ID, indicated by the value of the *identificationScheme* equal to *urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab* as defined in [IHE ITI Technical Framework Vol. 3, Section 4.2.5.2](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.2). The value conveyed with the *id* attribute uniquely identifies the document in the repository. It's
value must be used when retrieving documents to display (see [Retrieve Document Set](RetrieveDocumentSet.md)).

```xml linenums="154"
--8<-- "samples/ITI-18_response.xml:154:164"
```

- The master patient ID (XAD-SPID): The value conveyed with the *value* attribute conveys the master patient ID (XAD-SPID)
in the repository. Its value must be used when retrieving documents to display (see [Retrieve Document Set](RetrieveDocumentSet.md)).

### Transport Protocol

The primary system shall send the request messages to the registry of the community using the http POST binding as defined
in the [W3C SOAP specification][soap]. It may look like:  

```http linenums="1"
POST /RegistryStoredQueryService HTTP/1.1
Host: company.example.org
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
Content-Type: application/soap+xml; charset="utf-8"
Content-Length: nnnn  
```

### Audit Log

Primary systems shall store syslog messages to the audit record repository of the community using TLS transport protocol.
The audit message uses XML formatting as specified in [RFC 3881][rfc3881] with restrictions
specified in the [IHE ITI TF](https://ehealthsuisse.ihe-europe.net/gss/audit-messages/view.seam?id=697) and the
[Extension 1 to Annex5][annexes] in the ordinances of the Swiss electronic patient record (see Section
1.5 "Requirements on ATNA").  

The following snippet shows a example audit message to be written by the primary system:

```xml title="iti-18-log.xml" linenums="55"
--8<-- "samples/iti-18-log.xml"
```

The message is made of the following blocks:

- *EventIdentification*: Event related information including the timestamp.
- *ActiveParticipant*: Information related to the portal or primary system performing the query.
- *ActiveParticipant*: Information on the authenticated user as required by IHE XUA profile.
- *ActiveParticipant*: Information on the authenticated user including the user name who initiated the request.
- *ActiveParticipant*: Information on the responding service endpoint.
- *AuditSourceIdentification*: Information related to the primary system performing the query.
- *ParticipantObjectIdentification*: Request message related information including a BASE-64 encoded copy of the query.
- *ParticipantObjectIdentification*: Information on the patients EPR accessed.

### Security Requirements    

To ensure privacy the transaction must be secured using https with mutual authentication, using X.509 certificates (extended
validation required) and client and server side certificate validation.

To enable authorization, the transaction must convey the XUA Assertion for authorization in the security header of the SOAP
envelope. See [Provide X-User Assertion](ProvideXAssertion.md) for the implementation details.

!!! note
    - Some test environments dropped the mutual authentication or TLS for testing purposes. Please contact your test system provider on the details.
    - Some test environments may also drop authorization for testing purposes. Please contact your test system provider on the details.  

## Test Opportunity

The transaction can be tested with the test suite of the [EPR reference environment](gazelle.md), test systems of the EPR communities or the [EPR Playground](playground.md).
