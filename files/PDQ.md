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

Primary systems may use this transaction to search for patients which are already registred in the community, either because the patient opended the Swiss EPR in the community or because the patient opended the Swiss EPR in a remote community and was already registered by annother primary system to store documents. In the Swiss EPR the **[IHE PDQV3](https://profiles.ihe.net/ITI/TF/Volume1/ch-24.html)** profile and transactions shall be used to search for patients by demographic data. 

To search for patients the primary system shall perform a **[Patient Demographic Query \[ITI-47\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-47.html)**. Within the query request the primary system shall provide the demographic data as search criteria. In the Swiss EPR each community must support the name, birthdate, gender and nationality. Individual communities may support other demographic data (e.g., address and other contact data).  

The community sends a response with all patient data sets matching the search criteria. Each patient data set contains the known demographic data, the EPR-SPID and the assigned ID. The response contains the master data set as well as all known patient data sets, as registered by other primary systems.    

# Transaction 

## Message Semantics

Messages are encoded as described in the HL7 V3 standard with restictions defined in the **[IHE PDQ V3](https://profiles.ihe.net/ITI/TF/Volume2/ITI-47.html#3.47)** profile and the ordinances to the Swiss EPR.

### Request Message

Since the **[HL7 V3](http://www.hl7.org)** standard is very generic, the request message is quite lengthy and needs some
background information to interpret. The raw version of a request message may be found **[here](https://github.com/msmock/AnnotatedTX/blob/main/samples/ITI-47_request.xml)**. For a step by step interpretation of the request message, see section below. 

```
<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
 <env:Header>
  <wsa:To xmlns:wsa="http://www.w3.org/2005/08/addressing">
   https://epd-service.com:7443/PIXPDQ/services/PDQV3Service
  </wsa:To>
  <wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing">urn:uuid:cf11d39c-8a2e-4683-bbe6-9f2b6f63f8c0</wsa:MessageID>
  <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing" env:mustUnderstand="1">urn:hl7-org:v3:PRPA_IN201305UV02</wsa:Action>
 </env:Header>
 <env:Body>
  <PRPA_IN201305UV02 xmlns="urn:hl7-org:v3" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ITSVersion="XML_1.0">
   <id root="1.3.6.1.4.1.21367.2017.2.5.55"/>
   <creationTime value="20200922105735.304"/>
   <interactionId extension="PRPA_IN201305UV02" root="2.16.840.1.113883.1.6"/>
   <processingCode code="P"/>
   <processingModeCode code="T"/>
   <acceptAckCode code="AL"/>
   <receiver typeCode="RCV">
    <device classCode="DEV" determinerCode="INSTANCE">
     <id root="1.3.6.1.4.1.21367.2017.2.4.105"/>
    </device>
   </receiver>
   <sender typeCode="SND">
    <device classCode="DEV" determinerCode="INSTANCE">
     <id root="1.3.6.1.4.1.21367.2017.2.5.55"/>
    </device>
   </sender>
   <controlActProcess classCode="CACT" moodCode="EVN">
    <code code="PRPA_TE201305UV02" codeSystem="2.16.840.1.113883.1.6"/>
    <authorOrPerformer typeCode="AUT">
     <assignedPerson classCode="ASSIGNED">
      <id extension="client_application" root="1.3.6.1.4.1.24930"/>
     </assignedPerson>
    </authorOrPerformer>
    <queryByParameter>
     <queryId root="32adda44-a2a6-457f-84da-6982aa1ae921"/>
     <statusCode code="new"/>
     <responseModalityCode code="R"/>
     <responsePriorityCode code="I"/>
     <initialQuantity value="200"/>
     <parameterList>
      <livingSubjectName>
       <value>
        <family>Maiden</family>
       </value>
       <semanticsText>LivingSubject.name</semanticsText>
      </livingSubjectName>
      <patientAddress>
       <value>
        <streetAddressLine>Ruelle de la Tour</streetAddressLine>
       </value>
       <semanticsText>Patient.addr</semanticsText>
      </patientAddress>
     </parameterList>
    </queryByParameter>
   </controlActProcess>
  </PRPA_IN201305UV02>
 </env:Body>
</env:Envelope>
```

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
(see section **[Security](../PDQ.md#security-requirements)**).  

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