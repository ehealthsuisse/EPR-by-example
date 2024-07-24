# PIX Feed

Transaction to register a patient in a community. Primary systems shall use this transaction to register
patient data to be able to provide and retrieve documents to the patients EPR.

## Overview

Primary systems shall use this transaction to register patient data with the local ID, the patient is
registered in the primary system. In the Swiss EPR the [IHE PIX V3](https://profiles.ihe.net/ITI/TF/Volume1/ch-23.html)
profile and transactions shall be used to register the patient data.  

To register the patient data the primary system shall perform a
[Patient Identity Feed HL7 V3 \[ITI-44\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-44.html)
transaction. In the feed request the primary system must provide the demographic data as provided by
the ZAS central service, which includes the name, birthdate, gender, nationality and the EPR-SPID.
Primary systems may provide other demographic data (e.g., address and other contact data).

The community response includes a success confirmation, or a error code in the case an error
occurred in the community during registration. In case of success the community stores the patient data
provided by the primary system, matches the data set to other patient data set registered by other
primary systems and assigns the patient data set to a master patient record and the master patient ID
(XAD-PID).

To perform the PIX V3 feed fo the EPR, primary systems must retrieve the demographic data and the
EPR-SPID from the ZAS central service. While the interface to be used by the communities is specified in
the ordinances to the Swiss electronic patient dossier, the interface for primary systems is not, since
communities provide simplified interfaces for primary systems to retrieve the data or included the
interface in the registration workflow. Please contact the community you want to connect to on
implementation details.   

## Transaction

### Message Semantics

Messages are encoded as described in the HL7 V3 standard with restrictions defined in the
[IHE Patient Identity Feed HL7 V3](https://profiles.ihe.net/ITI/TF/Volume2/ITI-44.html) profile
and the ordinances to the Swiss EPR.

#### Request Message

Due to the genericity of the underlying [HL7 V3][hl7] standard, the request
message is quite lengthy. A raw version of a request message may be found
[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-44_request_raw.xml).

For a step by step interpretation of the request message, see section below.

##### Message Interpretation

The request message is not very complex, but lengthy due to the genericity of the HL7 V3 standard.

The SOAP *Header* element shall convey the following information:

- *To* element: The URL of the provide and register document set service.
- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the request as defined in the IHE ITI Technical Framework.

Optional elements may be included according to the specification in the [W3C SOAP specification][soap].

```xml title="SOAP header" linenums="1" hl_lines="3-5"
<soap:Header>
  	<Action xmlns="http://www.w3.org/2005/08/addressing">urn:hl7-org:v3:PRPA_IN201301UV02</Action>
	<MessageID xmlns="http://www.w3.org/2005/08/addressing">urn:uuid:7a180388-6ba7-4cbc-bffe-dfcdc4e602b7</MessageID>
	<To xmlns="http://www.w3.org/2005/08/addressing">http://epd-core.int.adswissnet.healthcare/mpi/pixmanager</To>
	<ReplyTo xmlns="http://www.w3.org/2005/08/addressing">
	    <Address>http://www.w3.org/2005/08/addressing/anonymous</Address>
	</ReplyTo>
</soap:Header>
```

For the patient identity feed no *Security* header element is required, since in the Swiss EPR the access to the patient
data is authorized for all applications, which are registered in the community and authenticate with a client certificate
(see section [Security Requirements](PIXFeed.md#security-requirements)).

The SOAP *Body* element conveys the administrative information required for a PRPA_IN201305UV02 message in HL7 V3 syntax.

Primary systems shall set the following values:

- *creationTime*: A timestamp in unix time format.
- *sender* : The OID of the sender application initiating the request.
- *receiver*: The OID of the receiver application which shall respond to the request.

```xml title="PRPA_IN201301UV02 message" linenums="2"
--8<-- "samples/ITI-44_request_raw.xml:2:17"
```

The patient data are encoded in a HL7 V3 *controlActProcess* object as follows:

```xml title="controlActProcess element" linenums="18"
--8<-- "samples/ITI-44_request_raw.xml:18:60"
```

The *subject* child element conveys the following information in its child elements.

The *patient* child element conveys the patients identifiers and patient demographics: 

- *id*: the local ID of the patient in the primary system (line 25) with the OID of the primary system in the *root* attribute. 
- *id*: the EPR-SPID of the patient provided by the ZAS (line 26) with the OID of the ZAS in the *root* attribute.  

The patients demographic data are conveyed in the *patientPerson* child element:

- *name*: conveying the given and the family name of the patient.
- *administrativeGenderCode*: conveying the coded value of patient gender, taken from the value sets defined in
[Annex 3][annexes].  
- *birthTime*: the data of birth of the matching patient data.
- *addr* : The address data of the patient.
- *custodian*: Information on the provider organization.

The *custodian* element shall convey the OID of the provider organization in the *id* child element:

```xml title="custodian element" linenums="61"
--8<-- "samples/ITI-44_request_raw.xml:61:71"
```

#### Response Message

The PIX V3 Feed service responds with a message indicating the success of the transaction. A raw version of a response message may be found [here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-44_response.xml).

### Transport Protocol

The primary system shall send the request messages to the registry of the community using the http POST binding as defined in the [W3C SOAP specification][soap]. It may look like:  

```http linenums="1"
POST /PIXV3FeedService HTTP/1.1
Host: company.example.org
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
Content-Type: application/soap+xml; charset="utf-8"
Content-Length: nnn  
```

### Audit Log

Primary systems shall store syslog messages to the audit record repository of the community using TLS transport protocol.
The audit message uses XML formatting as specified in [RFC 3881][rfc3881] with restrictions
specified in the [IHE ITI TF](https://ehealthsuisse.ihe-europe.net/gss/audit-messages/view.seam?id=701) and the
[Extension 1 to Annex5][annexes] in the ordinances of the Swiss electronic patient record (see Section
1.5 "Requirements on ATNA").  

The following snippet shows a example audit message to be written by the primary system:

```xml title="iti-44-log.xml" linenums="1"
--8<-- "samples/iti-44-log.xml"
```

The message is made of the following blocks:

- *EventIdentification*: Event related information including the timestamp (line 3 .. 7).
- *ActiveParticipant*: Information related to the primary system performing the query (line 8 .. 10).
- *ActiveParticipant*: Information on the responding service endpoint (line 11 .. 13).
- *AuditSourceIdentification*: Information related to the primary system performing the query (line 14 .. 16)
- *ParticipantObjectIdentification*: Information on the patients EPR accessed (line 17 .. 20)
- *ParticipantObjectIdentification*: Request message related information including a BASE-64 encoded copy of the query (line 21 .. 27).

### Security Requirements  

To ensure privacy the transaction must be secured using https with mutual authentication, with X.509 certificates
(extended validation required) and client and server side certificate validation.

!!! note
    - Some test environments dropped the mutual authentication or TLS for testing purposes. Please contact your test system provider on the details.

## Test Opportunity

The transaction can be tested with the test suite of the [EPR reference environment](gazelle.md), test systems of the EPR communities or the **[EPR Playground](playground.md).
