# Patient Demographics Query

Transaction to search for patient identities and data from a community using the patient demographic data as search criteria. Primary systems may use this transaction to verify if a patient uses a Swiss EPR and is already registered in the community.  

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

Primary systems may use this transaction to search for patients which are already registered in the community, either
because the patient opened the Swiss EPR in the community or because the patient opened the Swiss EPR in a remote
community and was already registered by another primary system to store documents. In the Swiss EPR the
**[IHE PDQV3](https://profiles.ihe.net/ITI/TF/Volume1/ch-24.html)** profile and transactions shall be used to search for
patients by demographic data.

To search for patients the primary system shall perform a
**[Patient Demographic Query \[ITI-47\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-47.html)**. Within the query request
the primary system shall provide the demographic data as search criteria. In the Swiss EPR each community must support the
name, birthdate, gender and nationality. Individual communities may support other demographic data (e.g., address and other
contact data).  

The community sends a response with all patient data sets matching the search criteria. Each patient data set contains the
known demographic data, the EPR-SPID and the assigned ID. The response contains the master data set as well as all known
patient data sets, as registered by other primary systems.    

# Transaction

## Message Semantics

Messages are encoded as described in the HL7 V3 standard with restrictions defined in the
**[IHE PDQ V3](https://profiles.ihe.net/ITI/TF/Volume2/ITI-47.html)** profile and the ordinances to the Swiss EPR.

### Request Message

Since the **[HL7 V3](http://www.hl7.org)** standard is very generic, the request message is quite lengthy and needs some
background information to interpret. The raw version of a request message may be found
**[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-47_request_raw.xml)**. For a step by step interpretation
of the request message, see section below.

#### Message Interpretation

The request message is not very complex, but lengthy due to the genericity of the HL7 V3 standard.
Therefore the following step by step interpretation may be of help to interpret the response.

The SOAP *Header* element conveys the following information:

- *To* element: The URL of the provide an register document set service.
- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the request as defined in the IHE ITI Technical Framework.

```
2  <soap:Header>
3   <Action soap:mustUnderstand="true"
4    xmlns="http://www.w3.org/2005/08/addressing">urn:hl7-org:v3:PRPA_IN201305UV02</Action>
5   <MessageID xmlns="http://www.w3.org/2005/08/addressing">urn:uuid:9fe7246b-8fab-4dd7-976e-c81bc1955575</MessageID>
6   <To xmlns="http://www.w3.org/2005/08/addressing">https://epd-test.ith-icoserve.com:7443/PIXPDQ/services/PIXPDQV3ManagerService</To>
7   <ReplyTo xmlns="http://www.w3.org/2005/08/addressing">
8    <Address>http://www.w3.org/2005/08/addressing/anonymous</Address>
9   </ReplyTo>
10  </soap:Header>
```

For the patient demographic query no *Security* header element is required, since in the Swiss EPR the access to the patient
data is authorized for all applications, which are registered and authenticate with a client certificate
(see section **[Security Requirements](PDQ.md#security-requirements)**).

The SOAP *Body* element conveys the administrative information required for a PRPA_IN201305UV02 message in HL7 V3 syntax in
which primary systems must set the following values:
- *creationTime*: A timestamp in unix time format.
- *sender* : The OID of the sender application initiating the request.
- *receiver*: The OID of the receiver application which shall respond to the request.

```
13    <id root="1.2.3.4"/>
14    <creationTime value="20230911143411"/>
15    <interactionId extension="PRPA_IN201305UV02" root="2.16.840.1.113883.1.6"/>
16    <processingCode code="P"/>
17    <processingModeCode code="T"/>
18    <acceptAckCode code="AL"/>
19    <receiver typeCode="RCV">
20     <device classCode="DEV" determinerCode="INSTANCE">
21      <id root="1.3.6.1.4.1.21367.2017.2.5.97"/>
22      <asAgent classCode="AGNT">
23       <representedOrganization classCode="ORG" determinerCode="INSTANCE">
24        <id root="1.3.6.1.4.1.21367.2017.2.7.127"/>
25       </representedOrganization>
26      </asAgent>
27     </device>
28    </receiver>
29    <sender typeCode="SND">
30     <device classCode="DEV" determinerCode="INSTANCE">
31      <id root="1.2.3.4"/>
32     </device>
33    </sender>
```

The query is encoded in a HL7 V3 *controlAct* object as follows:

```
34    <controlActProcess classCode="CACT" moodCode="EVN">
35     <code code="PRPA_TE201305UV02" codeSystem="2.16.840.1.113883.1.6"/>
36     <queryByParameter>
37      <queryId extension="16944356511831" root="1.2.840.114350.1.13.28.1.18.5.999"/>
38      <statusCode code="new"/>
39      <responseModalityCode code="R"/>
40      <responsePriorityCode code="I"/>
41      <parameterList>
42       <livingSubjectId>
43        <value extension="08242eb8-dd47-4298-8d2f-25d60114f137" root="1.1.1.2.2"/>
44        <semanticsText>LivingSubject.id</semanticsText>
45       </livingSubjectId>
46       <otherIDsScopingOrganization>
47        <value root="1.3.6.1.4.1.21367.2017.2.5.93"/>
48        <semanticsText>OtherIDs.scopingOrganization.id</semanticsText>
49       </otherIDsScopingOrganization>
50       <otherIDsScopingOrganization>
51        <value root="2.16.756.5.30.1.127.3.10.3"/>
52        <semanticsText>OtherIDs.scopingOrganization.id</semanticsText>
53       </otherIDsScopingOrganization>
54      </parameterList>
55     </queryByParameter>
56    </controlActProcess>
```

The HL7 *controlAct* object conveys the query search parameter in a HL7 V3 *parameterList* element.

In the above example these are 
- the *livingSubjectId* conveying the local ID in the primary system of the patient data to search for,
- the *otherIDsScopingOrganization* to match with the registered patient data,  

```
41      <parameterList>
42       <livingSubjectId>
43        <value extension="08242eb8-dd47-4298-8d2f-25d60114f137" root="1.1.1.2.2"/>
44        <semanticsText>LivingSubject.id</semanticsText>
45       </livingSubjectId>
46       <otherIDsScopingOrganization>
47        <value root="1.3.6.1.4.1.21367.2017.2.5.93"/>
48        <semanticsText>OtherIDs.scopingOrganization.id</semanticsText>
49       </otherIDsScopingOrganization>
50       <otherIDsScopingOrganization>
51        <value root="2.16.756.5.30.1.127.3.10.3"/>
52        <semanticsText>OtherIDs.scopingOrganization.id</semanticsText>
53       </otherIDsScopingOrganization>
54      </parameterList>
55     </queryByParameter>
```

The query supports many more search options and filter parameter. For a documentation of the options
see **[IHE PDQ V3](https://profiles.ihe.net/ITI/TF/Volume2/ITI-47.html#3.47)**.

### Response Message

Since the **[HL7 V3](http://www.hl7.org)** standard is very generic, the response message is quite lengthy and needs some
background information to interpret. The raw version of a response message may be found
**[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-47_response_raw.xml)**. For a step by step interpretation of the message, see section below.

#### Message Interpretation

The PDQV3 service responds with a list of patient data which match the search parameter in a HL7 V3 *subject* child element
of the *controlAct* object. The *subject* child element conveys the following information:

- *id*: the XAD PID, which identifies the patient in the community (line 50)  and the EPR-SPID (line 51).
- *name*: conveying the given and the family names of the matching patient data (line 54).
- *administrativeGenderCode*: conveying the coded value of patient gender (line 58), taken from the value sets defined in
**[Annex 3](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.  
- *birthTime*: the data of birth of the matching patient data (line 59).
- *addr*: The address data of the patient (line 60).     

```
49        <ns1:patient classCode="PAT">
50         <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:II" root="1.3.6.1.4.1.21367.2017.2.5.93" extension="25f98b34-0e01-48b7-a06c-f706eb4c485f" assigningAuthorityName="XDS Affinity Domain"/>
51         <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:II" root="2.16.756.5.30.1.127.3.10.3" extension="761337610411353650" assigningAuthorityName="SPID"/>
52         <ns1:statusCode code="active"/>
53         <ns1:patientPerson classCode="PSN" determinerCode="INSTANCE">
54          <ns1:name xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:PN">
55           <ns1:given>Dylan Jose</ns1:given>
56           <ns1:family>Dell</ns1:family>
57          </ns1:name>
58          <ns1:administrativeGenderCode code="F"/>
59          <ns1:birthTime xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:TS" value="19890622"/>
60          <ns1:addr xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:AD" use="HP">
61           <ns1:city>Pontarlier</ns1:city>
62           <ns1:postalCode>25300</ns1:postalCode>
63           <ns1:streetName>Ruelle de la Tour</ns1:streetName>
64          </ns1:addr>
65         </ns1:patientPerson>
66         <ns1:providerOrganization classCode="ORG" determinerCode="INSTANCE">
67          <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:II" root="1.3.6.1.4.1.21367.13.20.2000"/>
68          <ns1:contactParty classCode="CON"/>
69         </ns1:providerOrganization>
70         <ns1:subjectOf1>
71          <ns1:queryMatchObservation classCode="COND" moodCode="EVN">
72           <ns1:code xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:CD" code="IHE_PDQ"/>
73           <ns1:value xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:INT" value="100"/>
74          </ns1:queryMatchObservation>
75         </ns1:subjectOf1>
76        </ns1:patient>
```

## Transport Protocol

The primary system shall send the request messages to the registry of the community using the http POST binding as defined in the **[W3C SOAP specification](https://www.w3.org/TR/2007/REC-soap12-part0-20070427/#L26866)**. It may look like:  

```
POST /PDQV3Service HTTP/1.1
Host: company.example.org
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
Content-Type: application/soap+xml; charset="utf-8"
Content-Length: nnnn  
```

## Audit Log

Primary systems shall store syslog messages to the audit record repository of the community using TLS transport protocol.
The audit message uses XML formatting as specified in **[RFC 3881](https://tools.ietf.org/html/rfc3881)** with restrictions
specified in the **[IHE ITI TF](https://ehealthsuisse.ihe-europe.net/gss/audit-messages/view.seam?id=703)** and the
**[Extension 1 to Annex5](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)** in the ordinances of the Swiss electronic patient record (see Section
1.5 "Requirements on ATNA").

```
1 <?xml version='1.0' encoding='utf-8'?>
2 <AuditMessage>
3  <EventIdentification EventActionCode="E" EventDateTime="2020-09-30T19:27:29.386Z" EventOutcomeIndicator="0">
4   <EventID csd-code="110112" codeSystemName="DCM" originalText="Query"></EventID>
5   <EventTypeCode csd-code="ITI-47" codeSystemName="IHE Transactions" originalText="Patient Demographics Query"></EventTypeCode>
6  </EventIdentification>
7  <ActiveParticipant UserID="https://my_primary_system.com/PDQConsumer" AlternativeUserID="201809" UserIsRequestor="true" NetworkAccessPointID="0045e6d09dd0" NetworkAccessPointTypeCode="1">
8   <RoleIDCode csd-code="110153" codeSystemName="DCM" originalText="Source Role ID"></RoleIDCode>
9  </ActiveParticipant>
10  <ActiveParticipant UserID="_SYSTEM" UserIsRequestor="true" NetworkAccessPointID="0045e6d09dd0" NetworkAccessPointTypeCode="1">
11   <RoleIDCode csd-code="%All" codeSystemName="HealthShare" originalText="%All"></RoleIDCode>
12  </ActiveParticipant>
13  <ActiveParticipant UserID="https://ehealthsuisse.ihe-europe.net/PDQService" UserIsRequestor="false" NetworkAccessPointID="ehealthsuisse.ihe-europe.net" NetworkAccessPointTypeCode="1">
14   <RoleIDCode csd-code="110152" codeSystemName="DCM" originalText="Destination Role ID"></RoleIDCode>
15  </ActiveParticipant>
16  <AuditSourceIdentification AuditEnterpriseSiteID="2.16.756.5.30.1.109.6.1.3.1.1" AuditSourceID="my.primary.system.ID">
17   <AuditSourceTypeCode csd-code="4"></AuditSourceTypeCode>
18  </AuditSourceIdentification>
19  <ParticipantObjectIdentification ParticipantObjectID="CHPAM34^^^&amp;1.3.6.1.4.1.12559.11.20.1&amp;ISO" ParticipantObjectTypeCode="1" ParticipantObjectTypeCodeRole="1">
20   <ParticipantObjectIDTypeCode csd-code="2" codeSystemName="RFC-3881" originalText="Patient Number"></ParticipantObjectIDTypeCode>
21   <ParticipantObjectName>^Neil^Mellisa</ParticipantObjectName>
22   <ParticipantObjectDetail type="II" value="RjlENjJBNjgtMDM1Mi0xMUVCLUE2RTgtMDI0MkFDMTQwMDAy"></ParticipantObjectDetail>
23  </ParticipantObjectIdentification>
24  <ParticipantObjectIdentification ParticipantObjectID="1^^^&amp;F9D62A4A-0352-11EB-A6E8-0242AC140002&amp;ISO" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="24">
25   <ParticipantObjectIDTypeCode csd-code="ITI-47" codeSystemName="IHE Transactions" originalText="Patient Demographics Query"></ParticipantObjectIDTypeCode>
26   <ParticipantObjectQuery> <!-- BASE-64 encoded copy of the query message --> </ParticipantObjectQuery>
27   <ParticipantObjectDetail type="MSH-10" value="MV5eXiZGOUQ2MkE2OC0wMzUyLTExRUItQTZFOC0wMjQyQUMxNDAwMDImSVNP"></ParticipantObjectDetail>
28  </ParticipantObjectIdentification>
29 </AuditMessage>   
```

The message is made of the following blocks:
- *EventIdentification*: Event related information including the timestamp (line 3 .. 6).
- *ActiveParticipant*: Information related to the primary system performing the query (line 7 .. 9).
- *ActiveParticipant*: Information on the user initiating the transaction (line 10 .. 12).
- *ActiveParticipant*: Information on the responding service endpoint (line 13 .. 15).
- *AuditSourceIdentification*: Information related to the primary system performing the query (line 16 .. 18)
- *ParticipantObjectIdentification*: Information on the patients EPR accessed (line 19 .. 23)
- *ParticipantObjectIdentification*: Request message related information including a UBASE-64 encoded copy of the query (line 24 .. 28).

## Security Requirements  

To ensure privacy the transaction must be secured using https with mutual authentication, with X.509 certificates
(extended validation required) and client and server side certificate validation.

Note:
- Some test environments dropped the mutual authentication or TLS for testing purposes. Please contact your test system provider on the details.

# Test Opportunity

The transaction can be tested with the test suite of the **[EPR reference environment](gazelle.md)**, test systems of the EPR communities or the **[EPR Playground](playground.md)**.
