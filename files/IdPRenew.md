# IdP Renew

Transaction to renew a IdP Assertion. Primary systems may use this transaction to retrieve a new IdP Assertion, without requiring the user to enter her credentials.

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

Primary systems shall use this transaction retrieve a new IdP Assertion by sending an assertion retrieved beforehand.   

# Transaction

## Message Semantics

Messages are encoded as described in **[Assertions and Protocols for the OASIS Security Assertion Markup Language (SAML) V2.0](http://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)** and the ordinances to the Swiss EPR.

### Request Message

Primary systems shall use this transaction to renew a assertion whose lifetime is exceeded.

The following snippet is adapted from a sample request recorded during the EPR projectathon in September 2020. Some elements
and namespaces were omitted to increase readability. The raw request file may be found **[here](../Auth_samples/Renew_request_raw.xml)**.

The *Header* element of the SOAP envelope contains the data used to sign the request message, as required from the ordinances of the Swiss EPR in **[Annex 8](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)** and specified in the **[Web Service Security: SOAP Message Security 1.1.](https://www.oasis-open.org/committees/download.php/16790/wss-v1.1-spec-os-SOAPMessageSecurity.pdf)** specification.

```
1 <Envelope>
2  <Header>
3   <Security mustUnderstand="1">
8    <Timestamp Id="TS-15277e04-85e0-4b9c-9692-76c3e7be17bc">
9     <Created>2019-03-26T15:13:15.144Z</Created>
10     <Expires>2019-03-26T15:18:15.144Z</Expires>
11    </Timestamp>
12    <BinarySecurityToken
13     EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary"
14     ValueType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-x509-token-profile-1.0#X509v3"
15     Id="X509-6dfe58da-6804-48ba-ad52-e871c63455df">
18     MIIDPTCCAiWgAwIBAgIEPVbC1zANBgkqhkiG9w0BAQUFADBPMQswCQYDVQQGEqSqEb/3VB3ITUav3DIo2o2mRCKyfHV471QUNt4qNFmEwRxpsoGst/UYoTqW8/buv4A=
19    </BinarySecurityToken>
20    <Signature Id="SIG-98f468bf-4022-4e31-9886-6f30f1c676bc">
21     <SignedInfo>
22      <CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
23       <InclusiveNamespaces PrefixList="soap"/>
24      </CanonicalizationMethod>
25      <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#ecdsa-sha256"/>
26      <Reference URI="#TS-15277e04-85e0-4b9c-9692-76c3e7be17bc" >
27       <Transforms>
28        <Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#">
29         <InclusiveNamespaces PrefixList="soap wsse"/>
30        </Transform>
31       </Transforms>
32       <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
33       <DigestValue>LCxW9EORpApnpju2Q17b0MB1LGt8CMCuvoOqCtlhFx0=</DigestValue>
34      </Reference>
35      <Reference URI="#_33c9f0c5-c7d2-4d53-ad2f-944320637754" >
36       <Transforms>
37        <Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
38       </Transforms>
39       <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha256"/>
40       <DigestValue>TwKUz3SxOx1NaFVvy55AbbpWXbUJmfn+mreDpkNa/pg=</ds:DigestValue>
41      </Reference>
42     </SignedInfo>
43     <SignatureValue>
44      <!-- signature value omitted -->
45     </SignatureValue>
46     <KeyInfo Id="KI-2c6438fa-738a-4ffb-aa52-379bd9380b1a">
47      <SecurityTokenReference Id="STR-76ccd654-581d-446e-a00b-8ed529bcc4ab">
51       <X509Data>
52        <X509IssuerSerial>
53         <X509IssuerName>CN=lk,OU=lk,O=lk,L=lsn,ST=vd,C=ch</X509IssuerName>
54         <X509SerialNumber>1029096151</X509SerialNumber>
55        </X509IssuerSerial>
56       </X509Data>
57      </SecurityTokenReference>
58     </KeyInfo>
59    </Signature>
60   </Security>
61  </Header>
```

Primary systems shall embed the SAML Assertion in the the *Body* of the SOAP envelope (see lines 67 .. 69 in example below).

```
62  <Body Id="_33c9f0c5-c7d2-4d53-ad2f-944320637754">
63   <RequestSecurityToken>
64    <RequestType>http://docs.oasis-open.org/ws-sx/ws-trust/200512/Renew</RequestType>
65    <TokenType>http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV2.0</TokenType>
66    <RenewTarget>
67     <Assertion>
68      <!-- Assertion to be renewed omitted for brevity -->
69     </Assertion>
70    </RenewTarget>
71    <Renewing/>
72   </RequestSecurityToken>
73  </Body>
74 </Envelope>
```

### Response Message

The community responds with a SAML 2.0 IdP assertion whose lifetime is updated.  

The following snippet is adapted from a sample request recorded during the EPR projectathon in September 2020. Some elements
and namespaces were ommitted to increase readability. The raw request file may be found **[here](../Auth_samples/Renew_response_raw.xml)**.

A SAML 2.0 IdP Assertion with identical attributes but updated lifetime is conveyed in the the *Body* of the SOAP envelope (see lines 67 .. 69). Examples of Swiss EPR compliant XUA assertions may be found **[here](../XUA_samples)**.

```
1 <Envelope>
2  <Header/>
3  <Body>
4   <RequestSecurityTokenResponse Context="">
5    <TokenType>http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV2.0</TokenType>
6    <Lifetime>
7     <wsu:Created>2019-03-26T15:13:13.378Z</wsu:Created>
8     <wsu:Expires>2019-03-26T15:18:13.378Z</wsu:Expires>
9    </Lifetime>
10    <RequestedSecurityToken>
11     <Assertion>
12      <!-- Assertion returned by the IdP omitted for brevity -->
13     </Assertion>
14    </RequestedSecurityToken>
15    <RequestedAttachedReference>
16     <SecurityTokenReference TokenType="http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV2.0">
17      <KeyIdentifier ValueType="http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLID">#ID_cf6f7da6-c670-4c35-b413-39182b5672f2</KeyIdentifier>
18     </SecurityTokenReference>
19    </RequestedAttachedReference>
20   </RequestSecurityTokenResponse>
21  </Body>
22 </Envelope>
```

## Transport Protocol

The primary system shall send the request messages to the registry of the community using the http POST binding as defined
in the **[W3C SOAP specification](https://www.w3.org/TR/2007/REC-soap12-part0-20070427/#L26866)**. It may look like:  

```
POST /RegistryStoredQueryService HTTP/1.1
Host: company.example.org
Accept-Encoding: gzip, deflate
Connection: Keep-Alive
Content-Type: application/soap+xml; charset="utf-8"
Content-Length: nnnn  
```

## Audit Log

Primary systems shall protocol the request and response for traceability. There are no further requirements on protocols defined in the ordinances of the Swiss EPR.  

## Security Requirements  

To ensure privacy the transaction must be secured using the TLS SOAP backchannel with mutual authentication by server and client certificate validation.

# Test Opportunity

The transaction can be tested with the Gazelle test suite of the **[EPR reference environment](https://ehealthsuisse.ihe-europe.net)**, or test systems of the EPR communities.
