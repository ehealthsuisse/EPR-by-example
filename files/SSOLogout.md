# SSO Logout

Transaction to log out a user from the IdP and all session participants. Primary systems shall perform this transaction to
notify the IdP, when a user logs out, or to receive a notification from the IdP, when the user logged out from another application sharing the same IdP session.

## Overview

Primary systems shall perform this transaction to notify the IdP, when a user logs out, or to receive a notification from the IdP, when the user logged from another relying party sharing the same session.

## Transaction

### Message Semantics
Messages are encoded as described in [Assertions and Protocols for the OASIS Security Assertion Markup Language (SAML) V2.0][saml-core] and the ordinances to the Swiss EPR.

#### Request Message

The following snippet shows the content of a logout request, with some elements omitted to increase readability.

The major content (lines 9..32) of the message is required for to sign the message compliant with the [SAML 2.0 specification][saml-core]. Apart from that, the message conveys the following information:

- *ID*: A unique ID of the request message (line 4).
- *Destination*: An identifier of the receiver endpoint. For primary systems sending the request, this shall be the URL of IdP logout endpoint (line 7).
- *NameID*: The electronic ID used to authenticate the user (line 33). It's value shall match the value provided in the IdP Assertion (see [Authenticate User](AuthenticateUser.md)).
- *SessionIndex*: The unique ID of the session used to identify all systems sharing the same session. It's value shall match the Session Index provided in the IdP Assertion (see [Authenticate User](AuthenticateUser.md)).  

```xml title="2_Logout Request.xml" linenums="1" hl_lines="4 7 33 34"
--8<-- "Auth_samples/2_Logout Request.xml"
```

#### Response Message

The following snippet shows the content of a logout response, with some elements omitted to increase readability.

The major content (lines 9..32) of the message is required for to sign the message compliant with the [SAML 2.0 specification][saml-core]. Apart from that, the message conveys the following information:

- *ID*: A unique ID of the request message (line 4).
- *Destination*: An identifier of the receiver endpoint as URL (line 7).
- *InResponseTo*: The unique ID of the initial request (line 8).
- *Status*: The return status of the request, indicating success or failure (line 34 .. 36).

```xml title="2_Logout Response.xml" linenums="1" hl_lines="4 7 8 34-36"
--8<-- "Auth_samples/2_Logout Response.xml"
```

### Transport Protocol

The *LogoutRequest* may be send by primary systems to the IdP using one of the following bindings:

- SAML 2.0 HTTP POST binding via the frontchannel (involving the browser).
- SAML 2.0 SOAP binding via the backchannel.

### Audit Log

Primary systems shall protocol the transaction in their logs to ensure traceability. No further requirements are defined in
the ordinances of the Swiss EPR.

### Security Requirements  

Communication via the SOAP backchannel shall be secured with TLS and mutual authentication, using
client and server certificate validation. The certificates used, shall be exchanged during the client registration process.  

Communication via the frontchannel (involving the browser) shall be secured with HTTPS and mutual authentication, using server certificate validation.  

## Test Opportunity

The transaction can be tested with the Gazelle test suite of the [EPR reference environment][ref-env], or test systems of the EPR communities. 
