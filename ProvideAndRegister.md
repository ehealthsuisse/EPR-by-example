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

The table of the identifier used to indicate the metadata attributes is defined by the metadata model used by IHE XDS.b in **[IHE ITI Technical Framework Vol. 3, Section 4.2.5.2](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.2)**. 

The corresponding interpretation of the metadata attributes in the Swiss EPR and the supported value sets may be found in **[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)** of the ordinances of the Swiss electronic patient dossier.

The listing below displays a full request message. For a step by step interpretion, see section below. The raw version of the message may be found **[here]()**. 

```
0 <?xml version='1.0' encoding='utf-8'?>
1 <soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope">
2  <soapenv:Header>
3   <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true">
4    <saml2:Assertion>
5     <!-- ommitted for brevity -->
6    </saml2:Assertion>
7   </wsse:Security>
8   <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing">urn:ihe:iti:2007:ProvideAndRegisterDocumentSet-b</wsa:Action>
9   <wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing">d22ebb69-8368-4eb6-929b-b382f1b37c72</wsa:MessageID>
10  </soapenv:Header>
11  <soapenv:Body>
12   <xdsb:ProvideAndRegisterDocumentSetRequest xmlns:xdsb="urn:ihe:iti:xds-b:2007" xmlns:xop="http://www.w3.org/2004/08/xop/include" xmlns:rs="urn:oasis:names:tc:ebxml-regrep:xsd:rs:3.0">
13    <lcm:SubmitObjectsRequest xmlns:lcm="urn:oasis:names:tc:ebxml-regrep:xsd:lcm:3.0">
14     <rim:RegistryObjectList xmlns:rim="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0">
15      <rim:RegistryPackage id="6BCBAF38-3D23-CC4C-80F3-30779B1174E3" objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:RegistryPackage">
16       <rim:Slot name="submissionTime">
17        <rim:ValueList>
18         <rim:Value>20200924174309</rim:Value>
19        </rim:ValueList>
20       </rim:Slot>
21       <rim:Name>
22        <rim:LocalizedString value="DocumentSet"/>
23       </rim:Name>
24       <rim:Classification classificationScheme="urn:uuid:aa543740-bdda-424e-8c96-df4873be8500" classifiedObject="6BCBAF38-3D23-CC4C-80F3-30779B1174E3" id="517159EC-2731-F908-83DC-B90251B0E9AF" nodeRepresentation="424975005">
25        <rim:Slot name="codingScheme">
26         <rim:ValueList>
27          <rim:Value>2.16.840.1.113883.6.96</rim:Value>
28         </rim:ValueList>
29        </rim:Slot>
30        <rim:Name>
31         <rim:LocalizedString value="Other EPD-document type"/>
32        </rim:Name>
33       </rim:Classification>
34       <rim:Classification
35        classificationScheme="urn:uuid:a7058bb9-b4e4-4307-ba5b-e3f0ab85e12d"
36        classifiedObject="6BCBAF38-3D23-CC4C-80F3-30779B1174E3"
37        id="58089FCD-E400-D25A-73C2-2F6B5DCBBE2E"
38        nodeRepresentation=""
39        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
40        <rim:Slot name="authorPerson">
41         <rim:ValueList>
42          <rim:Value>^Schulz^Max^^^</rim:Value>
43         </rim:ValueList>
44        </rim:Slot>
45        <rim:Slot name="authorRole">
46         <rim:ValueList>
47          <rim:Value>Healthcare professional</rim:Value>
48         </rim:ValueList>
49        </rim:Slot>
50        <rim:Name>
51         <rim:LocalizedString value="XDSSubmissionSet.author"/>
52        </rim:Name>
53       </rim:Classification>
54       <rim:Classification
55        classificationNode="urn:uuid:a54d6aa5-d40d-43f9-88c5-b4633d873bdd"
56        classifiedObject="6BCBAF38-3D23-CC4C-80F3-30779B1174E3"
57        id="B6E18810-CD5B-3DCB-1B07-E510FE593365"
58        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification"/>
59       <rim:ExternalIdentifier
60        id="013AD74B-3180-8B49-9D51-440F3C9B16B8"
61        identificationScheme="urn:uuid:554ac39e-e3fe-47fe-b233-965d2a147832"
62        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:ExternalIdentifier"
63        registryObject="6BCBAF38-3D23-CC4C-80F3-30779B1174E3"
64        value="1.3.6.1.4.1.21367.2017.2.5.45">
65        <rim:Name>
66         <rim:LocalizedString value="XDSSubmissionSet.sourceId"/>
67        </rim:Name>
68       </rim:ExternalIdentifier>
69       <rim:ExternalIdentifier
70        id="1AF2498A-C98E-5123-970E-F28AC2BCC536"
71        identificationScheme="urn:uuid:96fdda7c-d067-4183-912e-bf5ee74998a8"
72        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:ExternalIdentifier"
73        registryObject="6BCBAF38-3D23-CC4C-80F3-30779B1174E3"
74        value="1.42.1.2018072257142615.7000">
75        <rim:Name>
76         <rim:LocalizedString value="XDSSubmissionSet.uniqueId"/>
77        </rim:Name>
78       </rim:ExternalIdentifier>
79       <rim:ExternalIdentifier
80        id="2A8B3E1A-203C-5313-1FAA-EA2577C235B6"
81        identificationScheme="urn:uuid:6b5aea1a-874d-4603-a4bc-96a0a7b38446"
82        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:ExternalIdentifier"
83        registryObject="6BCBAF38-3D23-CC4C-80F3-30779B1174E3"
84        value="0936c240-486e-4839-a322-793de7185f99^^^&amp;1.3.6.1.4.1.21367.2017.2.5.45&amp;ISO">
85        <rim:Name>
86         <rim:LocalizedString value="XDSSubmissionSet.patientId"/>
87        </rim:Name>
88       </rim:ExternalIdentifier>
89      </rim:RegistryPackage>
90      <rim:ExtrinsicObject
91       id="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
92       mimeType="application/pdf"
93       objectType="urn:uuid:7edca82f-054d-47f2-a032-9b2a5b5186c1"
94       status="urn:oasis:names:tc:ebxml-regrep:StatusType:Approved">
95       <rim:Name>
96        <rim:LocalizedString value="Test document"/>
97       </rim:Name>
98       <rim:Slot name="languageCode">
99        <rim:ValueList>
100         <rim:Value>de-CH</rim:Value>
101        </rim:ValueList>
102       </rim:Slot>
103       <rim:Slot name="creationTime">
104        <rim:ValueList>
105         <rim:Value>20200924174309</rim:Value>
106        </rim:ValueList>
107       </rim:Slot>
108       <rim:Slot name="repositoryUniqueId">
109        <rim:ValueList>
110         <rim:Value>1.3.6.1.4.1.21367.2017.2.3.57</rim:Value>
111        </rim:ValueList>
112       </rim:Slot>
113       <rim:Slot name="serviceStartTime">
114        <rim:ValueList>
115         <rim:Value>20180521</rim:Value>
116        </rim:ValueList>
117       </rim:Slot>
118       <rim:Slot name="serviceStopTime">
119        <rim:ValueList>
120         <rim:Value>20180606</rim:Value>
121        </rim:ValueList>
122       </rim:Slot>
123       <rim:Slot name="sourcePatientInfo">
124        <rim:ValueList>
125         <rim:Value>PID-8|male</rim:Value>
126        </rim:ValueList>
127       </rim:Slot>
128       <rim:Slot name="sourcePatientId">
129        <rim:ValueList>
130         <rim:Value>0936c240-486e-4839-a322-793de7185f99^^^&amp;1.3.6.1.4.1.21367.2017.2.5.45&amp;ISO</rim:Value>
131        </rim:ValueList>
132       </rim:Slot>
133       <rim:Classification
134        classificationScheme="urn:uuid:41a5887f-8865-4c09-adf7-e362475b143a"
135        classifiedObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
136        id="E0C43B15-229A-D665-6B45-A340E6C02AED"
137        nodeRepresentation="417319006"
138        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
139        <rim:Slot name="codingScheme">
140         <rim:ValueList>
141          <rim:Value>2.16.840.1.113883.6.96</rim:Value>
142         </rim:ValueList>
143        </rim:Slot>
144        <rim:Name>
145         <rim:LocalizedString value="Record of health event (record artifact)"/>
146        </rim:Name>
147       </rim:Classification>
148       <rim:Classification
149        classificationScheme="urn:uuid:f4f85eac-e6cb-4883-b524-f2705394840f"
150        classifiedObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
151        id="BFB4DF4A-B868-43CF-B4A4-1CFC4C849EDE"
152        nodeRepresentation="17621005"
153        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
154        <rim:Slot name="codingScheme">
155         <rim:ValueList>
156          <rim:Value>2.16.840.1.113883.6.96</rim:Value>
157         </rim:ValueList>
158        </rim:Slot>
159        <rim:Name>
160         <rim:LocalizedString value="Technical user"/>
161        </rim:Name>
162       </rim:Classification>
163       <rim:Classification
164        classificationScheme="urn:uuid:a09d5840-386c-46f2-b5ad-9c3699a4309d"
165        classifiedObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
166        id="C4F066D3-EEE7-A18E-E324-642621B4A1E6"
167        nodeRepresentation="urn:che:epr:EPR_Unstructured_Document"
168        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
169        <rim:Slot name="codingScheme">
170         <rim:ValueList>
171          <rim:Value>2.16.756.5.30.1.127.3.10.10</rim:Value>
172         </rim:ValueList>
173        </rim:Slot>
174        <rim:Name>
175         <rim:LocalizedString charset="UTF-8" value="Unstructured EPR document"/>
176        </rim:Name>
177       </rim:Classification>
178       <rim:Classification
179        classificationScheme="urn:uuid:f33fb8ac-18af-42cc-ae0e-ed0b0bdb91e1"
180        classifiedObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
181        id="D83981AD-CA1E-8D30-2D47-7C95CCA35C87"
182        nodeRepresentation="22232009"
183        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
184        <rim:Slot name="codingScheme">
185         <rim:ValueList>
186          <rim:Value>2.16.840.1.113883.6.96</rim:Value>
187         </rim:ValueList>
188        </rim:Slot>
189        <rim:Name>
190         <rim:LocalizedString value="Hospital (environment)"/>
191        </rim:Name>
192       </rim:Classification>
193       <rim:Classification
194        classificationScheme="urn:uuid:cccf5598-8b07-4b77-a05e-ae952c785ead"
195        classifiedObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
196        id="22B7D0FC-8BEF-CA02-CE91-8D51501034E3"
197        nodeRepresentation="394802001"
198        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
199        <rim:Slot name="codingScheme">
200         <rim:ValueList>
201          <rim:Value>2.16.840.1.113883.6.96</rim:Value>
202         </rim:ValueList>
203        </rim:Slot>
204        <rim:Name>
205         <rim:LocalizedString value="General medicine (qualifier value)"/>
206        </rim:Name>
207       </rim:Classification>
208       <rim:Classification
209        classificationScheme="urn:uuid:f0306f51-975f-434e-a61c-c59651d33983"
210        classifiedObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
211        id="6C4198FD-FA36-BE2C-A60A-B41A641BAE99"
212        nodeRepresentation="721912009"
213        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
214        <rim:Slot name="codingScheme">
215         <rim:ValueList>
216          <rim:Value>2.16.840.1.113883.6.96</rim:Value>
217         </rim:ValueList>
218        </rim:Slot>
219        <rim:Name>
220         <rim:LocalizedString charset="UTF-8" value="Medication summary document (record artifact)"/>
221        </rim:Name>
222       </rim:Classification>
223       <rim:Classification
224        classificationScheme="urn:uuid:93606bcf-9494-43ec-9b4e-a7748d1a838d"
225        classifiedObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
226        id="F0410AF2-D25F-A2C3-5FCB-FDEAA7276858"
227        nodeRepresentation=""
228        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:Classification">
229        <rim:Slot name="authorPerson">
230         <rim:ValueList>
231          <rim:Value>^Schulz^Max^^^</rim:Value>
232         </rim:ValueList>
233        </rim:Slot>
234        <rim:Slot name="authorRole">
235         <rim:ValueList>
236          <rim:Value>HCP</rim:Value>
237         </rim:ValueList>
238        </rim:Slot>
239        <rim:Slot name="authorSpecialty">
240         <rim:ValueList>
241          <rim:Value>General Internal Medicine</rim:Value>
242         </rim:ValueList>
243        </rim:Slot>
244        <rim:Name>
245         <rim:LocalizedString value="XDSDocumentEntry.author"/>
246        </rim:Name>
247       </rim:Classification>
248       <rim:ExternalIdentifier
249        id="BD35CAC2-F290-7938-61FD-E90BE04AABEE"
250        identificationScheme="urn:uuid:2e82c1f6-a085-4c72-9da3-8640a32e42ab"
251        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:ExternalIdentifier"
252        registryObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
253        value="1.3.6.1.4.1.21367.2017.2.1.99.1.42.1.20112312375405215170610.8012">
254        <rim:Name>
255         <rim:LocalizedString value="XDSDocumentEntry.uniqueId"/>
256        </rim:Name>
257       </rim:ExternalIdentifier>
258       <rim:ExternalIdentifier
259        id="7DF56AE8-3673-2224-4E47-5C0838D8EC8B"
260        identificationScheme="urn:uuid:58a6f841-87b3-4a3e-92fd-a8ffeff98427"
261        objectType="urn:oasis:names:tc:ebxml-regrep:ObjectType:RegistryObject:ExternalIdentifier"
262        registryObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"
263        value="0936c240-486e-4839-a322-793de7185f99^^^&amp;1.3.6.1.4.1.21367.2017.2.5.45&amp;ISO">
264        <rim:Name>
265         <rim:LocalizedString value="XDSDocumentEntry.patientId"/>
266        </rim:Name>
267       </rim:ExternalIdentifier>
268      </rim:ExtrinsicObject>
269      <rim:Association
270       associationType="urn:oasis:names:tc:ebxml-regrep:AssociationType:HasMember"
271       id="5A36769E-DE9B-3A3F-9F37-CD6B962BAFB6"
272       sourceObject="6BCBAF38-3D23-CC4C-80F3-30779B1174E3"
273       targetObject="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546">
274       <rim:Slot name="SubmissionSetStatus">
275        <rim:ValueList>
276         <rim:Value>Original</rim:Value>
277        </rim:ValueList>
278       </rim:Slot>
279      </rim:Association>
280     </rim:RegistryObjectList>
281    </lcm:SubmitObjectsRequest>
282    <xdsb:Document id="A4E2E0D2-0C34-19F4-9B0B-3ED15D71A546"><xop:Include href="cid:1.c5b39a33e8effeb94a97121c58c4b93b53d2935a13853149@apache.org"/></xdsb:Document>
283   </xdsb:ProvideAndRegisterDocumentSetRequest>
284  </soapenv:Body>
285 </soapenv:Envelope>
```


### Message Interpretation

The request message is not complex in nature, but quite lengthy due to the genericity of the ebXML standard. 
Therefore the following step by step interpretation may be of help to interpret the response. 

The SOAP *Body* element conveys the ebXML *RetrieveDocumentSetRequest* which shall convey 1..N *DocumentRequest* elements (lines 12 to 16 below) with the following information: 

- *HomeCommunityId* : Unique ID of the community. 
- *RepositoryUniqueId*: Unique ID of repository taken from a **[Registry Stored Query](../main/RegistryStoredQuery.md)** response. 
- *DocumentUniqueId*: Unique ID of the document taken from a Registry Stored Query response.


```
code block here    
```


### Response Message

TBD

## Transport 

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