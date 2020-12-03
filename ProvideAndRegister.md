# Provide and Register Document Set
Transaction to store one or more documents to a community. Primary systems shall use this transaction to export documents and the to a community repository to add it to a patients EPR.  

**CONTENTS**

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

Primary systems shall use this transaction to provide documents and the related document metadata to a patient EPR. In the Swiss EPR the **[IHE XDS.b](https://profiles.ihe.net/ITI/TF/Volume1/ch-10.html)** profile and transactions shall be used.

To store the document metadata of the document, the the primary system shall perform a **[Provide And Register Document Set \[ITI-41\]](https://profiles.ihe.net/ITI/TF/Volume2/ITI-41.html)** transaction. Within the request, the primary systems shall provide the master patient ID as retrieved from the **[PIX Query](../main/PIXQuery.md)**, the document metadata as defined in the ordinances of the Swiss EPR and the binary data of the document.  

The community responds with a code indicating the successful registration of the document. 

# Transaction 

## Message Semantics

Messages are encoded as described in the **[ebXML](http://www.ebxml.org)** standard with restictions defined in the IHE profile and the ordinances to the Swiss EPR. 

### Request Message

Since the **[ebXML](http://www.ebxml.org)** standard is very generic, the request message is quite lengthy and needs some background information to interpret. 

The structure of the result set is as follows (see example below): 
- The metadata of the individual documents are bundled in a *ExtrinsicObject* element.
- The metadata attributes are encoded as *Slot*, as *Classification* or as *ExternalIdentifier* elements. 
- Metadata attributes encoded as *Slots* can be identified and interpreted by the slot's *name* attribute. 
- Metadata attributes encoded as *Classification* can be identified and interpreted by the classification's *classificationScheme* attribute.
- The unique ID of the document is encoded as *ExternalIdentifier*, which has an *identificationScheme* attribute with a fixed value.

The full table of the identifier used to indicate the metadata attributes is defined by the metadata model used by IHE XDS.b in **[IHE ITI Technical Framework Vol. 3, Section 4.2.5.2](https://profiles.ihe.net/ITI/TF/Volume3/ch-4.2.html#4.2.5.2)**. The corresponding interpretation of the metadata attributes in the Swiss EPR and the supported value sets may be found in **[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)** of the ordinances of the Swiss electronic patient dossier.

The listing below displays a full request message. For a step by step interpretion, see section below. The raw version of the message may be found **[here]()**. 

```

```


### Message Interpretation

The request message is not complex in nature, but quite lengthy due to the genericity of the ebXML standard. 
Therefore the following step by step interpretation may be of help to interpret the response. 

The SOAP *Body* element conveys the ebXML *RetrieveDocumentSetRequest* which shall convey 1..N *DocumentRequest* elements (lines 12 to 16 below) with the following information: 

- *HomeCommunityId* : Unique ID of the community. 
- *RepositoryUniqueId*: Unique ID of repository taken from a **[Registry Stored Query](../main/RegistryStoredQuery.md)** response. 
- *DocumentUniqueId*: Unique ID of the document taken from a Registry Stored Query response.


```
code block here    
```




### Response Message

TBD

## Transport 

```
POST /XDSDocumentRepositoryService HTTP/1.1
Host: 10.2.101.10:11076
Content-Type: multipart/related; boundary="MIMEBoundary_05b39a33e8effeb90c1ccb1c58c4b93b5af2935a13853149"; type="application/xop+xml"; start="<0.15b39a33e8effeb90c1ccb1c58c4b93b5af2935a13853149@apache.org>"; start-info="application/soap+xml"; action="urn:ihe:iti:2007:ProvideAndRegisterDocumentSet-b"
Connection: Keep-Alive
Content-Length: 181931

--MIMEBoundary_05b39a33e8effeb90c1ccb1c58c4b93b5af2935a13853149
Content-Type: application/xop+xml; charset=utf-8; type="application/soap+xml"
Content-Transfer-Encoding: binary
Content-ID: <0.15b39a33e8effeb90c1ccb1c58c4b93b5af2935a13853149@apache.org>

<!-- message ommittedd -->

--MIMEBoundary_05b39a33e8effeb90c1ccb1c58c4b93b5af2935a13853149
Content-Type: application/octet-stream
Content-Transfer-Encoding: binary
Content-ID: <1.c5b39a33e8effeb94a97121c58c4b93b53d2935a13853149@apache.org>

<!-- binary document data ommitted -->

--MIMEBoundary_05b39a33e8effeb90c1ccb1c58c4b93b5af2935a13853149--

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