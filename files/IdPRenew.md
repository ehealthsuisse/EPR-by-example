# IdP Renew

Transaction to renew a IdP Assertion. Primary systems may use this transaction to retrieve a new IdP Assertion, without requiring the user to enter her credentials.

## Overview

Primary systems shall use this transaction retrieve a new IdP Assertion by sending an assertion retrieved beforehand.   

## Transaction

### Message Semantics

Messages are encoded as described in [Assertions and Protocols for the OASIS Security Assertion Markup Language (SAML) V2.0][saml-core] and the ordinances to the Swiss EPR.

#### Request Message

Primary systems shall use this transaction to renew a assertion whose lifetime is exceeded.

The following snippet is adapted from a sample request recorded during the EPR projectathon in September 2020. Some elements
and namespaces were omitted to increase readability. The raw request file may be found [here](https://github.com/ehealthsuisse/EPR-by-example/tree/main/Auth_samples/Renew_request_raw.xml).

The *Header* element of the SOAP envelope contains the data used to sign the request message, as required from the ordinances of the Swiss EPR in [Annex 8][annexes] and specified in the [Web Service Security: SOAP Message Security 1.1.](https://www.oasis-open.org/committees/download.php/16790/wss-v1.1-spec-os-SOAPMessageSecurity.pdf) specification.

```xml title="SOAP header" linenums="1"
--8<-- "Auth_samples/Renew_request.xml::52"
```

Primary systems shall embed the SAML Assertion in the the *Body* of the SOAP envelope (see lines 58 .. 60 in example 
below).

```xml title="SOAP body" linenums="53"
--8<-- "Auth_samples/Renew_request.xml:53"
```

#### Response Message

The community responds with a SAML 2.0 IdP assertion whose lifetime is updated.  

The following snippet is adapted from a sample request recorded during the EPR projectathon in September 2020. Some elements
and namespaces were ommitted to increase readability. The raw request file may be found [here](https://github.com/ehealthsuisse/EPR-by-example/tree/main/Auth_samples/Renew_response_raw.xml).

A SAML 2.0 IdP Assertion with identical attributes but updated lifetime is conveyed in the the *Body* of the SOAP envelope (see lines 67 .. 69). Examples of Swiss EPR compliant XUA assertions may be found [here][XUA_samples].

```xml title="Response" linenums="1"
--8<-- "Auth_samples/Renew_response.xml"
```

### Transport Protocol

The primary system shall send the request messages to the registry of the community using the http POST binding as defined
in the [W3C SOAP specification][soap]. It may look like:  

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

To ensure privacy the transaction must be secured using the TLS SOAP backchannel with mutual authentication by server and client certificate validation.

## Test Opportunity

The transaction can be tested with the Gazelle test suite of the [EPR reference environment][ref-env], or test systems of the EPR communities.
