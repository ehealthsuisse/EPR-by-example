# PIX Query
Transaction to get the master patient ID of a patient in a community using the local ID.

## Overview

Primary systems shall use this transaction to retrieve the master patient ID (XAD-SPID) for patients the primary
systems wants to retrieve or provide documents for. In the Swiss EPR the
**[IHE PIX V3](https://profiles.ihe.net/ITI/TF/Volume1/ch-23.html)** profile and transactions shall be used to retrieve
the master patient ID.  

To retrieve the master patient ID for the patient to access the patients EPR, the the primary system shall perform a
**[Patient V3 Query \[ITI-45\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-45.html)**. Within the query request the
primary system shall provide the local ID of the patient in the primary system, as well as the *data source* parameter
of the assigning authority of the community and the the assigning authority EPR-SPID. The local ID must match the local
ID the primary system registered the patient with (see **[PIX Feed](PIXFeed.md)**).  

If the patient is registered in the community, the community sends a response with the master patient ID (XAD-PID) and
the EPR-SPID.

## Transaction

### Message Semantics

Messages are encoded as described in the HL7 V3 standard with restrictions defined in the
**[IHE PIX V3 Query](https://profiles.ihe.net/ITI/TF/Volume2/ITI-45.html)** profile and the ordinances to the Swiss EPR.

#### Request Message

Due to the genericity of the underlying **[HL7 V3][hl7]** standard, the request message is quite lengthy.
A raw version of a request message may be found
**[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-45_request_raw.xml)**.

For a step by step interpretation of the request message, see section below.

##### Message Interpretation

The request message is not complex in nature, but quite lengthy due to the genericity of the HL7 V3 standard.

The SOAP *Header* element shall convey the following information:

- *To* element: The URL of the provide and register document set service.
- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the request as defined in the IHE ITI Technical Framework.

Optional elements may be included according to the specification in the **[W3C SOAP specification][soap]**.

```xml title="SOAP header" linenums="1" hl_lines="3-5"
--8<-- "samples/ITI-45_request_raw.xml::11"
```

For the PIX query no *Security* header element is required, since in the Swiss EPR the access to the patient
data is authorized for all applications, which are registered in the community and authenticate with a client certificate
(see section **[Security Requirements](PIXFeed.md#security-requirements)**).

The SOAP *Body* element conveys the administrative information required for a HL7 V3 PRPA_IN201310UV02 message in HL7 V3 syntax.

Primary systems shall set the following values:

- *creationTime*: A timestamp in unix time format.
- *sender* : The OID of the sender application initiating the request.
- *receiver*: The OID of the receiver application which shall respond to the request.

```xml title="PRPA_IN201309UV02 message" linenums="13"
--8<-- "samples/ITI-45_request_raw.xml:13:29"
```

The query parameter are encoded in a HL7 V3 *controlActProcess* element of the message. Primary systems shall set the following query attributes:

- *authorOrPerformer*: The OID of the primary system in the *id* element.

```xml title="controlActProcess element" linenums="30"
--8<-- "samples/ITI-45_request_raw.xml:30:36"
```

The query parameter are conveyed in the *queryByParameter* child element:

- *queryId*: A unique ID of the query.
- *dataSource*: The OID of the assigning authority of the community (line 43). 
- *dataSource*: The OID of the assigning authority of the EPR-SPID (line 46).
- *patientIdentifier*: The ID of the patient data in the primary system, with the OID of the primary system in the *root* element and the local ID in the *extension* element.

```xml title="controlActProcess element" linenums="37"
--8<-- "samples/ITI-45_request_raw.xml:37:55"
```

#### Response Message

The PIX V3 Feed service responds with the master patient ID (XAD-PID) and the EPR-SPID, the patient is registered with in
the community.

The request message is not very complex, but quite lengthy due to the genericity of the HL7 V3 standard. A raw version
of a response message may be found **[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-45_response.xml)**.

##### Message Interpretation

The SOAP *Header* element shall conveys the following information:

- *Action* element: The SOAP action identifier of the request as defined in the IHE ITI Technical Framework.
- *RelatesTo* element: A copy of the unique ID of the query request.

```xml title="SOAP header" linenums="1"
--8<-- "samples/ITI-45_response_raw.xml::5"
```

The SOAP *Body* element conveys the administrative information required for a PRPA_IN201310UV02 message in HL7 V3 syntax
and the query result encoded in the *controlActProcess* element.

The *controlActProcess* element conveys the following information for the primary system in the *subject* child element:

The *patient* child element conveys the master patient ID (XAD-SPID) and the EPR-SPID as follows:

- *id* : The master patient ID (XAD-SPID), with the community OID as the assigning authority in the *root* and the ID in the *extension* attribute (line 49).
- *id* : The EPR-SPID, with the OID of the ZAS as assigning authority in the *root* and the ID in the *extension* attribute (line 50).

```xml title="registrationEvent element" linenums="44"
--8<-- "samples/ITI-45_response_raw.xml:44:56"
```

The *custodian* child element conveys information on the responding system with the the OID of the provider organization in the *id* child element as follows:

```xml title="custodian element" linenums="57"
--8<-- "samples/ITI-45_response_raw.xml:57:66"
```

### Transport Protocol

The primary system shall send the request messages to the registry of the community using the http POST binding as defined in the **[W3C SOAP specification][soap]**. It may look like:

```http linenums="1"
POST /PIXV3QueryService HTTP/1.1
Host: company.example.org
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
Content-Type: application/soap+xml; charset="utf-8"
Content-Length: nnnn    
```

### Audit Log

Primary systems shall store syslog messages to the audit record repository of the community using TLS transport protocol.
The audit message uses XML formatting as specified in **[RFC 3881][rfc3881]** with restrictions
specified in the **[IHE ITI TF](ref-env/gss/audit-messages/view.seam?id=705)** and the
**[Extension 1 to Annex5][annexes]** in the ordinances of the Swiss electronic patient record (see Section
1.5 "Requirements on ATNA").  

The following snippet shows a example audit message to be written by the primary system:

```xml title="iti-45-log.xml" linenums="1"
--8<-- "samples/iti-45-log.xml"
```

The message is made of the following blocks:

- *EventIdentification*: Event related information including the timestamp (line 3 .. 6).
- *ActiveParticipant*: Information related to the primary system performing the query (line 7 .. 9).
- *ActiveParticipant*: Information on the user initiating the transaction (line 10 .. 12).
- *ActiveParticipant*: Information on the responding service endpoint (line 13 .. 15).
- *AuditSourceIdentification*: Information related to the primary system performing the query (line 16 .. 18)
- *ParticipantObjectIdentification*: Information on the patients EPR accessed (line 19 .. 22)
- *ParticipantObjectIdentification*: Request message related information including a BASE-64 encoded copy of the query (line 23 .. 27).

### Security Requirements    

To ensure privacy the transaction must be secured using https with mutual authentication, with X.509 certificates
(extended validation required) and client and server side certificate validation.

Note:
- Some test environments dropped the mutual authentication or TLS for testing purposes. Please contact your test system provider on the details.

## Test Opportunity

The transaction can be tested with the test suite of the **[EPR reference environment](gazelle.md)**, test systems of the EPR communities or the **[EPR Playground](playground.md)**.
