# Provide and Register Document Set
Transaction to store one or more documents to a community. Primary systems shall use this transaction to export documents
and the to a community repository to add it to a patients EPR.  

## Overview

Primary systems shall use this transaction to provide documents and the related document metadata to a patient EPR.
In the Swiss EPR the **[IHE XDS.b](https://profiles.ihe.net/ITI/TF/Volume1/ch-10.html)** profile and transactions shall
be used.

To store the document metadata of the document, the the primary system shall perform a
**[Provide And Register Document Set \[ITI-41\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-41.html)** transaction.
Within the request, the primary systems shall provide the master patient ID as retrieved from the
**[PIX Query](PIXQuery.md)**, the document metadata as defined in the ordinances of the Swiss EPR and the
binary data of the document.  

The community responds with a code indicating the successful registration of the document.

## Transaction

### Message Semantics

Messages are encoded as described in the **[ebXML](http://www.ebxml.org)** standard with restrictions defined in the IHE
profile and the ordinances to the Swiss EPR.

#### Request Message

Since the **[ebXML](http://www.ebxml.org)** standard is very generic, the request message is quite lengthy and needs some
background information to interpret.

The structure of the result set is as follows (see example below):
- The metadata of the individual documents are bundled in a *ExtrinsicObject* element.
- The metadata attributes are encoded as *Slot*, as *Classification* or as *ExternalIdentifier* elements.
- Metadata attributes encoded as *Slots* can be identified and interpreted by the slot's *name* attribute.
- Metadata attributes encoded as *Classification* can be identified and interpreted by the classification's *classificationScheme* attribute.
- The unique ID of the document is encoded as *ExternalIdentifier*, which has an *identificationScheme* attribute with a fixed value.

The table of the identifier used to indicate the metadata attributes is defined by the metadata model used by IHE XDS.b in
**[IHE ITI Technical Framework Vol. 3, Section 4.2.5.1](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.1)** and
**[IHE ITI Technical Framework Vol. 3, Section 4.2.5.2](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.2)** .

The corresponding interpretation of the metadata attributes in the Swiss EPR and the supported value sets may be found in
**[Annex 3](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**
of the ordinances of the Swiss electronic patient dossier.

A request message is quite lengthy. A listing with abrevations used in the step by step interpretation below is found **[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-41_request.xml)**. The raw version of the request message may be found **[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-41_request.xml)**.

#### Message Interpretation

The request message is not very complex, but lengthy due to the genericity of the ebXML standard.
Therefore the following step by step interpretation may be of help to interpret the response.

The SOAP *Header* element conveys the following information:

- *To* element: The URL of the provide and register document set service.
- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the request as defined in the IHE ITI Technical Framework.
- *Security* element: The Web Service Security header as defined in the **[WS Security](http://docs.oasis-open.org/wss-m/wss/v1.1.1/os/wss-SOAPMessageSecurity-v1.1.1-os.html)** specification. This element conveys the XUA Assertion used for
authorization (see **[Provide X-User Assertion](ProvideXAssertion.md)**).  

```
3  <soapenv:Header>
4   <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:nil="true">
5    <saml2:Assertion>
6     <!-- omitted for brevity -->
7    </saml2:Assertion>
8   </wsse:Security>
9   <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing">urn:ihe:iti:2007:ProvideAndRegisterDocumentSet-b</wsa:Action>
10  <wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing">d22ebb69-8368-4eb6-929b-b382f1b37c72</wsa:MessageID>
11  </soapenv:Header>    
```

The SOAP *Body* element conveys the following objects in ebXML syntax:

- *RegistryRegistryPackage* defining the submission set and it's metadata.
- *ExtrinsicObject* defining the document metadata (matches the document metadata interpretation in **[Registry Stored Query](RegistryStoredQuery.md#response-message)**).
- *Association* linking the document metadata to the submission set.  

We will explain the *RegistryRegistryPackage* object defining the submission set first. For the other elements, see below.  

##### Submission Set

The structure of the *RegistryPackage* object defining the submission set is as follows (see example below):
- The metadata attributes are encoded as *Slot*, as *Classification* or as *ExternalIdentifier* elements.
- Metadata attributes encoded as *Slots* can be identified and interpreted by the slot's *name* attribute.
- Metadata attributes encoded as *Classification* can be identified and interpreted by the classification's *classificationScheme* attribute.
- The unique ID of the document is encoded as *ExternalIdentifier*, which has an *identificationScheme* attribute with a fixed value.

The *RegistryRegistryPackage* object defining the submission set has one *Slot* child elements with name *submissionTime*
which conveys the request timestamp, and a *Name* element to convey the display name of the submission set (see lines 17 to
	25 below).

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

The *RegistryRegistryPackage* object defining the submission set has three *Classification* child elements conveying the
submission set metadata:

- Content Type Code: The submission set content type code attribute, indicated by the value of the classificationScheme
equal to *urn:uuid:aa543740-bdda-424e-8c96-df4873be8500*. The value conveyed with the nodeRepresentation attribute and the
codingScheme value must match one of the supported values in the Swiss EPR as defined in Annex 3.
- submission author: The submission set author element, indicated by the value of the classificationScheme equal to *urn:uuid:a7058bb9-b4e4-4307-ba5b-e3f0ab85e12d*. The author element is optional in the EPR. If present, it shall convey the
information on the person, which initiated the request.
- submission set identificator: An element with classification scheme *urn:uuid:a54d6aa5-d40d-43f9-88c5-b4633d873bdd*
required to identify the *RegistryPackage* object as a XDS.b submission set.

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
- *XDSSubmissionSet.patientId*: The master patient ID (XAD-PID) of the patient in CX format
(see **[PIX Feed](PIXFeed.md)**).

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

##### Document Metadata

The request contains 1..N *ExtrinsicObject* representing the document metadata for each document. The interpretation of
the document metadata matches the document metadata interpretation, which is explained in detail in step by step example in
the Registry Stored Query page and will not be reproduced here. Please see **[Registry Stored Query](RegistryStoredQuery.md#response-message)** for the interpretation of the document metadata.

##### Association

The request contains one *Association* object linking the document and document metadata to a submission set defined in the
*RegistryPackage* (see **[Submission Set](ProvideAndRegister.md#submission-set)**).

The *Association* object thus conveys two parameter to link the objects:
- *sourceObject*: The attribute value must match the *id* attribute of the submission set *RegistryPackage*.
- *targetObject*: The attribute value must match the *id* attribute value of the document metadata *ExtrinsicObject*.  

In addition the *Association* object conveys a status indicator, which must take the value *Original* (see snippet below).

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

#### Response Message

The provide and register service responds with a message indicating the success of the transaction. The outcome indicator is
encoded in the *Body* element of the SOAP envelope as follows:

```
  <ns2:RegistryResponse xmlns=" !--namespace ommitted " status="urn:oasis:names:tc:ebxml-regrep:ResponseStatusType:Success"/>.
```

The raw version of a response message may be found **[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-41_response.xml)**.


### Transport Protocol

The system shall send the request messages to the repository service of the community using the MIME Multipart/Related
binding as specified in the SOAP **[MTOM specification](https://www.w3.org/TR/soap12-mtom/)** of the W3C.

The request in MTOM format may look as follows:

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

<!-- message omittedd -->

--MIMEBoundary_05b39a33e8effeb90c1ccb1c58c4b93b5af2935a13853149
Content-Type: application/octet-stream
Content-Transfer-Encoding: binary
Content-ID: <1.c5b39a33e8effeb94a97121c58c4b93b53d2935a13853149@apache.org>

<!-- binary document data omitted -->

--MIMEBoundary_05b39a33e8effeb90c1ccb1c58c4b93b5af2935a13853149--

```

The provide and register service sends the response message in the MIME Multipart/Related binding as specified in the SOAP
**[MTOM specification](https://www.w3.org/TR/soap12-mtom/)** of the W3C.

The response in MTOM format may look as follows:

```
DefaultHttpResponse(chunked: false)
HTTP/1.1 200 OK
Connection: keep-alive
Content-Type: multipart/related; type="application/xop+xml"; boundary="uuid:2a1acced-0234-4a54-8dd3-b9f9b753169c"; start="<root.message@cxf.apache.org>"; start-info="application/soap+xml"
Date: Thu, 24 Sep 2020 15:43:11 GMT
Content-Length: 1136

--uuid:2a1acced-0234-4a54-8dd3-b9f9b753169c
Content-Type: application/xop+xml; charset=UTF-8; type="application/soap+xml"
Content-Transfer-Encoding: binary
Content-ID: <root.message@cxf.apache.org>

<?xml version='1.0' encoding='utf-8'?>
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope">
 <soap:Header>
  <Action xmlns="http://www.w3.org/2005/08/addressing" soap:mustUnderstand="true">urn:ihe:iti:2007:ProvideAndRegisterDocumentSet-bResponse</Action>
  <MessageID xmlns="http://www.w3.org/2005/08/addressing">urn:uuid:3dbfa2b7-3cd6-46b3-b642-9569bb3b43fb</MessageID>
  <To xmlns="http://www.w3.org/2005/08/addressing">http://www.w3.org/2005/08/addressing/anonymous</To>
  <RelatesTo xmlns="http://www.w3.org/2005/08/addressing">d22ebb69-8368-4eb6-929b-b382f1b37c72</RelatesTo>
 </soap:Header>
 <soap:Body>
  <ns2:RegistryResponse
  xmlns="urn:oasis:names:tc:ebxml-regrep:xsd:rim:3.0"
  xmlns:ns2="urn:oasis:names:tc:ebxml-regrep:xsd:rs:3.0"
  xmlns:ns3="urn:oasis:names:tc:ebxml-regrep:xsd:lcm:3.0"
  xmlns:ns4="urn:ihe:iti:xds-b:2007"
  status="urn:oasis:names:tc:ebxml-regrep:ResponseStatusType:Success"/>
 </soap:Body>
</soap:Envelope>
--uuid:2a1acced-0234-4a54-8dd3-b9f9b753169c--
```


### Audit Log

Primary systems shall store syslog messages to the audit record repository of the community using TLS transport protocol.
The audit message uses XML formatting as specified in **[RFC 3881](https://tools.ietf.org/html/rfc3881)** with restrictions
specified in the **[IHE ITI TF](https://ehealthsuisse.ihe-europe.net/gss/audit-messages/view.seam?id=700)** and the
**[Extension 1 to Annex5](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)** in the ordinances of the Swiss electronic patient record (see Section
1.5 "Requirements on ATNA").  

The following snippet shows a example audit message to be written by the primary system:

```
<<?xml version="1.0"?>
<AuditMessage>
 <EventIdentification EventActionCode="R" EventDateTime="2020-11-17T18:39:39+01:00" EventOutcomeIndicator="0">
  <EventID csd-code="110106" originalText="Export" codeSystemName="DCM"/>
  <EventTypeCode csd-code="ITI-41" originalText="Provide and Register Document Set-b" codeSystemName="IHE Transactions"/>
 </EventIdentification>
 <ActiveParticipant UserID="pma@gnt.com" UserName="JD&lt;pma@gnt.com&gt;"/>
 <ActiveParticipant UserID="2000000090108" UserName="Dr. med. John Doe" UserIsRequestor="true">
  <RoleIDCode csd-code="HCP" codeSystemName="2.16.756.5.30.1.127.3.10.6" originalText="Healthcare professional"/>
 </ActiveParticipant>
 <ActiveParticipant UserID="https://repositoryService.com" AlternativeUserID="1" UserIsRequestor="false" NetworkAccessPointID="172.18.0.49" NetworkAccessPointTypeCode="2">
  <RoleIDCode csd-code="110153" codeSystemName="DCM" originalText="Source Role ID"/>
 </ActiveParticipant>
 <ActiveParticipant UserID="https://primarySystem.com" AlternativeUserID="UNKNOWN" UserIsRequestor="true" NetworkAccessPointID="hcohcdemo01-app06-icwpxs01.net.swisscom-health.it" NetworkAccessPointTypeCode="1">
  <RoleIDCode csd-code="110152" codeSystemName="DCM" originalText="Destination Role ID"/>
 </ActiveParticipant>
 <AuditSourceIdentification code="1" AuditSourceID="connectathon"/>
 <ParticipantObjectIdentification ParticipantObjectID="752343^^^&amp;2.16.840.1.113883.3.37.4.1.1.2.1.1&amp;ISO" ParticipantObjectTypeCode="1" ParticipantObjectTypeCodeRole="1">
  <ParticipantObjectIDTypeCode csd-code="2" originalText="Patient Number" codeSystemName="RFC-3881"/>
 </ParticipantObjectIdentification>
 <ParticipantObjectIdentification ParticipantObjectID="urn:uuid:6b948daf-ab4a-4d51-a1a4-e9f4b2e05ff7" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="20">
  <ParticipantObjectIDTypeCode csd-code="urn:uuid:a54d6aa5-d40d-43f9-88c5-b4633d873bdd" originalText="submission set classificationNode" codeSystemName="IHE XDS Metadata"/>
 </ParticipantObjectIdentification>
</AuditMessage> 
```

The message is made of the following blocks:
- *EventIdentification*: Element with event related information including the timestamp.
- *ActiveParticipant*: Information related to the community repository which is the source of the documents.
- *ActiveParticipant*: Information on the user as required by the IHE XUA profile.
- *ActiveParticipant*: Element with information on the authenticated user initiating the request.
- *ActiveParticipant*: Element with information on the primary system performing which is the destination of the documents.
- *ParticipantObjectIdentification*: Element conveying the master patient ID (XAD-PID) in CX format (see **[PIX Feed](PIXFeed.md)**).  
- *ParticipantObjectIdentification*: Element with request message related information.  

*TODO* Update with gazelle example


### Security Requirements   

To ensure privacy the transaction must be secured using https with mutual authentication, with X.509 certificates (extended
validation required) and client and server side certificate validation.

To enable authorization, the transaction must convey the XUA Assertion for authorization in the security header of the SOAP
envelope. See **[Provide X-User Assertion](ProvideXAssertion.md)** for the implementation details.

Note:
- Some test environments dropped the mutual authentication or TLS for testing purposes. Please contact your test system provider on the details.
- Some test environments may also drop authorization for testing purposes. Please contact your test system provider on the details.

## Test Opportunity

The transaction can be tested with the test suite of the **[EPR reference environment](gazelle.md)**, test systems of the EPR communities or the **[EPR Playground](playground.md)**.
