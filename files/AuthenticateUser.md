# Authenticate User
Transaction to authenticate a user at a identity provider certified for the Swiss EPR. Primary systems shall use this transaction to retrieve a IdP assertion. The IdP assertion is required to retrieve the XUA Assertion to be used with EPR transactions.

## Overview

Primary systems shall use this transaction to retrieve an IdP assertion authentication the user for the access to the
Swiss EPR.

The requirements for the transaction are defined in
**[Annex 8][annexes]** of the ordinances of the Swiss EPR.

The EPR requires primary systems to implement authentication as described in the SAML 2.0 specification family, i.e.,
- **[Assertions and Protocols for the OASIS Security Assertion Markup Language (SAML) V2.0][saml-core]**.
- **[Bindings for the OASIS Security Assertion Markup Language (SAML) V2.0][saml-bindings]**.
- **[Profiles for the OASIS Security Assertion Markup Language (SAML) V2.0](http://docs.oasis-open.org/security/saml/v2.0/saml-profiles-2.0-os.pdf)**.

Primary systems do need implement all the bindings and profiles supported by the SAML 2.0 specification family.

In the Swiss EPR the following bindings are required:
- HTTP POST Binding.
- HTTP Artifact Binding.
- SAML SOAP Binding.    

In the Swiss EPR the following profiles are required:
- Web Browser SSO Profile.
- Single Logout Profile.

The usage of the profiles and binding used to authenticate user for the Swiss EPR is described in the following sections.

## Transactions

The transaction to authenticate a user for the access to the Swiss EPR is a multi-step flow consisting of HTTP Post and SOAP Web Service calls, as displayed in the following figure:

![Authentication Sequence](media/SAML-Artifact-flow.png)

**Figure 1: Authentication Sequence Diagram**

The sequence consists of the following steps, each using assigned transaction messages:

- [01 .. 04] The user (claimant) is redirected to the identity provider via the user agent (browser) with a SAML 2.0 *AuthnRequest* message.
- [05] The user (claimant) authenticates at the identity provider with her authentication means.
- [06 .. 07] The identity provider responds a SAML 2.0 artifact in a HTTP redirect to the primary system (relying party).  
- [08] The primary system sends a *ArtifactResolve* message to resolve the SAML artifact to the SAML 2 IdP Assertion via the SOAP backchannel.
- [09] The IdP responds the IdP Assertion in the *ArtifactResponse* message.

### Authentication Request

The transaction shall be performed by the primary system when the user aims to access the EPR. The primary system shall
redirect the user agent (browser) to the IdP authentication endpoint with a *AuthnRequest* message as defined in
**[Assertions and Protocols for the OASIS Security Assertion Markup Language (SAML) V2.0][saml-core]**.

When the user is authenticated by the IdP, the IdP responds with a HTTP redirect to the registered endpoint of the primary
system as specified in **[Bindings for the OASIS Security Assertion Markup Language (SAML) V2.0][saml-bindings]**.

#### Message Semantics

##### Request Message

The following snippet is taken from a sample request recorded during the EPR projectathon in September 2020. Some elements
were ommitted to increase readability. The raw request file may be found
**[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/Auth_samples/04_AuthnRequest_raw.xml)**.

The *AuthnRequest* conveys the following information to be set by the primary system:
- *ID*: A unique ID of the request message (line 7 in the example below).
- *Issuer*: A ID of the primary system as URL (line 9 in the example below).
- *SignedInfo*: Signature metadata and the digest value used for the signature.
- *SignatureValue*: The signature of the request (line 23 in the example below).
- *X509Certificate*: The X509 certificate used to sign the request (line 26 in the example below).

``` xml title="04_AuthnRequest.xml" linenums="1" hl_lines="7 9 23 26"
--8<-- "Auth_samples/04_AuthnRequest.xml"
```

##### Response Message

The following snippet is taken from a sample request recorded during the EPR projectathon in September 2020. It conveys two parameter to be used by the primary system:
- *SAMLart*: The SAML artifact to be used in the *ArtifactResolve* request (see section below).
- *RelayState*: A unique identifier of the conversation, the primary system initially sent with the Authentication Request.

```urlencoded
https://epdtest.mycompany.local:8549/ACS?SAMLart=AAQAAOjXNPPr%2Fr7FO5WpiZ%2B2vAl5KMFibkRaAGwIkwXh%2Bo7DgsG2LMDE58c%3D&RelayState=idp%23468
```

#### Transport Protocol

The transaction uses front channel HTTP communication via the user agent (browser).

#### Security Requirements   

The transactions shall use TLS secured transports (HTTPS) to ensure data privacy and with server authentication.


### Artifact Resolve

The transaction shall be performed by the primary system to exchange the artifact to a SAML 2.0 IdP Assertion.

The primary system shall use the SOAP backchannel with an *ArtifactResolve* request message as defined in
**[Assertions and Protocols for the OASIS Security Assertion Markup Language (SAML) V2.0][saml-core]**.

The IdP server responds the SAML 2.0 IdP Assertion of the authenticated user.

#### Message Semantics

##### Request Message

The following snippet is taken from a sample request recorded during the EPR projectathon in September 2020. Some elements are omitted to increase readability. The raw request file may be found
**[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/Auth_samples/08_ArtifactResolve_raw.xml)**.

The *ArtifactResolve* conveys the following information to be set by the primary system:
- *Issuer*: A ID of the primary system as URL (line 4 in the example below).
- *SignedInfo*: Signature metadata and the digest value used for the signature.
- *SignatureValue*: The signature of the request (line 18 in the example below).
- *X509Certificate*: The X509 certificate used to sign the request (line 21 in the example below).
- *Artifact*: The artifact as retrieved from the Authentication Request transaction (line 25).

```xml title="08_ArtifactResolve_raw.xml" linenums="1" hl_lines="4 18 21 25"
--8<-- "Auth_samples/08_ArtifactResolve_raw.xml"
```

##### Response Message

The following snippet is taken from a sample response recorded during the EPR projectathon in September 2020. Some elements are omitted to increase readability. The raw version may be found **[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/Auth_samples/09_ArtifactResponse_raw.xml)**.

The *ArtifactResponse* conveys the following information which shall be evaluated by the primary system:
- *Issuer*: A ID of the primary system as URL (line 6 in the example below).
- *SignedInfo*: Signature metadata and the digest value used for the signature.
- *SignatureValue*: The signature of the request (line 26 in the example below) which shall be validated by the 
  primary system.
- *X509Certificate*: The X509 certificate used to sign the request (line 29 in the example below).
- *assertion*: The IdP assertion conveying the attributes of the authenticated user.  

```xml title="09_ArtifactResponse_raw.xml" linenums="1" hl_lines="4 18 21"
--8<-- "Auth_samples/09_ArtifactResponse.xml::47"
```

The following snippet shows an example of a IdP Assertion conveyed with the response.

The primary system must keep the IdP Assertion in memory to use it to authenticate the
**[Get X-User Assertion](GetXAssertion.md)** transaction.

The primary system is not required to analyze the IdP Assertion further, but may extract the following information from the
assertion:
-  *NameID* : This element conveys the user ID assigned by IdP. Primary systems may use it to locally authenticate the user in the primary system.
- *NotBefore* and *NotOnOrAfter*: The lifetime of the IdP assertion.
- *AttributeStatement*: IdP shall provide user attributes in the *AttributeStatement* child elements. At least the *givenname*, *surname*, *gender* and *dateofbirth* must be provided. Optional fileds may be provided. The optional fields cover the GLN of the healthcare professional and other attributes, the primary system may use internally to identify the authenticated user.

```xml linenums="47"
--8<-- "Auth_samples/09_ArtifactResponse.xml:47:105"
```

#### Transport Protocol

The primary system shall send the request messages to the IdP of the community using the http POST binding as defined in the **[W3C SOAP specification][soap]**. It may look like:  

```http linenums="1"
POST /IdPAuthenticationService HTTP/1.1
Host: idp.example.org
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
Content-Type: application/soap+xml; charset="utf-8"
Content-Length: nnnn  
```

#### Security Requirements   

The Artifact Resolve transaction shall be secured by using the SOAP backchannel with TLS and mutual authentication with client and server certificate validation. The certificates shall be exchanged during the client registration process.  

### Audit Log

Primary systems shall protocol the transaction in their logs to ensure traceability. No further requirements are defined in the ordinances of the Swiss EPR.

## Test Opportunity

The transaction can be tested with the test suite of the **[EPR reference environment](gazelle.md)**, test systems of the EPR communities or the **[EPR Playground](playground.md)**.
