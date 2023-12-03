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

Due to the genericity of the underlying **[HL7 V3](http://www.hl7.org)** standard, the request message is quite lengthy.
A raw version of a request message may be found
**[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-45_request_raw.xml)**.

For a step by step interpretation of the request message, see section below.

##### Message Interpretation

The request message is not complex in nature, but quite lengthy due to the genericity of the HL7 V3 standard.

The SOAP *Header* element shall convey the following information:

- *To* element: The URL of the provide and register document set service.
- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the request as defined in the IHE ITI Technical Framework.

Optional elements may be included according to the specification in the **[W3C SOAP specification](https://www.w3.org/TR/2007/REC-soap12-part0-20070427/#L26866)**.

```
1 <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
2  <env:Header>
3   <wsa:To xmlns:wsa="http://www.w3.org/2005/08/addressing">
4    https://epd-test.ith-icoserve.com:7443/PIXPDQ/services/PIXPDQV3ManagerService
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
2  <env:Body>
13   <PRPA_IN201309UV02 xmlns="urn:hl7-org:v3" ITSVersion="XML_1.0">
14    <id extension="1694523036420" root="1.3.6.1.4.1.21367.2017.2.7.141"/>
15    <creationTime value="20230912131951"/>
16    <interactionId extension="PRPA_IN201309UV02" root="2.16.840.1.113883.1.6"/>
17    <processingCode code="T"/>
18    <processingModeCode code="T"/>
19    <acceptAckCode code="AL"/>
20    <receiver typeCode="RCV">
21     <device classCode="DEV" determinerCode="INSTANCE">
22      <id root="1.3.6.1.4.1.21367.2017.2.4.136"/>
23     </device>
24    </receiver>
25    <sender typeCode="SND">
26     <device classCode="DEV" determinerCode="INSTANCE">
27      <id root="1.3.6.1.4.1.21367.2017.2.2.140"/>
28     </device>
29    </sender>
```

The query parameter are encoded in a HL7 V3 *controlActProcess* element of the message. Primary systems shall set the following query attributes:

- *authorOrPerformer*: The OID of the primary system in the *id* element.

```
30    <controlActProcess classCode="CACT" moodCode="EVN">
31     <code code="PRPA_TE201309UV02" displayName="2.16.840.1.113883.1.6"/>
32     <authorOrPerformer typeCode="AUT">
33      <assignedPerson classCode="ASSIGNED">
34       <id root="1.3.6.1.4.1.21367.2017.2.5.108"/>
35      </assignedPerson>
36     </authorOrPerformer>
```

The query parameter are conveyed in the *queryByParameter* child element:

- *queryId*: A unique ID of the query.
- *dataSource*: The OID of the assigning authority of the community (line 43). 
- *dataSource*: The OID of the assigning authority of the EPR-SPID (line 46).
- *patientIdentifier*: The ID of the patient data in the primary system, with the OID of the primary system in the *root* element and the local ID in the *extension* element.

```
37     <queryByParameter>
38      <queryId extension="1694523036421" root="1.3.6.1.4.1.21367.2017.2.7.141"/>
39      <statusCode code="new"/>
40      <responsePriorityCode code="I"/>
41      <parameterList>
42       <dataSource>
43        <value root="1.3.6.1.4.1.21367.2017.2.5.93"/>
44        <semanticsText>DataSource.id</semanticsText>
45       </dataSource>
46       <dataSource>
47        <value root="2.16.756.5.30.1.127.3.10.3"/>
48        <semanticsText>DataSource.id</semanticsText>
49       </dataSource>
50       <patientIdentifier>
51        <value extension="900010" root="1.3.6.1.4.1.21367.2017.2.5.103"/>
52        <semanticsText>Patient.id</semanticsText>
53       </patientIdentifier>
54      </parameterList>
55     </queryByParameter>
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

```
1 <soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope">
2   <soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
3     <wsa:Action xmlns:mustUnderstand="http://www.w3.org/2003/05/soap-envelope" mustUnderstand:mustUnderstand="1">urn:hl7-org:v3:PRPA_IN201310UV02</wsa:Action>
4     <wsa:RelatesTo>urn:uuid:c12e1f14-c2c9-4a94-ba27-6411e8c90b75</wsa:RelatesTo>
5   </soapenv:Header>
```

The SOAP *Body* element conveys the administrative information required for a PRPA_IN201310UV02 message in HL7 V3 syntax
and the query result encoded in the *controlActProcess* element.

The *controlActProcess* element conveys the following information for the primary system in the *subject* child element:

The *patient* child element conveys the master patient ID (XAD-SPID) and the EPR-SPID as follows:
- *id* : The master patient ID (XAD-SPID), with the community OID as the assigning authority in the *root* and the ID in the *extension* attribute (line 49).
- *id* : The EPR-SPID, with the OID of the ZAS as assigning authority in the *root* and the ID in the *extension* attribute (line 50).

```
44           <ns1:registrationEvent classCode="REG" moodCode="EVN">
45             <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" nullFlavor="NA" xsi:type="ns1:II"/>
46             <ns1:statusCode code="active"/>
47             <ns1:subject1 typeCode="SBJ">
48               <ns1:patient classCode="PAT">
49                 <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" assigningAuthorityName="XDS Affinity Domain" extension="7f2e05e6-673e-44b6-8b76-e17ac58ea80f" root="1.3.6.1.4.1.21367.2017.2.5.93" xsi:type="ns1:II"/>
50                 <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" assigningAuthorityName="SPID" extension="761337610435209810" root="2.16.756.5.30.1.127.3.10.3" xsi:type="ns1:II"/>
51                 <ns1:statusCode code="active"/>
52                 <ns1:patientPerson classCode="PSN" determinerCode="INSTANCE">
53                   <ns1:name xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" nullFlavor="NA" xsi:type="ns1:PN"/>
54                 </ns1:patientPerson>
55               </ns1:patient>
56             </ns1:subject1>
```

The *custodian* child element conveys information on the responding system with the the OID of the provider organization in the *id* child element as follows:

```
57             <ns1:custodian typeCode="CST">
58               <ns1:assignedEntity classCode="ASSIGNED">
59                 <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" extension="MyOrgID" root="1.3.6.1.4.1.21367.2010.1.2.600" xsi:type="ns1:II"/>
60                 <ns1:assignedOrganization classCode="ORG" determinerCode="INSTANCE">
61                   <ns1:name xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:EN">
62                     <ns1:given>MyOrganisation</ns1:given>
63                   </ns1:name>
64                 </ns1:assignedOrganization>
65               </ns1:assignedEntity>
66             </ns1:custodian>
```

### Transport Protocol

The primary system shall send the request messages to the registry of the community using the http POST binding as defined in the **[W3C SOAP specification](https://www.w3.org/TR/2007/REC-soap12-part0-20070427/#L26866)**. It may look like:

```
POST /PIXV3QueryService HTTP/1.1
Host: company.example.org
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
Content-Type: application/soap+xml; charset="utf-8"
Content-Length: nnnn    
```

### Audit Log

Primary systems shall store syslog messages to the audit record repository of the community using TLS transport protocol.
The audit message uses XML formatting as specified in **[RFC 3881](https://tools.ietf.org/html/rfc3881)** with restrictions
specified in the **[IHE ITI TF](https://ehealthsuisse.ihe-europe.net/gss/audit-messages/view.seam?id=705)** and the
**[Extension 1 to Annex5](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)** in the ordinances of the Swiss electronic patient record (see Section
1.5 "Requirements on ATNA").  

The following snippet shows a example audit message to be written by the primary system:

```
1 <?xml version='1.0' encoding='utf-8'?>
2 <AuditMessage>
3  <EventIdentification EventActionCode="E" EventDateTime="2020-09-30T19:32:55.368Z" EventOutcomeIndicator="0">
4   <EventID csd-code="110112" codeSystemName="DCM" originalText="Query"></EventID>
5   <EventTypeCode csd-code="ITI-45" codeSystemName="IHE Transactions" originalText="PIX Query"></EventTypeCode>
6  </EventIdentification>
7  <ActiveParticipant UserID="https://my_primary_system.com/PIXConsumer" AlternativeUserID="201818" UserIsRequestor="true" NetworkAccessPointID="0045e6d09dd0" NetworkAccessPointTypeCode="1">
8   <RoleIDCode csd-code="110153" codeSystemName="DCM" originalText="Source Role ID"></RoleIDCode>
9  </ActiveParticipant>
10  <ActiveParticipant UserID="_SYSTEM" UserIsRequestor="true" NetworkAccessPointID="0045e6d09dd0" NetworkAccessPointTypeCode="1">
11   <RoleIDCode csd-code="%All" codeSystemName="HealthShare" originalText="%All"></RoleIDCode>
12  </ActiveParticipant>
13  <ActiveParticipant UserID="https://ehealthsuisse.ihe-europe.net/PIXManagerService" UserIsRequestor="false" NetworkAccessPointID="ehealthsuisse.ihe-europe.net" NetworkAccessPointTypeCode="1">
14   <RoleIDCode csd-code="110152" codeSystemName="DCM" originalText="Destination Role ID"></RoleIDCode>
15  </ActiveParticipant>
16  <AuditSourceIdentification AuditEnterpriseSiteID="2.16.756.5.30.1.109.6.1.3.1.1" AuditSourceID="my.primary.system.ID">
17   <AuditSourceTypeCode csd-code="4"></AuditSourceTypeCode>
18  </AuditSourceIdentification>
19  <ParticipantObjectIdentification ParticipantObjectID="CHFACILITY22332^^^&amp;1.3.6.1.4.1.12559.11.25.1.19&amp;ISO" ParticipantObjectTypeCode="1" ParticipantObjectTypeCodeRole="1">
20   <ParticipantObjectIDTypeCode csd-code="2" codeSystemName="RFC-3881" originalText="Patient Number"></ParticipantObjectIDTypeCode>
21   <ParticipantObjectDetail type="II" value="QkMzMjJDQjAtMDM1My0xMUVCLTk5OTQtMDI0MkFDMTQwMDAy"></ParticipantObjectDetail>
22  </ParticipantObjectIdentification>
23  <ParticipantObjectIdentification ParticipantObjectID="1^^^&amp;BC322C7E-0353-11EB-9994-0242AC140002&amp;ISO" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="24">
24   <ParticipantObjectIDTypeCode csd-code="ITI-45" codeSystemName="IHE Transactions" originalText="PIX Query"></ParticipantObjectIDTypeCode>
25   <ParticipantObjectQuery> <!-- omitted for brevity --> </ParticipantObjectQuery>
26   <ParticipantObjectDetail type="MSH-10" value="Xl5eJkJDMzIyQ0IwLTAzNTMtMTFFQi05OTk0LTAyNDJBQzE0MDAwMiZJU08="></ParticipantObjectDetail>
27  </ParticipantObjectIdentification>
28 </AuditMessage>  
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
