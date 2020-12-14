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

*TODO*

#### Message Interpretation

*TODO*

## Transport Protocol

*TODO*

## Audit Log

*TODO*

```
code block here    
```

## Security Requirements  

*TODO*

# Test Opportunity

*TODO*
