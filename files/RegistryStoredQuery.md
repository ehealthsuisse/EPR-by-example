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
	* [Audit Log](#audit-log)
- [Security Requirements](#security-requirements)
- [Test Opportunity](#test-opportunity)  

# Overview

Primary systems shall use this transaction to retrieve the document metadata for the documents stored in a patients EPR.
In the Swiss EPR the **[IHE XDS.b](https://profiles.ihe.net/ITI/TF/Volume1/ch-10.html)** profile and transactions shall
be used to retrieve the document metadata.

To retrieve the document metadata of the document stored in a patients EPR, the primary system shall perform a
**[Registry Stored Query \[ITI-18\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-18.html)**. The
Registry Stored Query [ITI-18] supports various query parameter as search and filter parameter. The most
common parameter used in the Swiss EPR are the patient ID in CX format and the status information, which must be
*Approved*.

The community responds with the metadata sets of all documents registered in the patient's EPR, which match the search
and filter parameter of the query. The profile is based upon the **[ebXML](http://www.ebxml.org)** standard. Due to the
genericity of the ebXML standard, the response is not human readable and needs without background information given below.

# Transaction

## Message Semantics

Messages are encoded as described in the **[ebXML](http://www.ebxml.org)** standard with restrictions defined in the IHE
profile and the ordinances to the Swiss EPR.

### Request Message

The following snippet is taken from a sample request recorded during the EPR projectathon in September 2020. Some elements
were omitted to increase readability. The raw request file may be found **[here](../samples/ITI-18_request_raw.xml)**.

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

*TODO* add the originalProvider to the response message.

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
**[Annex 3](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)** of
the ordinances of the Swiss electronic patient dossier.

A request message is quite lengthy. A listing with abrevations used in the step by step interpretation below is found
**[here](../samples/ITI-18_response.xml)**. The raw version of the message may
be found **[here](../samples/ITI-18_response_raw.xml)**.

### Message Interpretation

The response message is not very complex, but quite lengthy due to the genericity of the ebXML standard.
Therefore the following step by step interpretation may be of help to interpret the response.

The SOAP *Header* element conveys the following information:

- *Action* element: The SOAP action identifier of the response as defined in the IHE ITI Technical Framework.
- *RelatesTo* element: The *messageID* of the query request (see above).

```
2  <S:Header>
3   <wsa:Action s:mustUnderstand="1"
4    xmlns:s="http://www.w3.org/2003/05/soap-envelope"
5    xmlns:wsa="http://www.w3.org/2005/08/addressing">urn:ihe:iti:2007:RegistryStoredQueryResponse</wsa:Action>
6   <wsa:RelatesTo xmlns:wsa="http://www.w3.org/2005/08/addressing">urn:uuid:a8313b99-aad5-4880-94d2-4b02197cb650</wsa:RelatesTo>
7  </S:Header>  
```

The SOAP *body* element conveys 0..N *ExtrinsicObject* elements, each conveying the metadata of a single document.

```
12  <ExtrinsicObject mimeType="application/fhir+json" objectType="urn:uuid:7edca82f-054d-47f2-a032-9b2a5b5186c1" id="urn:uuid:1415538d-41bc-41b2-9ae6-8b785f7f3aa6" lid="urn:uuid:1415538d-41bc-41b2-9ae6-8b785f7f3aa6" status="urn:oasis:names:tc:ebxml-regrep:StatusType:Approved" home="urn:oid:1.1.4567334.1.6"
...
193     </ExtrinsicObject>
```

The element has fixed attributes defined in the IHE ITI Technical Framework. Beyond these, the **ExtrinsicObject** conveys the following information for the primary system:

- *mimeType* attribute: The document mime type. It's value must match a mime type supported by the Swiss EPR as defined in
**[Annex 3](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.
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
```

- *languageCode*: The coded value of the documents language. It's value must match one code value supported by the Swiss
EPR as defined in **[Annex 3](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.

```
44      <Slot name="sourcePatientId"
45       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
46       <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
47        <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">CHPAM3946^^^&amp;1.3.6.1.4.1.12559.11.20.1&amp;ISO</Value>
48       </ValueList>
49      </Slot>
```

- *sourcePatientId*: The local ID of the patient in the document source system which uploaded the document.

```
50      <Slot name="urn:e-health-suisse:2020:originalProviderRole"
51       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
52       <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
53        <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">HCP^^^&amp;2.16.756.5.30.1.127.3.10.6&amp;ISO</Value>
54       </ValueList>
55      </Slot>
```

- *urn:e-health-suisse:2020:originalProviderRole*: The Role of original uploader who uploaded the initial version of the document as defined in Attachment 1 to **[Annex 5](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**. This attribute is used to track the initial uploader role which shall never be modified by metadat update transactions.

```
56      <Name xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
57       <LocalizedString charset="UTF-8" value="Vaccination - FSME-Immun 0.25 ml Junior"
58        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
59      </Name>
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

```
85      <Classification classificationScheme="urn:uuid:41a5887f-8865-4c09-adf7-e362475b143a" classifiedObject="urn:uuid:1415538d-41bc-41b2-9ae6-8b785f7f3aa6" nodeRepresentation="184216000" id="urn:uuid:b6a1074e-c92e-4648-9f08-f011b6453689"
86       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
87       <Slot name="codingScheme"
88        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
89        <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
90         <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">2.16.840.1.113883.6.96</Value>
91        </ValueList>
92       </Slot>
93       <Name xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
94        <LocalizedString charset="UTF-8" value="Patient record type (record artifact)"
95         xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
96       </Name>
97       <VersionInfo versionName="-1"
98        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
99      </Classification> 
```

- Class Code: The document Class Code metadata attribute, indicated by the value of the *classificationScheme* equal to
*urn:uuid:41a5887f-8865-4c09-adf7-e362475b143a* as defined in **[IHE ITI Technical Framework Vol. 3, Section 4.2.5.2](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.2)**. The value conveyed with the *nodeRepresentation*
attribute and the *codingScheme* value must match one of the supported values in the Swiss EPR as defined in **[Annex 3](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.
- *Name* : The human readable display name of the document class.

```
115      <Classification classificationScheme="urn:uuid:f33fb8ac-18af-42cc-ae0e-ed0b0bdb91e1" classifiedObject="urn:uuid:1415538d-41bc-41b2-9ae6-8b785f7f3aa6" nodeRepresentation="43741000" id="urn:uuid:84594dc4-814a-495f-94d7-08ee5741bbe3"
116       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
117       <Slot name="codingScheme"
118        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
119        <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
120         <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">2.16.840.1.113883.6.96</Value>
121        </ValueList>
122       </Slot>
123       <Name xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
124        <LocalizedString charset="UTF-8" value="Site of Care (environment)"
125         xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
126       </Name>
127       <VersionInfo versionName="-1"
128        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
129      </Classification>
```

- Healthcare Facility Type Code: The type of the healthcare facility from which the document was registered. The value conveyed with the
*nodeRepresentation* attribute and the *codingScheme* value must match one of the supported values in the Swiss EPR as
defined in **[Annex 3](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.
- *Name* : The human readable display name of the healthcare facility type code.

```
130      <Classification classificationScheme="urn:uuid:cccf5598-8b07-4b77-a05e-ae952c785ead" classifiedObject="urn:uuid:1415538d-41bc-41b2-9ae6-8b785f7f3aa6" nodeRepresentation="394802001" id="urn:uuid:56fd7e42-192f-4c6b-a2ca-ad0cb9f93e42"
131       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
132       <Slot name="codingScheme"
133        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
134        <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
135         <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">2.16.840.1.113883.6.96</Value>
136        </ValueList>
137       </Slot>
138       <Name xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
139        <LocalizedString charset="UTF-8" value="General medicine (qualifier value)"
140         xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
141       </Name>
142       <VersionInfo versionName="-1"
143        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
144      </Classification> 
```

- Practice Setting Code: The practice setting code the document is registered with. The value conveyed with the
*nodeRepresentation* attribute and the *codingScheme* value must match one of the supported values in the Swiss EPR as
defined in **[Annex 3](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.
- *Name* : The human readable display name of the practice setting code.

```
145      <Classification classificationScheme="urn:uuid:f0306f51-975f-434e-a61c-c59651d33983" classifiedObject="urn:uuid:1415538d-41bc-41b2-9ae6-8b785f7f3aa6" nodeRepresentation="41000179103" id="urn:uuid:bb58016b-ec14-498f-9969-a9a8e6b1ab03"
146       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
147       <Slot name="codingScheme"
148        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
149        <ValueList xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
150         <Value xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">2.16.840.1.113883.6.96</Value>
151        </ValueList>
152       </Slot>
153       <Name xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
154        <LocalizedString charset="UTF-8" value="Immunization Record (record artifact)"
155         xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
156       </Name>
157       <VersionInfo versionName="-1"
158        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
159      </Classification>
```

- Document Type Code: The type code of the document. The value conveyed with the *nodeRepresentation* attribute and the
*codingScheme* value must match one of the supported values in the Swiss EPR as defined in **[Annex 3](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.
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

```
175      <ExternalIdentifier registryObject="urn:uuid:1415538d-41bc-41b2-9ae6-8b785f7f3aa6" identificationScheme="urn:uuid:58a6f841-87b3-4a3e-92fd-a8ffeff98427" value="CHPAM3946^^^&amp;1.3.6.1.4.1.12559.11.20.1&amp;ISO" id="urn:uuid:a019bc95-f172-42cf-af20-38406d848c5b"
176       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
177       <Name xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
178        <LocalizedString value="XDSDocumentEntry.patientId"
179         xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
180       </Name>
181       <VersionInfo versionName="-1"
182        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
183      </ExternalIdentifier>
```

- The master patient ID (XAD-SPID): The value conveyed with the *value* attribute conveys the master patient ID (XAD-SPID)
in the repository. Its value must be used when retrieving documents to display (see **[Retrieve Document Set](../files/RetrieveDocumentSet.md)**).

```
184      <ExternalIdentifier registryObject="urn:uuid:1415538d-41bc-41b2-9ae6-8b785f7f3aa6" identificationScheme="urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab" value="2.25.306443472873218838784535217290635593269" id="urn:uuid:b37c4f57-e554-43fb-ab34-8f74dfc5376a"
185       xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
186       <Name xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
187        <LocalizedString value="XDSDocumentEntry.uniqueId"
188         xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
189       </Name>
190       <VersionInfo versionName="-1"
191        xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"/>
192      </ExternalIdentifier>
```

- The document unique ID, indicated by the value of the *identificationScheme* equal to *urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab* as defined in **[IHE ITI Technical Framework Vol. 3, Section 4.2.5.2](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.2)**. The value conveyed with the *id* attribute uniquely identifies the document in the repository. It's
value must be used when retrieving documents to display (see **[Retrieve Document Set](../files/RetrieveDocumentSet.md)**).

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
**[Extension 1 to Annex5](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)** in the ordinances of the Swiss electronic patient record (see Section
1.5 "Requirements on ATNA").  

The following snippet shows a example audit message to be written by the primary system:

```
<AuditMessage>
  <EventIdentification EventActionCode="E" EventDateTime="2023-09-11T14:18:27.579+02:00" EventOutcomeIndicator="0">
    <EventID csd-code="110112" codeSystemName="DCM" originalText="Query" />
    <EventTypeCode csd-code="ITI-18" codeSystemName="IHE Transactions" originalText="Registry Stored Query" />
    <PurposeOfUse csd-code="NORM" codeSystemName="2.16.756.5.30.1.127.3.10.5" originalText="Normaler Zugriff" />
  </EventIdentification>
  <ActiveParticipant UserID="761337610410035724" UserName="&lt;761337610410035724@http://ith-icoserve.com/eHealthSolutionsSTS&gt;"/>
  <ActiveParticipant UserID="761337610410035724" UserName="Andreas Friederich TANNER-WELTI" UserIsRequestor="true">
    <RoleIDCode csd-code="PAT" codeSystemName="2.16.756.5.30.1.127.3.10.6" originalText="Patient" />
  </ActiveParticipant>
  <ActiveParticipant UserID="http://www.w3.org/2005/08/addressing/anonymous" AlternativeUserID="20559@epd-test.ith-icoserve.com.ForkJoinPool-5-worker-3" UserIsRequestor="true" NetworkAccessPointID="81.223.215.43" NetworkAccessPointTypeCode="2">
    <RoleIDCode csd-code="110153" codeSystemName="DCM" originalText="Source" />
  </ActiveParticipant>
  <ActiveParticipant UserID="https://localhost:7443/Registry/services/RegistryService" UserIsRequestor="false" NetworkAccessPointID="localhost" NetworkAccessPointTypeCode="1">
    <RoleIDCode csd-code="110152" codeSystemName="DCM" originalText="Destination" />
  </ActiveParticipant>
  <AuditSourceIdentification AuditEnterpriseSiteID="1.3.6.1.4.1.21367.2017.2.6.19" AuditSourceID="1.3.6.1.4.1.12559.11.20.1">
    <AuditSourceTypeCode csd-code="4" codeSystemName="1.3.6.1.4.1.9784.999200" originalText="ITH icoserve information technology for healthcare sense (tm)" />
  </AuditSourceIdentification>
  <ParticipantObjectIdentification ParticipantObjectID="d5e42fed-5962-4bb9-b8b6-5d9e8afb0f2a^^^&amp;1.3.6.1.4.1.21367.2017.2.5.93&amp;ISO" ParticipantObjectTypeCode="1" ParticipantObjectTypeCodeRole="1">
    <ParticipantObjectIDTypeCode csd-code="2" codeSystemName="RFC-3881" originalText="Patient Number" />
  </ParticipantObjectIdentification>
  <ParticipantObjectIdentification ParticipantObjectID="urn:uuid:10b545ea-725c-446d-9b95-8aeb444eddf3" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="24">
    <ParticipantObjectIDTypeCode csd-code="ITI-18" codeSystemName="IHE Transactions" originalText="Registry Stored Query" />
    <ParticipantObjectQuery>PD94bWwgdmV ... zdD4=</ParticipantObjectQuery>
    <ParticipantObjectDetail type="QueryEncoding" value="VVRGLTg=" />
    <ParticipantObjectDetail type="urn:ihe:iti:xca:2010:homeCommunityId" value="MS4zLjYuMS40LjEuMjEzNjcuMjAxNy4yLjYuMTk=" />
  </ParticipantObjectIdentification>
</AuditMessage>
```

The message is made of the following blocks:
- *EventIdentification*: Event related information including the timestamp.
- *ActiveParticipant*: Information related to the portal or primary system performing the query.
- *ActiveParticipant*: Information on the authenticated user as required by IHE XUA profile.
- *ActiveParticipant*: Information on the authenticated user including the user name who initiated the request.
- *ActiveParticipant*: Information on the responding service endpoint.
- *AuditSourceIdentification*: Information related to the primary system performing the query.
- *ParticipantObjectIdentification*: Request message related information including a UUencoded copy of the query.
- *ParticipantObjectIdentification*: Information on the patients EPR accessed and the base64 encoded query (ommitted for brevity).

# Security Requirements    

To ensure privacy the transaction must be secured using https with mutual authentication, using X.509 certificates (extended
validation required) and client and server side certificate validation.

To enable authorization, the transaction must convey the XUA Assertion for authorization in the security header of the SOAP
envelope. See **[Provide X-User Assertion](./ProvideXAssertion.md)** for the implementation details.

Note:
- Some test environments dropped the mutual authentication or TLS for testing purposes. Please contact your test system provider on the details.
- Some test environments may also drop authorization for testing purposes. Please contact your test system provider on the details.  

# Test Opportunity

The transaction can be tested with the test suite of the **[EPR reference environment](./gazelle.md)**, test systems of the EPR communities or the **[EPR Playground](./playground.md)**.
