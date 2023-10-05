# PIX Feed

Transaction to register a patient in a community. Primary systems shall use this transaction to register
patient data to be able to provide and retrieve documents to the patients EPR.

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

Primary systems shall use this transaction to register patient data with the local ID, the patient is
registered in the primary system. In the Swiss EPR the **[IHE PIX V3](https://profiles.ihe.net/ITI/TF/Volume1/ch-23.html)**
profile and transactions shall be used to register the patient data.  

To register the patient data the primary system shall perform a
**[Patient Identity Feed HL7 V3 \[ITI-44\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-44.html)**
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

# Transaction

## Message Semantics

Messages are encoded as described in the HL7 V3 standard with restrictions defined in the
**[IHE Patient Identity Feed HL7 V3](https://profiles.ihe.net/ITI/TF/Volume2/ITI-44.html)** profile
and the ordinances to the Swiss EPR.

### Request Message

Due to the genericity of the underlying **[HL7 V3](http://www.hl7.org)** standard, the request
message is quite lengthy. A raw version of a request message may be found
**[here](../samples/ITI-44_request_raw.xml)**.

For a step by step interpretation of the request message, see section below.

#### Message Interpretation

The request message is not very complex, but lengthy due to the genericity of the HL7 V3 standard.

The SOAP *Header* element shall convey the following information:

- *To* element: The URL of the provide and register document set service.
- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the request as defined in the IHE ITI Technical Framework.

Optional elements may be included according to the specification in the **[W3C SOAP specification](https://www.w3.org/TR/2007/REC-soap12-part0-20070427/#L26866)**.

```
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
(see section **[Security Requirements](PIXFeed.md#security-requirements)**).

The SOAP *Body* element conveys the administrative information required for a PRPA_IN201305UV02 message in HL7 V3 syntax.

Primary systems shall set the following values:
- *creationTime*: A timestamp in unix time format.
- *sender* : The OID of the sender application initiating the request.
- *receiver*: The OID of the receiver application which shall respond to the request.
 
```
1 <PRPA_IN201301UV02 xmlns="urn:hl7-org:v3" ITSVersion="XML_1.0">
2   <id extension="1694431245655" root="1.3.6.1.4.1.21367.2017.2.7.141"/>
3   <creationTime value="20230911115902"/>
4   <interactionId extension="PRPA_IN201301UV02" root="2.16.840.1.113883.1.18"/>
5   <processingCode code="T"/>
6   <processingModeCode code="T"/>
7   <acceptAckCode code="AL"/>
8   <receiver typeCode="RCV">
9     <device classCode="DEV" determinerCode="INSTANCE">
10       <id root="1.3.6.1.4.1.21367.2017.2.4.136"/>
11     </device>
12   </receiver>
13   <sender typeCode="SND">
14     <device classCode="DEV" determinerCode="INSTANCE">
15       <id root="1.3.6.1.4.1.21367.2017.2.2.140"/>
16     </device>
17   </sender>
```

The patient data are encoded in a HL7 V3 *controlActProcess* object as follows:

```
18 <controlActProcess classCode="CACT" moodCode="EVN">
19     <code code="PRPA_TE201301UV02" codeSystem="2.16.840.1.113883.1.18"/>
20     <subject contextConductionInd="false" typeCode="SUBJ">
21       <registrationEvent classCode="REG" moodCode="EVN">
22         <statusCode code="active"/>
23         <subject1 typeCode="SBJ">
24           <patient classCode="PAT">
25             <id assigningAuthorityName="MyPrimarySystem" extension="TestSystemId" root="1.3.6.1.4.1.21367.2017.2.5.89"/>
26             <id assigningAuthorityName="ZAS" extension="761337610435201235" root="2.16.756.5.30.1.127.3.10.3"/>
27             <statusCode code="active"/>
28             <patientPerson classCode="PSN" determinerCode="INSTANCE">
29               <name>
30                 <family>Muster</family>
31                 <given>Maja</given>
32               </name>
33               <name>
34                 <family qualifier="BR">Tauxe</family>
35                 <given>Maja</given>
36               </name>
37               <administrativeGenderCode code="F" codeSystem="2.16.840.1.113883.12.1" displayName="Female"/>
38               <birthTime value="19600618"/>
39               <addr>
40                 <city>Wettingen</city>
41                 <country>CH</country>
42                 <postalCode>5430</postalCode>
43                 <streetAddressLine>Imfeldstrasse 24b</streetAddressLine>
44               </addr>
45             </patientPerson>
46             <providerOrganization classCode="ORG" determinerCode="INSTANCE">
47               <id root="1.3.6.1.4.1.21367.2017.2.5.89"/>
48               <id root="2.16.756.5.30.1.127.3.10.3"/>
49               <name>MyCompany</name>
50               <contactParty classCode="CON">
51                 <contactPerson classCode="PSN" determinerCode="INSTANCE">
52                   <name xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="PN">
53                     <family>Administrator</family>
54                     <given>Max</given>
55                   </name>
56                 </contactPerson>
57               </contactParty>
58             </providerOrganization>
59           </patient>
60         </subject1>
61         <custodian typeCode="CST">
62           <assignedEntity classCode="ASSIGNED">
63             <id root="1.3.6.1.4.1.21367.2017.2.5.108"/>
64             <assignedOrganization classCode="ORG" determinerCode="INSTANCE">
65               <name xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ON">MyCompany</name>
66             </assignedOrganization>
67           </assignedEntity>
68         </custodian>
69       </registrationEvent>
70     </subject>
71   </controlActProcess>
```

The *subject* child element conveys the following information in its child elements.

The *patient* child element conveys the patients identifiers and patient demographics: 
- *id*: the local ID of the patient in the primary system (line 25) with the OID of the primary system in the *root* attribute. 
- *id*: the EPR-SPID of the patient provided by the ZAS (line 26) with the OID of the ZAS in the *root* attribute.  

The patients demographic data are conveyed in the *patientPerson* child element:  
- *name*: conveying the given and the family name of the patient.
- *administrativeGenderCode*: conveying the coded value of patient gender, taken from the value sets defined in
**[Annex 3](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.  
- *birthTime*: the data of birth of the matching patient data.
- *addr* : The address data of the patient.
- *custodian*: Information on the provider organization.

The *custodian* element shall convey the OID of the provider organization in the *id* child element:

```
61	<custodian typeCode="CST">
62  	<assignedEntity classCode="ASSIGNED">
63    <id root="1.3.6.1.4.1.21367.2017.2.5.108"/>
64    <assignedOrganization classCode="ORG" determinerCode="INSTANCE">
65    	<name xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ON">MyCompany</name>
66    </assignedOrganization>
67    </assignedEntity>
68  </custodian>
```

### Response Message

The PIX V3 Feed service responds with a message indicating the success of the transaction. A raw version of a response message may be found **[here](../samples/ITI-44_response.xml)**.

## Transport Protocol

The primary system shall send the request messages to the registry of the community using the http POST binding as defined in the **[W3C SOAP specification](https://www.w3.org/TR/2007/REC-soap12-part0-20070427/#L26866)**. It may look like:  

```
POST /PIXV3FeedService HTTP/1.1
Host: company.example.org
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
Content-Type: application/soap+xml; charset="utf-8"
Content-Length: nnn  
```

## Audit Log

Primary systems shall store syslog messages to the audit record repository of the community using TLS transport protocol.
The audit message uses XML formatting as specified in **[RFC 3881](https://tools.ietf.org/html/rfc3881)** with restrictions
specified in the **[IHE ITI TF](https://ehealthsuisse.ihe-europe.net/gss/audit-messages/view.seam?id=701)** and the
**[Extension 1 to Annex5](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)** in the ordinances of the Swiss electronic patient record (see Section
1.5 "Requirements on ATNA").  

The following snippet shows a example audit message to be written by the primary system:

```
1 <?xml version='1.0' encoding='utf-8'?>
2 <AuditMessage>
3  <EventIdentification EventDateTime="2020-09-21T15:25:53.616+02:00" EventOutcomeIndicator="0" EventActionCode="C">
4   <EventID csd-code="110110" codeSystemName="DCM" originalText="Patient Record"/>
5   <EventTypeCode csd-code="ITI-44" codeSystemName="IHE Transactions" originalText="Patient Identity Feed"/>
6   <EventOutcomeDescription/>
7  </EventIdentification>
8  <ActiveParticipant AlternativeUserID="primary.system.alt.ID" UserID="primary.system.ID" UserIsRequestor="true" NetworkAccessPointID="https://my_primary_system.com/" NetworkAccessPointTypeCode="1">
9   <RoleIDCode csd-code="110153" codeSystemName="DCM" originalText="Source"/>
10  </ActiveParticipant>
11  <ActiveParticipant AlternativeUserID="plattform.mpi.alt.ID" UserID="plattform.mpi.ID" UserIsRequestor="false" NetworkAccessPointID="https://platform.com/mock/patientRegister" NetworkAccessPointTypeCode="1">
12   <RoleIDCode csd-code="110152" codeSystemName="DCM" originalText="Destination"/>
13  </ActiveParticipant>
14  <AuditSourceIdentification AuditSourceID="primary.system.alt.ID" AuditEnterpriseSiteID="2.16.756.5.30.1.174.1.5.1">
15   <AuditSourceTypeCode csd-code="4" codeSystemName="DCM" originalText="Client Process"/>
16  </AuditSourceIdentification>
17  <ParticipantObjectIdentification ParticipantObjectID="11234^^^&amp;2.16.756.5.30.1.174.1.9999.1&amp;ISO" ParticipantObjectTypeCode="1" ParticipantObjectTypeCodeRole="1">
18   <ParticipantObjectIDTypeCode csd-code="2" codeSystemName="RFC-3881" originalText="Patient Number"/>
19   <ParticipantObjectDetail type="II" value="ZGVmYXVsdA=="/>
20  </ParticipantObjectIdentification>
21  <ParticipantObjectIdentification ParticipantObjectID="urn:uuid:4d42d62d-30b7-4ad4-a9e2-c3f0dd1d50f9" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="24">
22   <ParticipantObjectIDTypeCode csd-code="ITI-44" codeSystemName="IHE Transactions" originalText="Patient Identity Feed"/>
23   <ParticipantObjectQuery>
24    <!-- omitted for brevity -->
25   </ParticipantObjectQuery>
26   <ParticipantObjectDetail type="II" value="ZGVmYXVsdA=="/>
27  </ParticipantObjectIdentification>
28 </AuditMessage>
```

The message is made of the following blocks:
- *EventIdentification*: Event related information including the timestamp (line 3 .. 7).
- *ActiveParticipant*: Information related to the primary system performing the query (line 8 .. 10).
- *ActiveParticipant*: Information on the responding service endpoint (line 11 .. 13).
- *AuditSourceIdentification*: Information related to the primary system performing the query (line 14 .. 16)
- *ParticipantObjectIdentification*: Information on the patients EPR accessed (line 17 .. 20)
- *ParticipantObjectIdentification*: Request message related information including a UUencoded copy of the query (line 21 .. 27).

## Security Requirements  

To ensure privacy the transaction must be secured using https with mutual authentication, with X.509 certificates
(extended validation required) and client and server side certificate validation.

Note:
- Some test environments dropped the mutual authentication or TLS for testing purposes. Please contact your test system provider on the details.

# Test Opportunity

The transaction can be tested with the test suite of the **[EPR reference environment](./gazelle.md)**, test systems of the EPR communities or the **[EPR Playground](./playground.md)**.
