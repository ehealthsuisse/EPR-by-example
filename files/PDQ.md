# Patient Demographics Query 

Transaction to search for patient identities and data from a community using the patient demographic data as search criteria. Primary systems may use this transaction to verify if a patient uses a Swiss EPR and is already registered in the community.  

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

Primary systems may use this transaction to search for patients which are already registred in the community, either because the 
patient opended the Swiss EPR in the community or because the patient opended the Swiss EPR in a remote community and was already 
registered by annother primary system to store documents. In the Swiss EPR the 
**[IHE PDQV3](https://profiles.ihe.net/ITI/TF/Volume1/ch-24.html)** profile and transactions shall be used to search for patients 
by demographic data. 

To search for patients the primary system shall perform a **[Patient Demographic Query \[ITI-47\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-47.html)**. Within the query request the primary system shall provide the demographic data as search criteria. In 
the Swiss EPR each community must support the name, birthdate, gender and nationality. Individual communities may support other 
demographic data (e.g., address and other contact data).  

The community sends a response with all patient data sets matching the search criteria. Each patient data set contains the 
known demographic data, the EPR-SPID and the assigned ID. The response contains the master data set as well as all known 
patient data sets, as registered by other primary systems.    

# Transaction 

## Message Semantics

Messages are encoded as described in the HL7 V3 standard with restictions defined in the **[IHE PDQ V3](https://profiles.ihe.net/ITI/TF/Volume2/ITI-47.html#3.47)** profile and the ordinances to the Swiss EPR.

### Request Message

Since the **[HL7 V3](http://www.hl7.org)** standard is very generic, the request message is quite lengthy and needs some
background information to interpret. The raw version of a request message may be found 
**[here](https://github.com/msmock/AnnotatedTX/blob/main/samples/ITI-47_request.xml)**. For a step by step interpretation 
of the request message, see section below. 

#### Message Interpretation

The request message is not complex in nature, but quite lengthy due to the genericity of the HL7 V3 standard. 
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

For the patient demographic query no *Security* header element is required, since in the Swiss EPR the acces to the patient data is 
authorized for all applications, which are registered and authenticate with a client certificate 
(see section **[Security](PDQ.md#security-requirements)**). 

The SOAP *Body* element conveys the administrative information required for a PRPA_IN201305UV02 message in HL7 V3 syntax in 
which primary systems must set the following values: 
- *creationTime*: A timestamp in unix time format. 
- *sender* : The OID of the sender application initiating the request. 
- *receiver*: The OID of the receiver application which shall respond to the request. 

```
1     <id root="1.3.6.1.4.1.21367.2017.2.5.55"/>
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

TBD

## Transport Protocol

TBD 

## Audit Log

TBD

```
code block here    
```

## Security Requirements  

TBD

# Test Opportunity

TBD