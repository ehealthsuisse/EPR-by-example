# Get X-User Assertion
Transaction to retrieve a SAML 2.0 assertion for authorization of transactions in the Swiss EPR. Primary systems shall use this transaction to retrieve a SAML 2 assertions to be used with EPR transactions, which require authorization.  

## Overview

Primary systems shall use this transaction to retrieve a SAML 2 assertions to be used with the
**[Provide X-User Assertion](ProvideXAssertion.md)** with XDS.b transactions as defined in
the **[IHE XUA profile](https://profiles.ihe.net/ITI/TF/Volume1/ch-13.html)** with Swiss specific extensions defined in  
**[Amendment 1 to Annex 5][annexes]**.

The primary system shall provide claims (e.g., user role, purpose of use) with the request as defined in **[Amendment 1 to Annex 5][annexes]**.

The community verifies the claims and responds with a XUA compliant SAML 2.0 Assertion defined in **[Amendment 1 to Annex 5][annexes]**.

## Transaction

### Message Semantics  

Messages are encoded as described in the **[WS Trust](http://docs.oasis-open.org/ws-sx/ws-trust/v1.4/ws-trust.html)** standard, with restrictions defined in the IHE profile and the ordinances to the Swiss EPR.

#### Request Message

The following snippet is taken from a sample request recorded during the EPR projectathon in September 2020. Some elements are omitted to increase readability. The raw request file may be found **[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/GetXAssertion_request_raw.xml)**.

The snippet shows a request performed by a healthcare professional performing a the normal access. For other roles and situations the claims are different. Other examples may be found at **[XUA examples][XUA_samples]**.   

The request message shall be a XML SOAP envelope with the query embedded in the *Body* element of the SOAP envelope.
The SOAP *Header* element conveys the following information:

- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the query as defined in the IHE ITI Technical Framework.
- *Security* element: The Web Service Security header as defined in the **[WS Security][wss]** specification. This element must contain the IdP Assertion taken from user authentication (see **[Authenticate User](AuthenticateUser.md)**).  

```xml title="SOAP header" linenums="1"
--8<-- "samples/GetXAssertion_request_raw.xml::6"
   <!-- IdP Assertion omitted -->
--8<-- "samples/GetXAssertion_request_raw.xml:51:53"
```

The SOAP *Body* element contains the *RequestSecurityToken* element with the following claims to be set by the primary system. It's child element read:

**AppliesTo** the URL of the community endpoint the XUA assertion shall be used for authorization, whose value is set in the *Address* child element.

```xml linenums="56"
--8<-- "samples/GetXAssertion_request_raw.xml:56:60"
```

**resourceID** conveying the EPR-SPID of the patient EPR to access in CX format (see see **[PIXFeed](PIXFeed.md)**)

```xml linenums="62"
--8<-- "samples/GetXAssertion_request_raw.xml:62:64"
```

**purposeOfUse** conveying the purpose of use of the request, which must be taken from the EPR value set defined in **[Annex 3][annex3]**
of the ordinances of the Swiss electronic patient dossier.

```xml linenums="65"
--8<-- "samples/GetXAssertion_request_raw.xml:65:69"
```

**role** conveying the EPR role of the user, which must be taken from the EPR value set defined in **[Annex 3][annex3]**.

```xml linenums="70"
--8<-- "samples/GetXAssertion_request_raw.xml:70:74"
```

#### Response Message

The following snippet is taken from a sample response recorded during the EPR projectathon in September 2020. Some elements
were ommitted to increase readability. The raw file may be found **[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/GetXAssertion_response_raw.xml)**.

The response message is a XML SOAP envelope with the XUA Assertion embedded in the the *Body* element of the SOAP envelope (see example below, lines 21 to 23). Primary systems shall extract the XUA Assertion to use the im the security header of the XDS.b transactions, which require authorization. For primary systems, there is no need to extract information from the XUA assertion.  

The XUA Assertion is omitted in the snippet below. For examples of see **[here][XUA_samples]**.  

```xml title="GetXAssertion_response.xml" linenums="1"
--8<-- "samples/GetXAssertion_response.xml"
```

### Transport Protocol

The primary system shall send the request messages to the X-Assertion Provider of the community using the http
POST binding as defined in the **[W3C SOAP specification][soap]**. It may look like:  

```http linenums="1"
POST /RegistryStoredQueryService HTTP/1.1
Host: company.example.org
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
Content-Type: application/soap+xml; charset="utf-8"
Content-Length: nnnn  
```

### Audit Log

Primary systems shall protocol the request and response for traceability. There are no further requirements on protocols defined in the ordinances of the Swiss EPR.  

### Security Requirements  

To ensure privacy the transaction must be secured using https with mutual authentication, using X.509 certificates (extended validation required) and client and server side certificate validation.

The retrieval of a XUA assertion requires user authentication by providing the IdP assertion in the *Security* header of the SOAP envelope (see **[Message Semantics](GetXAssertion.md#message-semantics)**). The IdP assertion shall be retrieved by the primary system by using the **[Authenticate User](AuthenticateUser.md)** transaction.  

## Test Opportunity

The transaction can be tested with the test suite of the **[EPR reference environment](gazelle.md)** or the test systems of the EPR communities.
