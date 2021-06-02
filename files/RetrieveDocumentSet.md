# Retrieve Document Set
Transaction to retrieve one or more documents from a community. Primary systems shall use this transaction to read documents from the EPR and integrate to the primary system or to display the document in the UI.   

**CONTENTS**

- [Overview](#overview)
- [Transaction](#transaction)
	* [Message Semantics](#message-semantics)
		- [Request Message](#request-message)
		- [Response Message](#response-message)
	* [Transport Protocol](#transport-protocol)
	* [Audit Log](#audit-log)
- [Security Requirements](#security-requirements)
- [Test Opportunity](#test-opportunity)  

# Overview

Primary systems shall use this transaction to retrieve documents from a patients EPR. In the Swiss EPR the **[IHE XDS.b](https://profiles.ihe.net/ITI/TF/Volume1/ch-10.html)** profile and transactions shall be used.

To retrieve the document metadata of the document, the the primary system shall perform a **[Retrieve Document Set \[ITI-43\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-43.html)** transaction. Within the request, the primary systems shall
provide the master patient ID as retrieved from the **[PIX Query](./PIXQuery.md)**, and the repository as well as
the documents unique IDs taken from the response of the **[Registry Stored Query](./RegistryStoredQuery.md)**. In
the Swiss EPR currently only supports the synchronous exchange option is supported.    

The community responds the set of documents.

# Transaction

## Message Semantics

Messages are encoded as described in the **[ebXML](http://www.ebxml.org)** standard with restrictions defined in the IHE
profile and the ordinances to the Swiss EPR.

### Request Message

The following snippet displays a sample request recorded during the EPR projectathon in September 2020, with abrevations
to increase readability. The raw request file may be found **[here](../samples/ITI-43_request_raw.xml)**.

The request message shall be a XML SOAP envelope with the query embedded in the *Body* element of the SOAP envelope. The
SOAP *Header* element conveys the following information:

- *To* element: The URL of the repository service.
- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the query as defined in the IHE ITI Technical Framework.
- *Security* element: The Web Service Security header as defined in the **[WS Security](http://docs.oasis-open.org/wss-m/wss/v1.1.1/os/wss-SOAPMessageSecurity-v1.1.1-os.html)** specification. This element conveys the XUA Assertion used for
authorization (see **[Provide X-User Assertion](./ProvideXAssertion.md)**).  


The SOAP *Body* element conveys the ebXML *RetrieveDocumentSetRequest* which shall convey 1..N *DocumentRequest* elements
(lines 12 to 16 below) with the following information:

- *HomeCommunityId* : Unique ID of the community.
- *RepositoryUniqueId*: Unique ID of repository taken from a **[Registry Stored Query](./RegistryStoredQuery.md)** response.
- *DocumentUniqueId*: Unique ID of the document taken from a Registry Stored Query response.

```
0 <?xml version="1.0" encoding="UTF-8"?>
1 <soapenv:Envelope xmlns=" !-- namespaces omitted -- ">
2   <soapenv:Header>
3     <wsa:To soapenv:mustUnderstand="1">https://epd-test.com/Repository/services/RepositoryService</wsa:To>
4     <wsa:MessageID soapenv:mustUnderstand="1">urn:uuid:1EB10F67-6562-46D5-9B6B-5DC42EB2B4A6</wsa:MessageID>
5     <wsa:Action soapenv:mustUnderstand="1">urn:ihe:iti:2007:RetrieveDocumentSet</wsa:Action>
6     <wsse:Security>
7       <saml2:Assertion> <!-- XUA assertion omitted --></saml2:Assertion>
8     </wsse:Security>
9   </soapenv:Header>
10   <soapenv:Body>
11     <xsdb:RetrieveDocumentSetRequest>
12       <xsdb:DocumentRequest>
13         <xsdb:HomeCommunityId>urn:oid:1.3.6.1.4.1.21367.2017.2.6.19</xsdb:HomeCommunityId>
14         <xsdb:RepositoryUniqueId>1.3.6.1.4.1.21367.2017.2.3.54</xsdb:RepositoryUniqueId>
15         <xsdb:DocumentUniqueId>1.3.6.1.4.1.21367.2017.2.1.75.20200922130227623</xsdb:DocumentUniqueId>
16       </xsdb:DocumentRequest>
17     </xsdb:RetrieveDocumentSetRequest>
18   </soapenv:Body>
19 </soapenv:Envelope>    
```

### Response Message

The following snippet displays a sample response recorded during the EPR projectathon in September 2020, with abrevations
to increase readability. The raw request file may be found **[here](../samples/ITI-43_response_raw.xml)**.

The SOAP *Header* element of the response conveys the following information:

- *Action* element: The SOAP action identifier of the response as defined in the IHE ITI Technical Framework.
- *RelatesTo* element: The *messageID* of the request (see above).  

```
0 <?xml version='1.0' encoding='utf-8'?>
1 <soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope">
2   <soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
3     <wsa:Action>urn:ihe:iti:2007:RetrieveDocumentSetResponse</wsa:Action>
4     <wsa:RelatesTo>urn:uuid:1EB10F67-6562-46D5-9B6B-5DC42EB2B4A6</wsa:RelatesTo>
5   </soapenv:Header>
6   <soapenv:Body>
7     <ns3:RetrieveDocumentSetResponse xmlns=" !-- namespaces omitted -- ">
8       <ns6:RegistryResponse status="urn:oasis:names:tc:ebxml-regrep:ResponseStatusType:Success"/>
9       <ns3:DocumentResponse>
10         <ns3:HomeCommunityId>urn:oid:1.3.6.1.4.1.21367.2017.2.6.19</ns3:HomeCommunityId>
11         <ns3:RepositoryUniqueId>1.3.6.1.4.1.21367.2017.2.3.54</ns3:RepositoryUniqueId>
12         <ns3:DocumentUniqueId>1.3.6.1.4.1.21367.2017.2.1.75.20200922130227623</ns3:DocumentUniqueId>
13         <ns3:mimeType>application/pdf</ns3:mimeType>
14         <ns3:Document xmlns:xop="http://www.w3.org/2004/08/xop/include">
15           <xop:Include href="cid:72f7c587daaacb8b81212de4e80e442e5f43394482e12edd@apache.org"/>
16         </ns3:Document>
17       </ns3:DocumentResponse>
18     </ns3:RetrieveDocumentSetResponse>
19   </soapenv:Body>
20 </soapenv:Envelope>   
```

The SOAP *Body* element conveys the ebXML *RetrieveDocumentSetResponse* which conveys 1..N *DocumentResponse* elements
(lines 9 to 17 below) with the following information:

- *HomeCommunityId* : Unique ID of the community.
- *RepositoryUniqueId*: Unique ID of repository.
- *DocumentUniqueId*: Unique ID of the document.
- *Document* element (line 14 to 16): It's *Include* element conveys the *content-id* reference of the attached document in the MTOM response (see below).

## Transport Protocol

The system shall send the request messages to the repository service of the community using the MIME Multipart/Related
binding as specified in the SOAP **[MTOM specification](https://www.w3.org/TR/soap12-mtom/)** of the W3C.

The repository responds the documents using the MIME Multipart/Related binding as specified in the SOAP
**[MTOM specification](https://www.w3.org/TR/soap12-mtom/)** of the W3C. A full message may look like:

```
DefaultHttpResponse(chunked: false)
HTTP/1.1 200 OK
Connection: Keep-Alive
Content-Length: nnnn  
Content-Type: multipart/related; boundary=MIMEBoundary4A7AE55984E7438034;type="application/xop+xml"; start="<0.09BC7F4BE2E4D3EF1B@apache.org>";start-info="text/xml; charset=utf-8"

--MIMEBoundary4A7AE55984E7438034
content-type: application/xop+xml; charset=utf-8; type="application/soap+xml;"
content-transfer-encoding: binary
content-id: <0.09BC7F4BE2E4D3EF1B@apache.org>

<?xml version='1.0' encoding='utf-8'?>
<soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope">
  <soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
    <wsa:Action>urn:ihe:iti:2007:RetrieveDocumentSetResponse</wsa:Action>
    <wsa:RelatesTo>urn:uuid:1EB10F67-6562-46D5-9B6B-5DC42EB2B4A6</wsa:RelatesTo>
  </soapenv:Header>
  <soapenv:Body>
    <ns3:RetrieveDocumentSetResponse xmlns=" !-- namespaces omitted -- ">
      <ns6:RegistryResponse status="urn:oasis:names:tc:ebxml-regrep:ResponseStatusType:Success"/>
      <ns3:DocumentResponse>
        <ns3:HomeCommunityId>urn:oid:1.3.6.1.4.1.21367.2017.2.6.19</ns3:HomeCommunityId>
        <ns3:RepositoryUniqueId>1.3.6.1.4.1.21367.2017.2.3.54</ns3:RepositoryUniqueId>
        <ns3:DocumentUniqueId>1.3.6.1.4.1.21367.2017.2.1.75.20200922130227623</ns3:DocumentUniqueId>
        <ns3:mimeType>application/pdf</ns3:mimeType>
        <ns3:Document xmlns:xop="http://www.w3.org/2004/08/xop/include">
          <xop:Include href="cid:72f7c587daaacb8b81212de4e80e442e5f43394482e12edd@apache.org"/>
        </ns3:Document>
      </ns3:DocumentResponse>
    </ns3:RetrieveDocumentSetResponse>
  </soapenv:Body>
</soapenv:Envelope>

--MIMEBoundary4A7AE55984E7438034
content-type: application/octet-stream
content-transfer-encoding: binary
content-id: <72f7c587daaacb8b81212de4e80e442e5f43394482e12edd@apache.org>

!-- Binary Data omitted --

--MIMEBoundary4A7AE55984E7438034--
```

## Audit Log

Primary systems shall store syslog messages to the audit record repository of the community using TLS transport protocol.
The audit message uses XML formatting as specified in **[RFC 3881](https://tools.ietf.org/html/rfc3881)** with restrictions
specified in the **[IHE ITI TF](https://ehealthsuisse.ihe-europe.net/gss/audit-messages/view.seam?id=706)** and the
**[Extension 1 to Annex5](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/gesetze/anhang_5_ergaenzung_1_epdv_edi_20200415.PDF.download.PDF/Ergaenzung_1_Anhang_5_EPDV-EDI_20200415.pdf.PDF)** in the ordinances of the Swiss electronic patient record (see Section
1.5 "Requirements on ATNA").  

The following snippet shows a example audit message to be written by the primary system:

```
1 <?xml version='1.0' encoding='utf-8'?>
2 <AuditMessage>
3  <EventIdentification EventActionCode="C" EventDateTime="2020-06-04T10:54:39.571Z" EventOutcomeIndicator="0">
4   <EventID csd-code="110107" codeSystemName="DCM" originalText="Import"/>
5   <EventTypeCode csd-code="ITI-43" codeSystemName="IHE Transactions" originalText="Retrieve Document Set"/>
6   <PurposeOfUse csd-code="NORM" codeSystemName="2.16.756.5.30.1.127.3.10.5" originalText="Normal"/>
7  </EventIdentification>
8  <ActiveParticipant UserID="https://primary.system.com" AlternativeUserID="1" UserIsRequestor="false" NetworkAccessPointID="172.18.0.49" NetworkAccessPointTypeCode="2">
9   <RoleIDCode csd-code="110153" codeSystemName="DCM" originalText="Source Role ID"/>
10  </ActiveParticipant>
11  <ActiveParticipant UserID="&lt;111111111148@xua.hin.ch&gt;" UserName="&lt;111111111148@xua.hin.ch&gt;" UserIsRequestor="true">
12   <RoleIDCode csd-code="HCP" codeSystemName="2.16.756.5.30.1.127.3.10.6" originalText="Behandelnde(r)"/>
13  </ActiveParticipant>
14  <ActiveParticipant UserID="111111111148" UserName="Dr. Professional HasOneAux" UserIsRequestor="true">
15   <RoleIDCode csd-code="HCP" codeSystemName="2.16.756.5.30.1.127.3.10.6" originalText="Behandelnde(r)"/>
16  </ActiveParticipant>
17  <ActiveParticipant UserID="http://platform.service.com" AlternativeUserID="UNKNOWN" UserIsRequestor="false" NetworkAccessPointID="172.18.0.99" NetworkAccessPointTypeCode="1">
18   <RoleIDCode csd-code="110152" codeSystemName="DCM" originalText="Destination Role ID"/>
19  </ActiveParticipant>
20  <AuditSourceIdentification AuditEnterpriseSiteID="2.16.756.5.30.1.194" AuditSourceID="LE-Portal">
21   <AuditSourceTypeCode csd-code="9" codeSystemName="DCM" originalText="Other"/>
22  </AuditSourceIdentification>
23  <ParticipantObjectIdentification ParticipantObjectID="761337615343338300^^^&amp;2.16.756.5.30.1.127.3.10.3&amp;ISO" ParticipantObjectTypeCode="1" ParticipantObjectTypeCodeRole="1">
24   <ParticipantObjectIDTypeCode csd-code="2" codeSystemName="RFC-3881" originalText="Patient Number"/>
25  </ParticipantObjectIdentification>
26  <ParticipantObjectIdentification ParticipantObjectID="2.16.756.5.30.1.194.130880.1591258526941" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="3">
27   <ParticipantObjectIDTypeCode csd-code="9" codeSystemName="RFC-3881" originalText="Report Number"/>
28   <ParticipantObjectDetail type="Repository Unique Id" value="Mi4xNi43NTYuNS4zMC4xLjE5NC4zLjMuMQ=="/>
29   <ParticipantObjectDetail type="ihe:homeCommunityID" value="dXJuOm9pZDoyLjE2Ljc1Ni41LjMwLjEuMTk0"/>
30  </ParticipantObjectIdentification>
31  <ParticipantObjectIdentification ParticipantObjectID="761337615343338300^^^&amp;2.16.756.5.30.1.127.3.10.3&amp;ISO" ParticipantObjectTypeCode="4" ParticipantObjectTypeCodeRole="1">
32   <ParticipantObjectIDTypeCode csd-code="2" codeSystemName="RFC-3881" originalText="Patient Number"/>
33  </ParticipantObjectIdentification>
34 </AuditMessage>
```

The message is made of the following blocks:
- *EventIdentification*: Event related information including the timestamp and purpose of use (line 3 .. 7).
- *ActiveParticipant*: Information related to the primary system performing the query (line 8 .. 10).
- *ActiveParticipant*: Information on the user initiating the transaction (line 11 .. 13).
- *ActiveParticipant*: Additional information on the user initiating the transaction (line 14 .. 16).
- *ActiveParticipant*: Information on the responding service endpoint (line 17 .. 19).
- *AuditSourceIdentification*: Information related to the primary system performing the query (line 20 .. 22).
- *ParticipantObjectIdentification*: Additional information on the patient local ID (line 23 .. 25).
- *ParticipantObjectIdentification*: Request message related information (line 26 .. 30).
- *ParticipantObjectIdentification*: Information on the patients EPR accessed (line 31 .. 33).

## Security Requirements   

To ensure privacy the transaction must be secured using https with mutual authentication, with X.509 certificates (extended
validation required) and client and server side certificate validation.

To enable authorization, the transaction must convey the XUA Assertion for authorization in the security header of the SOAP
envelope. See **[Provide X-User Assertion](./ProvideXAssertion.md)** for the implementation details.

Note:
- Some test environments dropped the mutual authentication or TLS for testing purposes. Please contact your test system provider on the details.
- Some test environments may also drop authorization for testing purposes. Please contact your test system provider on the details.  

# Test Opportunity

The transaction can be tested with the test suite of the **[EPR reference environment](./gazelle.md)**, test systems of the EPR communities or the **[EPR Playground](./playground.md)**.
