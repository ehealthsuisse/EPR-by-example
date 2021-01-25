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
**[here](../samples/ITI-47_request_raw.xml)**. For a step by step interpretation
of the request message, see section below.

#### Message Interpretation

The request message is not very complex, but lengthy due to the genericity of the HL7 V3 standard.
Therefore the following step by step interpretation may be of help to interpret the response.

The SOAP *Header* element conveys the following information:

- *To* element: The URL of the provide an register document set service.
- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the request as defined in the IHE ITI Technical Framework.

```
2  <env:Header>
3   <wsa:To xmlns:wsa="http://www.w3.org/2005/08/addressing">
4    https://epd-service.com:7443/PIXPDQ/services/PDQV3Service
5   </wsa:To>
6   <wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing">urn:uuid:cf11d39c-8a2e-4683-bbe6-9f2b6f63f8c0</wsa:MessageID>
7   <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing" env:mustUnderstand="1">urn:hl7-org:v3:PRPA_IN201305UV02</wsa:Action>
8  </env:Header>
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
11    <id root="1.3.6.1.4.1.21367.2017.2.5.55"/>
12    <creationTime value="20200922105735.304"/>
13    <interactionId extension="PRPA_IN201305UV02" root="2.16.840.1.113883.1.6"/>
14    <processingCode code="P"/>
15    <processingModeCode code="T"/>
16    <acceptAckCode code="AL"/>
17    <receiver typeCode="RCV">
18     <device classCode="DEV" determinerCode="INSTANCE">
19      <id root="1.3.6.1.4.1.21367.2017.2.4.105"/>
20     </device>
21    </receiver>
22    <sender typeCode="SND">
23     <device classCode="DEV" determinerCode="INSTANCE">
24      <id root="1.3.6.1.4.1.21367.2017.2.5.55"/>
25     </device>
26    </sender>
```

The query is encoded in a HL7 V3 *controlAct* object as follows:

```
27    <controlActProcess classCode="CACT" moodCode="EVN">
28     <code code="PRPA_TE201305UV02" codeSystem="2.16.840.1.113883.1.6"/>
29     <authorOrPerformer typeCode="AUT">
30      <assignedPerson classCode="ASSIGNED">
31       <id extension="client_application" root="1.3.6.1.4.1.24930"/>
32      </assignedPerson>
33     </authorOrPerformer>
34     <queryByParameter>
35      <queryId root="32adda44-a2a6-457f-84da-6982aa1ae921"/>
36      <statusCode code="new"/>
37      <responseModalityCode code="R"/>
38      <responsePriorityCode code="I"/>
39      <initialQuantity value="200"/>
40      <parameterList>
41       <livingSubjectName>
42        <value>
43         <family>Maiden</family>
44        </value>
45        <semanticsText>LivingSubject.name</semanticsText>
46       </livingSubjectName>
47       <patientAddress>
48        <value>
49         <streetAddressLine>Ruelle de la Tour</streetAddressLine>
50        </value>
51        <semanticsText>Patient.addr</semanticsText>
52       </patientAddress>
53      </parameterList>
54     </queryByParameter>
55    </controlActProcess>
```

The HL7 *controlAct* object conveys the query search parameter in a HL7 V3 *parameterList* element.

In the above example these are the *livingSubjectName* conveying the name of the patient to search for,  

```
41       <livingSubjectName>
42        <value>
43         <family>Maiden</family>
44        </value>
45        <semanticsText>LivingSubject.name</semanticsText>
46       </livingSubjectName>
```

and the *streetAddressLine* to match:

```
47       <patientAddress>
48        <value>
49         <streetAddressLine>Ruelle de la Tour</streetAddressLine>
50        </value>
51        <semanticsText>Patient.addr</semanticsText>
52       </patientAddress>
53      </parameterList>
54     </queryByParameter>
55    </controlActProcess>
```

The query supports many more search options and filter parameter. For a documentation of the options
see **[IHE PDQ V3](https://profiles.ihe.net/ITI/TF/Volume2/ITI-47.html#3.47)**.

### Response Message

Since the **[HL7 V3](http://www.hl7.org)** standard is very generic, the response message is quite lengthy and needs some
background information to interpret. The raw version of a response message may be found
**[here](../samples/ITI-47_response_raw.xml)**. For a step by step interpretation of the message, see section below.

#### Message Interpretation

The PDQV3 service responds with a list of patient data which match the search parameter in a HL7 V3 *subject* child element
of the *controlAct* object. The *subject* child element conveys the following information:

- *name*: conveying the given and the family names of the matching patient data.
- *administrativeGenderCode*: conveying the coded value of patient gender, taken from the value sets defined in
**[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)**.  
- *birthTime*: the data of birth of the matching patient data.
- *addr* : The address data of the patient.
- *asOtherIDs*: A list of 1..N IDs, the patient is registered with in the community.  

Each *asOtherId* conveys the ID the patient is registered in the community and conveys the following information:
-  *scopingOrganization*: the assigning authority, which may be the master patient index of the community, or a primary system, which had registered the patient data with its local ID.
- *extension*: The master patient ID (XAD-PID), if the assigning authority in the *root* attribute is the master patient index of the community, or a local ID assigned by a primary system otherwise.    

```
41         <ns1:patientPerson classCode="PSN" determinerCode="INSTANCE">
42          <ns1:name xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:PN">
43           <ns1:given>Alice</ns1:given>
44           <ns1:family>Maiden</ns1:family>
45          </ns1:name>
46          <ns1:administrativeGenderCode code="F"/>
47          <ns1:birthTime xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:TS" value="19880101"/>
48          <ns1:addr xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:AD" use="HP">
49           <ns1:city>Pontarlier</ns1:city>
50           <ns1:postalCode>25300</ns1:postalCode>
51           <ns1:streetName>Ruelle de la Tour</ns1:streetName>
52          </ns1:addr>
53          <ns1:asOtherIDs classCode="PAT">
54           <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:II" root="1.3.6.1.4.1.21367.2017.2.5.45" extension="069dc839-8fdf-4908-88d8-a985c1a42779" assigningAuthorityName="XDS Affinity Domain"/>
55           <ns1:statusCode code="active"/>
56           <ns1:scopingOrganization classCode="ORG" determinerCode="INSTANCE">
57            <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:II" root="1.3.6.1.4.1.21367.2017.2.5.45"/>
58           </ns1:scopingOrganization>
59          </ns1:asOtherIDs>
60          <ns1:asOtherIDs classCode="PAT">
61           <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:II" root="1.3.6.1.4.1.21367.2017.2.5.65" extension="TIE4873" assigningAuthorityName="ISO"/>
62           <ns1:statusCode code="active"/>
63           <ns1:scopingOrganization classCode="ORG" determinerCode="INSTANCE">
64            <ns1:id xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="ns1:II" root="1.3.6.1.4.1.21367.2017.2.5.65"/>
65           </ns1:scopingOrganization>
66          </ns1:asOtherIDs>
67         </ns1:patientPerson>
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

*TODO* Update with gazelle example

```
code block here    
```

## Security Requirements  

To ensure privacy the transaction must be secured using https with mutual authentication, with X.509 certificates
(extended validation required) and client and server side certificate validation.

Note:
- Some test environments dropped the mutual authentication or TLS for testing purposes. Please contact your test system provider on the details.

# Test Opportunity

The transaction can be tested with the Gazelle test suite of the **[EPR reference environment](https://ehealthsuisse.ihe-europe.net)**, or test systems of the EPR communities.
