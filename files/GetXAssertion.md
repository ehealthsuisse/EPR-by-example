# Get X-User Assertion
Transaction to retrieve a SAML 2.0 assertion for authorization of transactions in the Swiss EPR. Primary systems shall use this transaction to retrieve a SAML 2 assertions to be used with EPR transactions, which require authorization.  

## Overview

Primary systems shall use this transaction to retrieve a SAML 2 assertions to be used with the
[Provide X-User Assertion](ProvideXAssertion.md) with XDS.b transactions as defined in
the [IHE XUA profile](https://profiles.ihe.net/ITI/TF/Volume1/ch-13.html) with Swiss specific extensions defined in  
[Amendment 1 to Annex 5][annexes].

The primary system shall provide claims (e.g., user role, purpose of use) with the request as defined in [Amendment 1 to Annex 5][annexes].

The community verifies the claims and responds with a XUA compliant SAML 2.0 Assertion defined in [Amendment 1 to Annex 5][annexes].

## Transaction

### Message Semantics  

Messages are encoded as described in the [WS Trust](http://docs.oasis-open.org/ws-sx/ws-trust/v1.4/ws-trust.html) standard, with restrictions defined in the IHE profile and the ordinances to the Swiss EPR.

#### Request Message

The following snippet is taken from a sample request recorded during the EPR projectathon in September 2020, later 
updated to the new specifications.
Some elements (like the XML Namespace declarations) are omitted to increase readability.
The raw request file may be found [here](https://github.com/ehealthsuisse/EPR-by-example/tree/main/samples/GetXAssertion_request_raw.xml).

The snippet shows a request performed by a healthcare professional performing a normal access. For other roles and situations the claims are different. Other examples may be found at [XUA examples][XUA_samples].   

The request message shall be an XML SOAP envelope with the query embedded in the *Body* element of the SOAP envelope.
The SOAP *Header* element conveys the following information:

- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the query as defined in the IHE ITI Technical Framework.
- *Security* element: The Web Service Security header as defined in the [WS Security][wss] specification.

```xml title="SOAP header" linenums="1"
--8<-- "samples/GetXAssertion_request.xml:1:5"
```

The *Security* element SHALL contain a [Security Timestamp](https://docs.oasis-open.org/wss-m/wss/v1.1.1/os/wss-SOAPMessageSecurity-v1.1.1-os.html#_Toc307407973),
limiting the validity of the current request to defined bounds.
The *Timestamp* element SHALL have an Id attribute that will be later referenced in the request Signature.

```xml title="Security Timestamp" linenums="6"
--8<-- "samples/GetXAssertion_request.xml:6:9"
```

The *Security* element SHALL also contain a [Binary Security Token](https://docs.oasis-open.org/wss-m/wss/v1.1.1/os/wss-SOAPMessageSecurity-v1.1.1-os.html#_Toc113528378),
containing the X.509 Certificate that will sign this request.

```xml title="Binary Security Token" linenums="10"
--8<-- "samples/GetXAssertion_request.xml:10:12"
```

The *Security* element SHALL contain the IdP Assertion taken from user authentication (see [Authenticate User](AuthenticateUser.md)).

```xml title="IdP Assertion" linenums="13"
--8<-- "samples/GetXAssertion_request.xml:13:15"
```

The *Security* element SHALL finally contain an XML Signature referencing both the *Security Timestamp* and the SOAP 
*Body*.
It SHALL specify a *X509IssuerSerial* containing the issuer name and serial number of the X.509 Certificate used for 
signing the request.

```xml title="XML Signature" linenums="16"
--8<-- "samples/GetXAssertion_request.xml:16:48"
```

The SOAP *Body* element SHALL have an Id attribute referenced by the XML Signature, and SHALL contain the 
*RequestSecurityToken* element with the following claims to be set by the primary system.

```xml title="SOAP Body and RequestSecurityToken" linenums="49"
--8<-- "samples/GetXAssertion_request.xml:49:51"
```

The attribute **resourceID** conveys the EPR-SPID of the patient EPR to access in HL7 V2.5 CX format (see [PIXFeed](PIXFeed.md))

```xml linenums="52"
--8<-- "samples/GetXAssertion_request.xml:52:56"
```

The attribute **purposeOfUse** conveying the purpose of use of the request, which must be taken from the EPR value 
set defined in [Annex 3][annex3] of the ordinances of the Swiss electronic patient record.

```xml linenums="57"
--8<-- "samples/GetXAssertion_request.xml:57:61"
```

The attribute **role** conveying the EPR role of the user, which must be taken from the EPR value set defined in 
[Annex 3][annex3].

```xml linenums="62"
--8<-- "samples/GetXAssertion_request.xml:62:72"
```

#### Response Message

The following snippet is taken from a sample response recorded during the EPR projectathon in September 2020. Some elements
were omitted to increase readability. The raw file may be found [here](https://github.com/ehealthsuisse/EPR-by-example/tree/main/samples/GetXAssertion_response_raw.xml).

The response message is an XML SOAP envelope with the XUA Assertion embedded in the *Body* element of the SOAP 
envelope (see example below, lines 21 to 23). Primary systems shall extract the XUA Assertion to use the im the security header of the XDS.b transactions, which require authorization. For primary systems, there is no need to extract information from the XUA assertion.  

The XUA Assertion is omitted in the snippet below. For examples of see [here][XUA_samples].  

```xml title="GetXAssertion_response.xml" linenums="1"
--8<-- "samples/GetXAssertion_response.xml"
```

### Transport Protocol

The primary system shall send the request messages to the X-Assertion Provider of the community using the http
POST binding as defined in the [W3C SOAP specification][soap]. It may look like:  

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

The retrieval of a XUA assertion requires user authentication by providing the IdP assertion in the *Security* header of the SOAP envelope (see [Message Semantics](GetXAssertion.md#message-semantics)). The IdP assertion shall be retrieved by the primary system by using the [Authenticate User](AuthenticateUser.md) transaction.  

## Test Opportunity

The transaction can be tested with the test suite of the [EPR reference environment](gazelle.md) or the test systems of the EPR communities.
