# SSO Logout

Transaction to log out a user from the IdP and all session participants. Primary systems shall perform this transaction to
notify the IdP, when a user logs out, or to receive a notification from the IdP, when the user logged out from another application sharing the same IdP session.

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

Primary systems shall perform this transaction to notify the IdP, when a user logs out, or to receive a notification from the IdP, when the user logged from another relying party sharing the same session.

# Transaction

## Message Semantics
Messages are encoded as described in **[Assertions and Protocols for the OASIS Security Assertion Markup Language (SAML) V2.0](http://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)** and the ordinances to the Swiss EPR.

### Request Message

The following snippet shows the content of a logout request, with some elements omitted to increase readability.

The major content (lines 9..32) of the message is required for to sign the message compliant with the **[SAML 2.0 specification](http://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)**. Apart from that, the message conveys the following information:
- *ID*: A unique ID of the request message (line 4).
- *Destination*: An identifier of the receiver endpoint. For primary systems sending the request, this shall be the URL of IdP logout endpoint (line 7).
- *NameID*: The electronic ID used to authenticate the user (line 33). It's value shall match the value provided in the IdP Assertion (see **[Authenticate User](./AuthenticateUser.md)**).
- *SessionIndex*: The unique ID of the session used to identify all systems sharing the same session. It's value shall match the Session Index provided in the IdP Assertion (see **[Authenticate User](./AuthenticateUser.md)**).  

```
1 <samlp:LogoutRequest
2 	xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
3 	xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
4 	ID="pfxd4d369e8-9ea1-780c-aff8-a1d11a9862a1"
5 	Version="2.0"
6 	IssueInstant="2020-07-18T01:13:06Z"
7 	Destination="http://idp.example.com/SSOLogoutService">
8 	<saml:Issuer>http://sp.application.com</saml:Issuer>
9 	<ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
10 		<ds:SignedInfo>
11 			<ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
12 			<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
13 			<ds:Reference URI="#pfxd4d369e8-9ea1-780c-aff8-a1d11a9862a1">
14 				<ds:Transforms>
15 					<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
16 					<ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
17 				</ds:Transforms>
18 				<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
19 				<ds:DigestValue>Q9PRlugQZKSBt+Ed9i6bKUGWND0=</ds:DigestValue>
20 			</ds:Reference>
21 		</ds:SignedInfo>
22 		<ds:SignatureValue>
23 			<!-- omitted for brevity -->
24 		</ds:SignatureValue>
25 		<ds:KeyInfo>
26 			<ds:X509Data>
27 				<ds:X509Certificate>
28 					<!-- omitted for brevity -->
29 				</ds:X509Certificate>
30 			</ds:X509Data>
31 		</ds:KeyInfo>
32 	</ds:Signature>
33 	<saml:NameID SPNameQualifier="http://sp.application.com" Format="urn:oasis:names:tc:SAML:2.0:nameid-format:transient">IdP_User_ID_f92cc183</saml:NameID>
34 	<saml:SessionIndex>bdfe3302-3ed8-11eb-b378-0242ac130002</saml:SessionIndex>
35 </samlp:LogoutRequest>
```

### Response Message

The following snippet shows the content of a logout response, with some elements omitted to increase readability.

The major content (lines 9..32) of the message is required for to sign the message compliant with the **[SAML 2.0 specification](http://docs.oasis-open.org/security/saml/v2.0/saml-core-2.0-os.pdf)**. Apart from that, the message conveys the following information:
- *ID*: A unique ID of the request message (line 4).
- *Destination*: An identifier of the receiver endpoint as URL (line 7).
- *InResponseTo*: The unique ID of the initial request (line 8).
- *Status*: The return status of the request, indicating success or failure (line 34 .. 36).

```
1 <samlp:LogoutResponse
2 	xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
3 	xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
4 	ID="pfxe335499f-e73b-80bd-60c4-1628984aed4f"
5 	Version="2.0"
6 	IssueInstant="2020-07-18T01:13:06Z"
7 	Destination="http://sp.example.com/LogoutService"
8 	InResponseTo="pfxd4d369e8-9ea1-780c-aff8-a1d11a9862a1">
9 	<saml:Issuer>http://idp.example.com/LogoutService</saml:Issuer>
10 	<ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#">
11 		<ds:SignedInfo>
12 			<ds:CanonicalizationMethod Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
13 			<ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1"/>
14 			<ds:Reference URI="#pfxe335499f-e73b-80bd-60c4-1628984aed4f">
15 				<ds:Transforms>
16 					<ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature"/>
17 					<ds:Transform Algorithm="http://www.w3.org/2001/10/xml-exc-c14n#"/>
18 				</ds:Transforms>
19 				<ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1"/>
20 				<ds:DigestValue>PusFPAn+RUZV+fBvwPffNMOENwE=</ds:DigestValue>
21 			</ds:Reference>
22 		</ds:SignedInfo>
23 		<ds:SignatureValue>
24 			<!-- omitted for brevity -->
25 		</ds:SignatureValue>
26 		<ds:KeyInfo>
27 			<ds:X509Data>
28 				<ds:X509Certificate>
29 					<!-- omitted for brevity -->
30 				</ds:X509Certificate>
31 			</ds:X509Data>
32 		</ds:KeyInfo>
33 	</ds:Signature>
34 	<samlp:Status>
35 		<samlp:StatusCode Value="urn:oasis:names:tc:SAML:2.0:status:Success"/>
36 	</samlp:Status>
37 </samlp:LogoutResponse>
```

## Transport Protocol

The *LogoutRequest* may be send by primary systems to the IdP using one of the following bindings:
- SAML 2.0 HTTP POST binding via the frontchannel (involving the browser).
- SAML 2.0 SOAP binding via the backchannel.

## Audit Log

Primary systems shall protocol the transaction in their logs to ensure traceability. No further requirements are defined in
the ordinances of the Swiss EPR.

## Security Requirements  

Communication via the SOAP backchannel shall be secured with TLS and mutual authentication, using
client and server certificate validation. The certificates used, shall be exchanged during the client registration process.  

Communication via the frontchannel (involving the browser) shall be secured with HTTPS and mutual authentication, using server certificate validation.  

# Test Opportunity

*TODO*
