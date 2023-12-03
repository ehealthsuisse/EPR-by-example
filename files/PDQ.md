# Patient Demographics Query

Transaction to search for patient identities and data from a community using the patient demographic data as search criteria. Primary systems may use this transaction to verify if a patient uses a Swiss EPR and is already registered in the community.  

## Overview

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

## Transaction

### Message Semantics

Messages are encoded as described in the HL7 V3 standard with restrictions defined in the
**[IHE PDQ V3](https://profiles.ihe.net/ITI/TF/Volume2/ITI-47.html)** profile and the ordinances to the Swiss EPR.

#### Request Message

Since the **[HL7 V3](http://www.hl7.org)** standard is very generic, the request message is quite lengthy and needs some
background information to interpret. The raw version of a request message may be found
**[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-47_request_raw.xml)**. For a step by step interpretation
of the request message, see section below.

##### Message Interpretation

The request message is not very complex, but lengthy due to the genericity of the HL7 V3 standard.
Therefore the following step by step interpretation may be of help to interpret the response.

The SOAP *Header* element conveys the following information:

- *To* element: The URL of the provide an register document set service.
- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the request as defined in the IHE ITI Technical Framework.

```xml title="SOAP header" linenums="2" hl_lines="3-5"
--8<-- "samples/ITI-47_request_raw.xml:2:10"
```

For the patient demographic query no *Security* header element is required, since in the Swiss EPR the access to the patient
data is authorized for all applications, which are registered and authenticate with a client certificate
(see section **[Security Requirements](PDQ.md#security-requirements)**).

The SOAP *Body* element conveys the administrative information required for a PRPA_IN201305UV02 message in HL7 V3 syntax in
which primary systems must set the following values:
- *creationTime*: A timestamp in unix time format.
- *sender* : The OID of the sender application initiating the request.
- *receiver*: The OID of the receiver application which shall respond to the request.

```xml title="PRPA_IN201305UV02 message" linenums="13"
--8<-- "samples/ITI-47_request_raw.xml:13:33"
```

The query is encoded in a HL7 V3 *controlAct* object as follows:

```xml title="PRPA_IN201305UV02 message" linenums="34"
--8<-- "samples/ITI-47_request_raw.xml:34:56"
```

The HL7 *controlAct* object conveys the query search parameter in a HL7 V3 *parameterList* element.

In the above example these are 
- the *livingSubjectId* conveying the local ID in the primary system of the patient data to search for,
- the *otherIDsScopingOrganization* to match with the registered patient data,  

```xml title="parameterList element" linenums="41"
--8<-- "samples/ITI-47_request_raw.xml:41:54"
```

The query supports many more search options and filter parameter. For a documentation of the options
see **[IHE PDQ V3](https://profiles.ihe.net/ITI/TF/Volume2/ITI-47.html#3.47)**.

#### Response Message

Since the **[HL7 V3](http://www.hl7.org)** standard is very generic, the response message is quite lengthy and needs some
background information to interpret. The raw version of a response message may be found
**[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/ITI-47_response_raw.xml)**. For a step by step interpretation of the message, see section below.

##### Message Interpretation

The PDQV3 service responds with a list of patient data which match the search parameter in a HL7 V3 *subject* child element
of the *controlAct* object. The *subject* child element conveys the following information:

- *id*: the XAD PID, which identifies the patient in the community (line 50)  and the EPR-SPID (line 51).
- *name*: conveying the given and the family names of the matching patient data (line 54).
- *administrativeGenderCode*: conveying the coded value of patient gender (line 58), taken from the value sets defined in
**[Annex 3](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.  
- *birthTime*: the data of birth of the matching patient data (line 59).
- *addr*: The address data of the patient (line 60).     

```xml title="patient element" linenums="49"
--8<-- "samples/ITI-47_response_raw.xml:49:76"
```

### Transport Protocol

The primary system shall send the request messages to the registry of the community using the http POST binding as defined in the **[W3C SOAP specification](https://www.w3.org/TR/2007/REC-soap12-part0-20070427/#L26866)**. It may look like:  

```http linenums="1"
POST /PDQV3Service HTTP/1.1
Host: company.example.org
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
Content-Type: application/soap+xml; charset="utf-8"
Content-Length: nnnn  
```

### Audit Log

Primary systems shall store syslog messages to the audit record repository of the community using TLS transport protocol.
The audit message uses XML formatting as specified in **[RFC 3881](https://tools.ietf.org/html/rfc3881)** with restrictions
specified in the **[IHE ITI TF](https://ehealthsuisse.ihe-europe.net/gss/audit-messages/view.seam?id=703)** and the
**[Extension 1 to Annex5](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)** in the ordinances of the Swiss electronic patient record (see Section
1.5 "Requirements on ATNA").

```xml title="iti-47-log.xml" linenums="1"
--8<-- "samples/iti-47-log.xml"
```

The message is made of the following blocks:
- *EventIdentification*: Event related information including the timestamp (line 3 .. 6).
- *ActiveParticipant*: Information related to the primary system performing the query (line 7 .. 9).
- *ActiveParticipant*: Information on the user initiating the transaction (line 10 .. 12).
- *ActiveParticipant*: Information on the responding service endpoint (line 13 .. 15).
- *AuditSourceIdentification*: Information related to the primary system performing the query (line 16 .. 18)
- *ParticipantObjectIdentification*: Information on the patients EPR accessed (line 19 .. 23)
- *ParticipantObjectIdentification*: Request message related information including a UBASE-64 encoded copy of the query (line 24 .. 28).

### Security Requirements  

To ensure privacy the transaction must be secured using https with mutual authentication, with X.509 certificates
(extended validation required) and client and server side certificate validation.

Note:
- Some test environments dropped the mutual authentication or TLS for testing purposes. Please contact your test system provider on the details.

## Test Opportunity

The transaction can be tested with the test suite of the **[EPR reference environment](gazelle.md)**, test systems of the EPR communities or the **[EPR Playground](playground.md)**.
