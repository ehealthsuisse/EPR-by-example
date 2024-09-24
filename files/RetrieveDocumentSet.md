# Retrieve Document Set
Transaction to retrieve one or more documents from a community. Primary systems shall use this transaction to read documents from the EPR and integrate to the primary system or to display the document in the UI.   

## Overview

Primary systems shall use this transaction to retrieve documents from a patients EPR. In the Swiss EPR the [IHE XDS.b](https://profiles.ihe.net/ITI/TF/Volume1/ch-10.html) profile and transactions shall be used.

To retrieve the document metadata of the document, the the primary system shall perform a [Retrieve Document Set \[ITI-43\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-43.html) transaction. Within the request, the primary systems shall
provide the master patient ID as retrieved from the [PIX Query](PIXQuery.md), and the repository as well as
the documents unique IDs taken from the response of the [Registry Stored Query](RegistryStoredQuery.md). In
the Swiss EPR currently only supports the synchronous exchange option is supported.    

The community responds the set of documents.

## Transaction

### Message Semantics

Messages are encoded as described in the [ebXML][ebxml] standard with restrictions defined in the IHE
profile and the ordinances to the Swiss EPR.

#### Request Message

The following snippet displays a sample request recorded during the EPR projectathon in September 2020, with abrevations
to increase readability. The raw request file may be found [here](https://github.com/ehealthsuisse/EPR-by-example/tree/main/samples/ITI-43_request_raw.xml).

The request message shall be a XML SOAP envelope with the query embedded in the *Body* element of the SOAP envelope. The
SOAP *Header* element conveys the following information:

- *To* element: The URL of the repository service.
- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the query as defined in the IHE ITI Technical Framework.
- *Security* element: The Web Service Security header as defined in the [WS Security][wss] specification. This element conveys the XUA Assertion used for
authorization (see [Provide X-User Assertion](ProvideXAssertion.md)).  


The SOAP *Body* element conveys the ebXML *RetrieveDocumentSetRequest* which shall convey 1..N *DocumentRequest* elements
(lines 12 to 16 below) with the following information:

- *HomeCommunityId* : Unique ID of the community.
- *RepositoryUniqueId*: Unique ID of repository taken from a [Registry Stored Query](RegistryStoredQuery.md) response.
- *DocumentUniqueId*: Unique ID of the document taken from a Registry Stored Query response.

```xml title="ITI-43_request.xml" linenums="1" hl_lines="13-15"
--8<-- "samples/ITI-43_request.xml:1"
```

#### Response Message

The following snippet displays a sample response recorded during the EPR projectathon in September 2020, with abrevations
to increase readability. The raw request file may be found [here](https://github.com/ehealthsuisse/EPR-by-example/tree/main/samples/ITI-43_response_raw.xml).

The SOAP *Header* element of the response conveys the following information:

- *Action* element: The SOAP action identifier of the response as defined in the IHE ITI Technical Framework.
- *RelatesTo* element: The *messageID* of the request (see above).  

```xml title="ITI-43_response.xml" linenums="1"
--8<-- "samples/ITI-43_response.xml:1"
```

The SOAP *Body* element conveys the ebXML *RetrieveDocumentSetResponse* which conveys 1..N *DocumentResponse* elements
(lines 9 to 17 below) with the following information:

- *HomeCommunityId* : Unique ID of the community.
- *RepositoryUniqueId*: Unique ID of repository.
- *DocumentUniqueId*: Unique ID of the document.
- *Document* element (line 14 to 16): It's *Include* element conveys the *content-id* reference of the attached document in the MTOM response (see below).

### Transport Protocol

The system shall send the request messages to the repository service of the community using the MIME Multipart/Related
binding as specified in the SOAP [MTOM specification][mtom] of the W3C.

The repository responds the documents using the MIME Multipart/Related binding as specified in the SOAP
[MTOM specification][mtom] of the W3C. A full message may look like:

```http linenums="1"
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

### Audit Log

Primary systems shall store syslog messages to the audit record repository of the community using TLS transport protocol.
The audit message uses XML formatting as specified in [RFC 3881][rfc3881] with restrictions
specified in the [IHE ITI TF](https://ehealthsuisse.ihe-europe.net/gss/audit-messages/view.seam?id=706) and the
[Extension 1 to Annex5][annexes] in the ordinances of the Swiss electronic patient record (see Section
1.5 "Requirements on ATNA").  

The following snippet shows a example audit message to be written by the primary system:

```xml title="iti-43-log.xml" linenums="1"
--8<-- "samples/iti-43-log.xml"
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

### Security Requirements   

To ensure privacy the transaction must be secured using https with mutual authentication, with X.509 certificates (extended
validation required) and client and server side certificate validation.

To enable authorization, the transaction must convey the XUA Assertion for authorization in the security header of the SOAP
envelope. See [Provide X-User Assertion](ProvideXAssertion.md) for the implementation details.

!!! note
    - Some test environments dropped the mutual authentication or TLS for testing purposes. Please contact your test system provider on the details.
    - Some test environments may also drop authorization for testing purposes. Please contact your test system provider on the details.  

## Test Opportunity

The transaction can be tested with the test suite of the [EPR reference environment](gazelle.md), test systems of the EPR communities or the [EPR Playground](playground.md).
