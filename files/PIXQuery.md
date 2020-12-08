# PIX Query
Transaction to get the master patient ID of a patient in a community using the local ID.

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

Primary systems shall use this transaction to retrieve the master patient ID (XAD-SPID) for patients the primary
systems wants to retrieve or provide documents for. In the Swiss EPR the
**[IHE PIX V3](https://profiles.ihe.net/ITI/TF/Volume1/ch-23.html)** profile and transactions shall be used to retrieve
the master patient ID.  

To retrieve the master patient ID for the patient to access the patients EPR, the the primary system shall perform a
**[Patient V3 Query \[ITI-45\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-45.html)**. Within the query request the
primary system shall provide the local ID of the patient in the primary system, as well as the *data source* parameter
of the assigning authority of the community and the the assigning authority EPR-SPID. The local ID must match the local
ID the primary system registered the patient with (see **[PIX Feed](./PIXFeed.md)**).  

If the patient is registered in the community, the community sends a response with the master patient ID (XAD-PID) and
the EPR-SPID.

# Transaction

## Message Semantics

Messages are encoded as described in the HL7 V3 standard with restictions defined in the
**[IHE PIX V3 Query](https://profiles.ihe.net/ITI/TF/Volume2/ITI-45.html)** profile and the ordinances to the Swiss EPR.

### Request Message

Due to the genericity of the underlying **[HL7 V3](http://www.hl7.org)** standard, the request message is quite lengthy.
A raw version of a request message may be found
**[here](https://github.com/msmock/AnnotatedTX/blob/main/samples/ITI-45_request.xml)**.

For a step by step interpretation of the request message, see section below.

#### Message Interpretation

The request message is not complex in nature, but quite lengthy due to the genericity of the HL7 V3 standard.

The SOAP *Header* element shall conveys the following information:

- *To* element: The URL of the provide an register document set service.
- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the request as defined in the IHE ITI Technical Framework.

Optional elements may be included according to the specification in the **[W3C SOAP specification](https://www.w3.org/TR/2007/REC-soap12-part0-20070427/#L26866)**.

```
2  <env:Header>
3   <wsa:To xmlns:wsa="http://www.w3.org/2005/08/addressing">
4    https://epd-test.ith-icoserve.com:7443/PIXPDQ/services/PIXV3Service
5   </wsa:To>
6   <wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing">urn:uuid:c12e1f14-c2c9-4a94-ba27-6411e8c90b75</wsa:MessageID>
7   <wsa:ReplyTo xmlns:wsa="http://www.w3.org/2005/08/addressing">
8    <wsa:Address>http://www.w3.org/2005/08/addressing/anonymous</wsa:Address>
9   </wsa:ReplyTo>
10   <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing" env:mustUnderstand="1">urn:hl7-org:v3:PRPA_IN201309UV02</wsa:Action>
11  </env:Header>
```

For the PIX query no *Security* header element is required, since in the Swiss EPR the access to the patient
data is authorized for all applications, which are registered in the community and authenticate with a client certificate
(see section **[Security Requirements](PIXFeed.md#security-requirements)**).

The SOAP *Body* element conveys the administrative information required for a HL7 V3 PRPA_IN201310UV02 message in HL7 V3 syntax.

Primary systems shall set the following values:
- *creationTime*: A timestamp in unix time format.
- *sender* : The OID of the sender application initiating the request.
- *receiver*: The OID of the receiver application which shall respond to the request.

```
12  <env:Body>
13   <PRPA_IN201309UV02 xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ITSVersion="XML_1.0">
14    <id root="1.3.6.1.4.1.21367.2017.2.5.55"/>
15    <creationTime value="20200921170501.122"/>
16    <interactionId extension="PRPA_IN201309UV02" root="2.16.840.1.113883.1.6"/>
17    <processingCode code="P"/>
18    <processingModeCode code="T"/>
19    <acceptAckCode code="AL"/>
20    <receiver typeCode="RCV">
21     <device classCode="DEV" determinerCode="INSTANCE">
22      <id root="1.3.6.1.4.1.21367.2017.2.4.105"/>
23     </device>
24    </receiver>
25    <sender typeCode="SND">
26     <device classCode="DEV" determinerCode="INSTANCE">
27      <id root="1.3.6.1.4.1.21367.2017.2.5.55"/>
28     </device>
29    </sender>  
```

The query parameter are encoded in a HL7 V3 *controlActProcess* element of the message. Primary systems shall set the following query attributes:

- *authorOrPerformer*: The OID of the primary system in the *id* element.

```
30    <controlActProcess classCode="CACT" moodCode="EVN">
31     <code code="PRPA_TE201309UV02" codeSystem="2.16.840.1.113883.1.6"/>
32     <authorOrPerformer typeCode="AUT">
33      <assignedPerson classCode="ASSIGNED">
34       <id extension="client application" root="1.3.6.1.4.1.24930"/>
35      </assignedPerson>
36     </authorOrPerformer>
```

The query parameter are conveyed in the *queryByParameter* child element:

- *queryId*: A unique ID of the query.
- *dataSource*: The OID of the assigning authority of the community, or the OID of the assigning authority of the EPR-SPID.
- *patientIdentifier*: The ID of the patient data in the primary system, with the OID of the primary system in the *root* element and the local ID in the *extension* element.

```
37     <queryByParameter>
38      <queryId root="4ecd362e-8d17-4abe-b991-3793bc2e1399"/>
39      <statusCode code="new"/>
40      <responsePriorityCode code="I"/>
41      <parameterList>
42       <dataSource>
43        <value root="1.3.6.1.4.1.21367.2017.2.5.45"/>
44        <semanticsText>DataSource.id</semanticsText>
45       </dataSource>
46       <patientIdentifier>
47        <value extension="CHFACILITY9810" root="1.3.6.1.4.1.12559.11.25.1.19"/>
48        <semanticsText>Patient.Id</semanticsText>
49       </patientIdentifier>
50      </parameterList>
51     </queryByParameter>
52    </controlActProcess>
```

**TODO**: Adapt to the update of the ordinances planned for April 2021.

### Response Message

The PIX V3 Feed service responds with the master patient ID and the EPR-SPID, the patient is regitered with in the community.

#### Message Interpretation

The request message is not complex in nature, but quite lengthy due to the genericity of the HL7 V3 standard. A raw version of a response message may be found **[here](https://github.com/msmock/AnnotatedTX/blob/main/samples/ITI-45_response.xml)**.

```
code block here    
```

## Transport Protocol

TBD

```
POST /PIXV3QueryService HTTP/1.1
Host: company.example.org
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
Content-Type: application/soap+xml; charset="utf-8"
Content-Length: nnnn    
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
