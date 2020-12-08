# PIX Query
Transaction to get the master patient ID of a patient in a community using the local ID.

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

The SOAP *Header* element shall convey the following information:

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

The PIX V3 Feed service responds with the master patient ID (XAD-PID) and the EPR-SPID, the patient is registered with in
the community.

The request message is not very complex, but quite lengthy due to the genericity of the HL7 V3 standard. A raw version
of a response message may be found **[here](https://github.com/msmock/AnnotatedTX/blob/main/samples/ITI-45_response.xml)**.

#### Message Interpretation

The SOAP *Header* element shall conveys the following information:
- *Action* element: The SOAP action identifier of the request as defined in the IHE ITI Technical Framework.
- *RelatesTo* element: A copy of the unique ID of the query request.

```
<soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
 <wsa:Action xmlns:mustUnderstand="http://www.w3.org/2003/05/soap-envelope" mustUnderstand:mustUnderstand="1">urn:hl7-org:v3:PRPA_IN201310UV02</wsa:Action>
 <wsa:RelatesTo>urn:uuid:c12e1f14-c2c9-4a94-ba27-6411e8c90b75</wsa:RelatesTo>
</soapenv:Header>  
```

The SOAP *Body* element conveys the administrative information required for a PRPA_IN201310UV02 message in HL7 V3 syntax
and the query result encoded in the *controlActProcess* element.

The *controlActProcess* element conveys the following information for the primary system in the *subject* child element:

The *patient* child element conveys the master patient ID (XAD-SPID) and the EPR-SPID as follows:
- *id* : The master patient ID (XAD-SPID), with the community OID as the assigning authority in the *root* and the ID in the *extension* attribute (line 39 in the example below).
- *asOtherIDs*: The EPR-SPID, with the ZAS OID as assigning authority in the *root* and the ID in the *extension* attribute (line 44 in the example below).

**TODO**: adapt to the update of the ordinances planned to April 2021.  

```
38        <ns1:patient classCode="PAT">
39         <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:II" root="1.3.6.1.4.1.21367.2017.2.5.45" extension="799b00ee-2f2a-4444-8f93-c91730578af4" assigningAuthorityName="XDS Affinity Domain"/>
40         <ns1:statusCode code="active"/>
41         <ns1:patientPerson classCode="PSN" determinerCode="INSTANCE">
42          <ns1:name xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:PN" nullFlavor="NA"/>
43          <ns1:asOtherIDs classCode="ROL">
44           <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:II" root="2.16.756.5.30.1.127.3.10.3" extension="761337610435209810" assigningAuthorityName="SPID"/>
45           <ns1:scopingOrganization classCode="ORG" determinerCode="INSTANCE">
46            <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:II" root="2.16.756.5.30.1.127.3.10.3"/>
47           </ns1:scopingOrganization>
48          </ns1:asOtherIDs>
49         </ns1:patientPerson>
50        </ns1:patient>
```

The *custodian* child element conveys information on the responding system as follows:

```
52       <ns1:custodian typeCode="CST">
53        <ns1:assignedEntity classCode="ASSIGNED">
54         <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:II" root="1.3.6.1.4.1.21367.2010.1.2.600" extension="xxx"/>
55         <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:II" root="1.3.6.1.4.1.21367.2010.1.2.600" extension="xxx"/>
56         <ns1:assignedOrganization classCode="ORG" determinerCode="INSTANCE">
57          <ns1:name xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:EN">
58           <ns1:given>org</ns1:given>
59          </ns1:name>
60         </ns1:assignedOrganization>
61        </ns1:assignedEntity>
62       </ns1:custodian>
```

## Transport Protocol

The primary system shall send the request messages to the registry of the community using the http POST binding as defined in the **[W3C SOAP specification](https://www.w3.org/TR/2007/REC-soap12-part0-20070427/#L26866)**. It may look like:

```
POST /PIXV3QueryService HTTP/1.1
Host: company.example.org
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
Content-Type: application/soap+xml; charset="utf-8"
Content-Length: nnnn    
```

## Audit Log

Primary systems shall store syslog messages to the audit record repository of the community using TLS transport protocol.
The audit message uses XML formatting as specified in **[RFC 3881](https://tools.ietf.org/html/rfc3881)** with restrictions
specified in the **[IHE ITI TF](https://ehealthsuisse.ihe-europe.net/gss/audit-messages/view.seam?id=705)** and the
**[Extension 1 to Annex5](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/gesetze/anhang_5_ergaenzung_1_epdv_edi_20200415.PDF.download.PDF/Ergaenzung_1_Anhang_5_EPDV-EDI_20200415.pdf.PDF)** in the ordinances of the Swiss electronic patient record (see Section
1.5 "Requirements on ATNA").  

The following snippet shows a example audit message to be written by the primary system:

```
<?xml version="1.0"?>
<AuditMessage>
 <EventIdentification EventActionCode="E" EventDateTime="2020-11-17T18:40:41+01:00" EventOutcomeIndicator="0">
  <EventID csd-code="110112" originalText="Query" codeSystemName="DCM"/>
  <EventTypeCode csd-code="ITI-45" originalText="PIX Query" codeSystemName="IHE Transactions"/>
 </EventIdentification>
 <ActiveParticipant UserID="source_id" AlternativeUserID="3345" UserIsRequestor="true" NetworkAccessPointID="127.0.0.1" NetworkAccessPointTypeCode="2">
  <RoleIDCode csd-code="110153" originalText="Source" codeSystemName="DCM"/>
 </ActiveParticipant>
 <ActiveParticipant UserID="mia.muster@domain.com">
  <RoleIDCode csd-code="HCP" originalText="Heathcare Professional" codeSystemName="DocumentEntry.author.authorRole"/>
 </ActiveParticipant>
 <ActiveParticipant UserID="https://service.com/mpi" AlternativeUserID="207" UserIsRequestor="false" NetworkAccessPointID="127.0.0.1" NetworkAccessPointTypeCode="2">
  <RoleIDCode csd-code="110152" originalText="Destination" codeSystemName="DCM"/>
 </ActiveParticipant>
 <AuditSourceIdentification code="1" AuditSourceID="connectathon"/>
 <ParticipantObjectIdentification ParticipantObjectID="752343^^^&amp;2.16.840.1.113883.3.37.4.1.1.2.1.1&amp;ISO" ParticipantObjectTypeCode="1" ParticipantObjectTypeCodeRole="1" ParticipantObjectDataLifeCycle="6">
  <ParticipantObjectIDTypeCode csd-code="2" originalText="Patient Number" codeSystemName="RFC-3881"/>
 </ParticipantObjectIdentification>
 <ParticipantObjectIdentification ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="24">
  <ParticipantObjectIDTypeCode csd-code="ITI-45" originalText="PIX Query" codeSystemName="IHE Transactions"/>
  <ParticipantObjectQuery>PHF1...!--omitted for brevity-- ...ADS=</ParticipantObjectQuery>
 </ParticipantObjectIdentification>
</AuditMessage>   
```

**TODO**:explain

## Security Requirements    

To ensure privacy the transction must be secured using https with mutual authentication, with X.509 certificates
(extended validation required) and client and server side certifcate validation.

Note:
- Some test environments dropped the mutual authentication or TLS for testing purposes. Please contact your test system provider on the details.

# Test Opportunity

TBD
