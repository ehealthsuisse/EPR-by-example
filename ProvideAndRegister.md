# Provide and Register Document Set
Transaction to store one or more documents to a community. Primary systems shall use this transaction to export documents and the to a community repository to add it to a patients EPR.  

**CONTENTS**

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

Primary systems shall use this transaction to provide documents and the related document metadata to a patient EPR. In the Swiss EPR the **[IHE XDS.b](https://profiles.ihe.net/ITI/TF/Volume1/ch-10.html)** profile and transactions shall be used.

To store the document metadata of the document, the the primary system shall perform a **[Provide And Register Document Set \[ITI-41\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-41.html)** transaction. Within the request, the primary systems shall provide the master patient ID as retrieved from the **[PIX Query](../main/PIXQuery.md)**, the document metadata as defined in the ordinances of the Swiss EPR and the binary data of the document.  

The community responds with a code indicating the successful registration of the document. 

# Transaction 

## Message Semantics

Messages are encoded as described in the **[ebXML](http://www.ebxml.org)** standard with restictions defined in the IHE profile and the ordinances to the Swiss EPR. 

### Request Message

Since the **[ebXML](http://www.ebxml.org)** standard is very generic, the request message is quite lengthy and needs some background information to interpret. 

The structure of the result set is as follows (see example below): 
- The metadata of the individual documents are bundled in a *ExtrinsicObject* element.
- The metadata attributes are encoded as *Slot*, as *Classification* or as *ExternalIdentifier* elements. 
- Metadata attributes encoded as *Slots* can be identified and interpreted by the slot's *name* attribute. 
- Metadata attributes encoded as *Classification* can be identified and interpreted by the classification's *classificationScheme* attribute.
- The unique ID of the document is encoded as *ExternalIdentifier*, which has an *identificationScheme* attribute with a fixed value.

The table of the identifier used to indicate the metadata attributes is defined by the metadata model used by IHE XDS.b in **[IHE ITI Technical Framework Vol. 3, Section 4.2.5.1](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.1)** and **[IHE ITI Technical Framework Vol. 3, Section 4.2.5.2](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.2)** . 

The corresponding interpretation of the metadata attributes in the Swiss EPR and the supported value sets may be found in **[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)** of the ordinances of the Swiss electronic patient dossier.

A request message is quite lengthy. A listing with abbrevations used in the step by step interpretation below is found **[here](https://github.com/msmock/AnnotatedTX/blob/main/samples/ITI-41_request.xml)**. The raw version of the request message may be found **[here](https://github.com/msmock/AnnotatedTX/blob/main/samples/ITI-41_request.xml)**. 

### Message Interpretation

The request message is not complex in nature, but quite lengthy due to the genericity of the ebXML standard. 
Therefore the following step by step interpretation may be of help to interpret the response. 

The SOAP *Header* element conveys the following information: 

- *To* element: The URL of the provide an register document set service. 
- *MessageID* element: a UUID of the message. 
- *Action* element: The SOAP action identifier of the request as defined in the IHE ITI Technical Framework. 
- *Security* element: The Web Service Security header as defined in the **[WS Security](http://docs.oasis-open.org/wss-m/wss/v1.1.1/os/wss-SOAPMessageSecurity-v1.1.1-os.html)** specification. This element conveys the XUA Assertion used for authorization (see **[Provide X-User Assertion](../main/ProvideXAssertion.md)**).  

```
3  <soapenv:Header>
4   <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true">
5    <saml2:Assertion>
6     <!-- ommitted for brevity -->
7    </saml2:Assertion>
8   </wsse:Security>
9   <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing">urn:ihe:iti:2007:ProvideAndRegisterDocumentSet-b</wsa:Action>
10  <wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing">d22ebb69-8368-4eb6-929b-b382f1b37c72</wsa:MessageID>
11  </soapenv:Header>    
```

The SOAP *Body* element conveys the folowing objects in ebXML syntax: 

- *RegistryRegistryPackage* defining the submission set and it's metadata.
- *ExtrinsicObject* defining the document metadata (matches the document metadata interpretation in **[Registry Stored Query](../main/RegistryStoredQuery.md#response-message)**).
- *Association* linking the document metadata to the submission set.  

We will explain the *RegistryRegistryPackage* object defining the submission set first. For the other elements, see below.  

#### Submission Set

The structure of the *RegistryRegistryPackage* object defining the submission set is as follows (see example below): 
- The metadata attributes are encoded as *Slot*, as *Classification* or as *ExternalIdentifier* elements. 
- Metadata attributes encoded as *Slots* can be identified and interpreted by the slot's *name* attribute. 
- Metadata attributes encoded as *Classification* can be identified and interpreted by the classification's *classificationScheme* attribute.
- The unique ID of the document is encoded as *ExternalIdentifier*, which has an *identificationScheme* attribute with a fixed value.

The *RegistryRegistryPackage* object defining the submission set has one *Slot* child elements with name *submissionTime* which conveys the request timestamp, and a *Name* element to convey the display name of the submission set (see lines 17 to 25 below). 

```
17      <rim:RegistryPackage id="6BCBAF38-3D23-CC4C-80F3-30779B1174E3" objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:RegistryPackage">
18       <rim:Slot name="submissionTime">
19        <rim:ValueList>
20         <rim:Value>20200924174309</rim:Value>
21        </rim:ValueList>
22       </rim:Slot>
23       <rim:Name>
24        <rim:LocalizedString value="DocumentSet"/>
25       </rim:Name>

```

The *RegistryRegistryPackage* object defining the submission set has three *Classification* child elements conveying the submission set metadata: 

- Content Type Code: The submission set content type code attribute, indicated by the value of the classificationScheme equal to *urn:uuid:aa543740-bdda-424e-8c96-df4873be8500*. The value conveyed with the nodeRepresentation attribute and the codingScheme value must match one of the supported values in the Swiss EPR as defined in Annex 3.
- submission author: The submission set author element, indicated by the value of the classificationScheme equal to *urn:uuid:a7058bb9-b4e4-4307-ba5b-e3f0ab85e12d*. The author element is optional in the EPR. If present, it shall convey the information on the person, which initated the request. 
- submission set identificator: An element with classification scheme *urn:uuid:a54d6aa5-d40d-43f9-88c5-b4633d873bdd* required to identify the *RegistryPackage* object as a XDS.b submission set.

```
26       <rim:Classification
27        classificationScheme="urn:uuid:aa543740-bdda-424e-8c96-df4873be8500"
28        classifiedObject="6BCBAF38-3D23-CC4C-80F3-30779B1174E3"
29        id="517159EC-2731-F908-83DC-B90251B0E9AF"
30        nodeRepresentation="424975005">
31        <rim:Slot name="codingScheme">
32         <rim:ValueList>
33          <rim:Value>2.16.840.1.113883.6.96</rim:Value>
34         </rim:ValueList>
35        </rim:Slot>
36        <rim:Name>
37         <rim:LocalizedString value="Other EPD-document type"/>
38        </rim:Name>
39       </rim:Classification>
40       <rim:Classification
41        classificationScheme="urn:uuid:a7058bb9-b4e4-4307-ba5b-e3f0ab85e12d"
42        classifiedObject="6BCBAF38-3D23-CC4C-80F3-30779B1174E3"
43        id="58089FCD-E400-D25A-73C2-2F6B5DCBBE2E"
44        nodeRepresentation=""
45        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
46        <rim:Slot name="authorPerson">
47         <rim:ValueList>
48          <rim:Value>^Schulz^Max^^^</rim:Value>
49         </rim:ValueList>
50        </rim:Slot>
51        <rim:Slot name="authorRole">
52         <rim:ValueList>
53          <rim:Value>Healthcare professional</rim:Value>
54         </rim:ValueList>
55        </rim:Slot>
56        <rim:Name>
57         <rim:LocalizedString value="XDSSubmissionSet.author"/>
58        </rim:Name>
59       </rim:Classification>
60       <rim:Classification
61        classificationNode="urn:uuid:a54d6aa5-d40d-43f9-88c5-b4633d873bdd"
62        classifiedObject="6BCBAF38-3D23-CC4C-80F3-30779B1174E3"
63        id="B6E18810-CD5B-3DCB-1B07-E510FE593365"
64        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification"/>
```

The *RegistryRegistryPackage* object defining the submission set has three *ExternalIdentifier* child elements: 

- *XDSSubmissionSet.sourceId*: Conveys the OID of the primary system performing the request. 
- *XDSSubmissionSet.uniqueId*: Conveys a UUID of the submission set. 
- *XDSSubmissionSet.patientId*: The master patient ID (XAD-PID) of the patient in CX format (see **[PIX Feed](../main/PIXFeed.md)**). 

```
65       <rim:ExternalIdentifier
66        id="013AD74B-3180-8B49-9D51-440F3C9B16B8"
67        identificationScheme="urn:uuid:554ac39e-e3fe-47fe-b233-965d2a147832"
68        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:ExternalIdentifier"
69        registryObject="6BCBAF38-3D23-CC4C-80F3-30779B1174E3"
70        value="1.3.6.1.4.1.21367.2017.2.5.45">
71        <rim:Name>
72         <rim:LocalizedString value="XDSSubmissionSet.sourceId"/>
73        </rim:Name>
74       </rim:ExternalIdentifier>
75       <rim:ExternalIdentifier
76        id="1AF2498A-C98E-5123-970E-F28AC2BCC536"
77        identificationScheme="urn:uuid:96fdda7c-d067-4183-912e-bf5ee74998a8"
78        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:ExternalIdentifier"
79        registryObject="6BCBAF38-3D23-CC4C-80F3-30779B1174E3"
80        value="1.42.1.2018072257142615.7000">
81        <rim:Name>
82         <rim:LocalizedString value="XDSSubmissionSet.uniqueId"/>
83        </rim:Name>
84       </rim:ExternalIdentifier>
85       <rim:ExternalIdentifier
86        id="2A8B3E1A-203C-5313-1FAA-EA2577C235B6"
87        identificationScheme="urn:uuid:6b5aea1a-874d-4603-a4bc-96a0a7b38446"
88        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:ExternalIdentifier"
89        registryObject="6BCBAF38-3D23-CC4C-80F3-30779B1174E3"
90        value="0936c240-486e-4839-a322-793de7185f99^^^&amp;1.3.6.1.4.1.21367.2017.2.5.45&amp;ISO">
91        <rim:Name>
92         <rim:LocalizedString value="XDSSubmissionSet.patientId"/>
93        </rim:Name>
94       </rim:ExternalIdentifier>
95      </rim:RegistryPackage>
```

#### Document Metadata

HERE: same interpretation as in **[RegistryStoredQuery](../main/RegistryStoredQuery.md#message-interpretation)**

TODO: delete listing when done

```
96 
97      <rim:ExtrinsicObject
98       id="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
99       mimeType="application/pdf"
100       objectType="urn:uuid:7edca82f-054d-47f2-a032-9b2a5b5186c1"
101       status="urn:oasis:names:tc:ebxml-regrep:StatusType:Approved">
102       <rim:Name>
103        <rim:LocalizedString value="Test document"/>
104       </rim:Name>
105       <rim:Slot name="languageCode">
106        <rim:ValueList>
107         <rim:Value>de-CH</rim:Value>
108        </rim:ValueList>
109       </rim:Slot>
110       <rim:Slot name="creationTime">
111        <rim:ValueList>
112         <rim:Value>20200924174309</rim:Value>
113        </rim:ValueList>
114       </rim:Slot>
115       <rim:Slot name="repositoryUniqueId">
116        <rim:ValueList>
117         <rim:Value>1.3.6.1.4.1.21367.2017.2.3.57</rim:Value>
118        </rim:ValueList>
119       </rim:Slot>
120       <rim:Slot name="serviceStartTime">
121        <rim:ValueList>
122         <rim:Value>20180521</rim:Value>
123        </rim:ValueList>
124       </rim:Slot>
125       <rim:Slot name="serviceStopTime">
126        <rim:ValueList>
127         <rim:Value>20180606</rim:Value>
128        </rim:ValueList>
129       </rim:Slot>
130       <rim:Slot name="sourcePatientInfo">
131        <rim:ValueList>
132         <rim:Value>PID-8|male</rim:Value>
133        </rim:ValueList>
134       </rim:Slot>
135       <rim:Slot name="sourcePatientId">
136        <rim:ValueList>
137         <rim:Value>0936c240-486e-4839-a322-793de7185f99^^^&amp;1.3.6.1.4.1.21367.2017.2.5.45&amp;ISO</rim:Value>
138        </rim:ValueList>
139       </rim:Slot>
140       <rim:Classification
141        classificationScheme="urn:uuid:41a5887f-8865-4c09-adf7-e362475b143a"
142        classifiedObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
143        id="E0C43B15-229A-D665-6B45-A340E6C02AED"
144        nodeRepresentation="417319006"
145        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
146        <rim:Slot name="codingScheme">
147         <rim:ValueList>
148          <rim:Value>2.16.840.1.113883.6.96</rim:Value>
149         </rim:ValueList>
150        </rim:Slot>
151        <rim:Name>
152         <rim:LocalizedString value="Record of health event (record artifact)"/>
153        </rim:Name>
154       </rim:Classification>
155       <rim:Classification
156        classificationScheme="urn:uuid:f4f85eac-e6cb-4883-b524-f2705394840f"
157        classifiedObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
158        id="BFB4DF4A-B868-43CF-B4A4-1CFC4C849EDE"
159        nodeRepresentation="17621005"
160        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
161        <rim:Slot name="codingScheme">
162         <rim:ValueList>
163          <rim:Value>2.16.840.1.113883.6.96</rim:Value>
164         </rim:ValueList>
165        </rim:Slot>
166        <rim:Name>
167         <rim:LocalizedString value="Technical user"/>
168        </rim:Name>
169       </rim:Classification>
170       <rim:Classification
171        classificationScheme="urn:uuid:a09d5840-386c-46f2-b5ad-9c3699a4309d"
172        classifiedObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
173        id="C4F066D3-EEE7-A18E-E324-642621B4A1E6"
174        nodeRepresentation="urn:che:epr:EPR_Unstructured_Document"
175        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
176        <rim:Slot name="codingScheme">
177         <rim:ValueList>
178          <rim:Value>2.16.756.5.30.1.127.3.10.10</rim:Value>
179         </rim:ValueList>
180        </rim:Slot>
181        <rim:Name>
182         <rim:LocalizedString charset="UTF-8" value="Unstructured EPR document"/>
183        </rim:Name>
184       </rim:Classification>
185       <rim:Classification
186        classificationScheme="urn:uuid:f33fb8ac-18af-42cc-ae0e-ed0b0bdb91e1"
187        classifiedObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
188        id="D83981AD-CA1E-8D30-2D47-7C95CCA35C87"
189        nodeRepresentation="22232009"
190        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
191        <rim:Slot name="codingScheme">
192         <rim:ValueList>
193          <rim:Value>2.16.840.1.113883.6.96</rim:Value>
194         </rim:ValueList>
195        </rim:Slot>
196        <rim:Name>
197         <rim:LocalizedString value="Hospital (environment)"/>
198        </rim:Name>
199       </rim:Classification>
200       <rim:Classification
201        classificationScheme="urn:uuid:cccf5598-8b07-4b77-a05e-ae952c785ead"
202        classifiedObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
203        id="22B7D0FC-8BEF-CA02-CE91-8D51501034E3"
204        nodeRepresentation="394802001"
205        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
206        <rim:Slot name="codingScheme">
207         <rim:ValueList>
208          <rim:Value>2.16.840.1.113883.6.96</rim:Value>
209         </rim:ValueList>
210        </rim:Slot>
211        <rim:Name>
212         <rim:LocalizedString value="General medicine (qualifier value)"/>
213        </rim:Name>
214       </rim:Classification>
215       <rim:Classification
216        classificationScheme="urn:uuid:f0306f51-975f-434e-a61c-c59651d33983"
217        classifiedObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
218        id="6C4198FD-FA36-BE2C-A60A-B41A641BAE99"
219        nodeRepresentation="721912009"
220        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
221        <rim:Slot name="codingScheme">
222         <rim:ValueList>
223          <rim:Value>2.16.840.1.113883.6.96</rim:Value>
224         </rim:ValueList>
225        </rim:Slot>
226        <rim:Name>
227         <rim:LocalizedString charset="UTF-8" value="Medication summary document (record artifact)"/>
228        </rim:Name>
229       </rim:Classification>
230       <rim:Classification
231        classificationScheme="urn:uuid:93606bcf-9494-43ec-9b4e-a7748d1a838d"
232        classifiedObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
233        id="F0410AF2-D25F-A2C3-5FCB-FDEAA7276858"
234        nodeRepresentation=""
235        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
236        <rim:Slot name="authorPerson">
237         <rim:ValueList>
238          <rim:Value>^Schulz^Max^^^</rim:Value>
239         </rim:ValueList>
240        </rim:Slot>
241        <rim:Slot name="authorRole">
242         <rim:ValueList>
243          <rim:Value>HCP</rim:Value>
244         </rim:ValueList>
245        </rim:Slot>
246        <rim:Slot name="authorSpecialty">
247         <rim:ValueList>
248          <rim:Value>General Internal Medicine</rim:Value>
249         </rim:ValueList>
250        </rim:Slot>
251        <rim:Name>
252         <rim:LocalizedString value="XDSDocumentEntry.author"/>
253        </rim:Name>
254       </rim:Classification>
255       <rim:ExternalIdentifier
256        id="BD35CAC2-F290-7938-61FD-E90BE04AABEE"
257        identificationScheme="urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab"
258        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:ExternalIdentifier"
259        registryObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
260        value="1.3.6.1.4.1.21367.2017.2.1.99.1.42.1.20112312375405215170610.8012">
261        <rim:Name>
262         <rim:LocalizedString value="XDSDocumentEntry.uniqueId"/>
263        </rim:Name>
264       </rim:ExternalIdentifier>
265       <rim:ExternalIdentifier
266        id="7DF56AE8-3673-2224-4E47-5C0838D8EC8B"
267        identificationScheme="urn:uuid:58a6f841-87b3-4a3e-92fd-a8ffeff98427"
268        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:ExternalIdentifier"
269        registryObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
270        value="0936c240-486e-4839-a322-793de7185f99^^^&amp;1.3.6.1.4.1.21367.2017.2.5.45&amp;ISO">
271        <rim:Name>
272         <rim:LocalizedString value="XDSDocumentEntry.patientId"/>
273        </rim:Name>
274       </rim:ExternalIdentifier>
275      </rim:ExtrinsicObject>
```

#### Association

```
277      <rim:Association
278       associationType="urn:oasis:names:tc:ebxml-regrep:AssociationType:HasMember"
279       id="5A36769E-DE9B-3A3F-9F37-CD6B962BAFB6"
280       sourceObject="6BCBAF38-3D23-CC4C-80F3-30779B1174E3"
281       targetObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546">
282       <rim:Slot name="SubmissionSetStatus">
283        <rim:ValueList>
284         <rim:Value>Original</rim:Value>
285        </rim:ValueList>
286       </rim:Slot>
287      </rim:Association>   
```

### Response Message

TBD

## Transport Protocol

```
POST /XDSDocumentRepositoryService HTTP/1.1
Host: 10.2.101.10:11076
Content-Type: multipart/related; boundary="MIMEBoundary_05b39a33e8effeb90c1ccb1c58c4b93b5af2935a13853149"; type="application/xop+xml"; start="<0.15b39a33e8effeb90c1ccb1c58c4b93b5af2935a13853149@apache.org>"; start-info="application/soap+xml"; action="urn:ihe:iti:2007:ProvideAndRegisterDocumentSet-b"
Connection: Keep-Alive
Content-Length: 181931

--MIMEBoundary_05b39a33e8effeb90c1ccb1c58c4b93b5af2935a13853149
Content-Type: application/xop+xml; charset=utf-8; type="application/soap+xml"
Content-Transfer-Encoding: binary
Content-ID: <0.15b39a33e8effeb90c1ccb1c58c4b93b5af2935a13853149@apache.org>

<!-- message ommittedd -->

--MIMEBoundary_05b39a33e8effeb90c1ccb1c58c4b93b5af2935a13853149
Content-Type: application/octet-stream
Content-Transfer-Encoding: binary
Content-ID: <1.c5b39a33e8effeb94a97121c58c4b93b53d2935a13853149@apache.org>

<!-- binary document data ommitted -->

--MIMEBoundary_05b39a33e8effeb90c1ccb1c58c4b93b5af2935a13853149--

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