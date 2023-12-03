# Get X-User Assertion
Transaction to retrieve a SAML 2.0 assertion for authorization of transactions in the Swiss EPR. Primary systems shall use this transaction to retrieve a SAML 2 assertions to be used with EPR transactions, which require authorization.  

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

Primary systems shall use this transaction to retrieve a SAML 2 assertions to be used with the
**[Provide X-User Assertion](ProvideXAssertion.md)** with XDS.b transactions as defined in
the **[IHE XUA profile](https://profiles.ihe.net/ITI/TF/Volume1/ch-13.html)** with Swiss specific extensions defined in  
**[Amendment 1 to Annex 5](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.

The primary system shall provide claims (e.g., user role, purpose of use) with the request as defined in **[Amendment 1 to Annex 5](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.

The community verifies the claims and responds with a XUA compliant SAML 2.0 Assertion defined in **[Amendment 1 to Annex 5](https://www.fedlex.admin.ch/eli/oc/2023/221/de/annexes)**.

# Transaction

## Message Semantics  

Messages are encoded as described in the **[WS Trust](http://docs.oasis-open.org/ws-sx/ws-trust/v1.4/ws-trust.html)** standard, with restrictions defined in the IHE profile and the ordinances to the Swiss EPR.

### Request Message

The following snippet is taken from a sample request recorded during the EPR projectathon in September 2020. Some elements are omitted to increase readability. The raw request file may be found **[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/GetXAssertion_request_raw.xml)**.

The snippet shows a request performed by a healthcare professional performing a the normal access. For other roles and situations the claims are different. Other examples may be found at **[XUA examples](https://github.com/ehealthsuisse/EPD-by-example/tree/main/XUA_samples)**.   

The request message shall be a XML SOAP envelope with the query embedded in the *Body* element of the SOAP envelope.
The SOAP *Header* element conveys the following information:

- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the query as defined in the IHE ITI Technical Framework.
- *Security* element: The Web Service Security header as defined in the **[WS Security](http://docs.oasis-open.org/wss-m/wss/v1.1.1/os/wss-SOAPMessageSecurity-v1.1.1-os.html)** specification. This element must contain the IdP Assertion taken from user authentication (see **[Authenticate User](AuthenticateUser.md)**).  

```
1 <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
2  <env:Header>
3   <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing">http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue</wsa:Action>
4   <wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing">urn:uuid:005300f3-c686-4960-8ae8-f8c1720eda41</wsa:MessageID>
5   <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
6    <saml2:Assertion>
7      <!-- IdP Assertion content ommitted for brevity -->
8    </saml2:Assertion>
9   </wsse:Security>
10  </env:Header>
11  <env:Body>
12   <wst:RequestSecurityToken xmlns:wst="http://docs.oasis-open.org/ws-sx/ws-trust/200512">
13    <wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy">
14     <wsa:EndpointReference xmlns:wsa="http://www.w3.org/2005/08/addressing">
15      <wsa:Address>https://sp.community.ch</wsa:Address>
16     </wsa:EndpointReference>
17    </wsp:AppliesTo>
18    <wst:Claims Dialect="http://www.bag.admin.ch/epr/2017/annex/5/amendment/2">
19     <saml2:Attribute xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" Name="urn:oasis:names:tc:xacml:2.0:resource:resource-id">
20      <saml2:AttributeValue xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:token">761337610411353650^^^&amp;2.16.756.5.30.1.127.3.10.3&amp;ISO</saml2:AttributeValue>
21     </saml2:Attribute>
22     <saml2:Attribute xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" Name="urn:oasis:names:tc:xspa:1.0:subject:purposeofuse">
23      <saml2:AttributeValue xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:anyType">
24       <PurposeOfUse xmlns="urn:hl7-org:v3" code="NORM" codeSystem="2.16.756.5.30.1.127.3.10.5" codeSystemName="eHealth Suisse Verwendungszweck" displayName="Normalzugriff" xsi:type="CE"/>
25      </saml2:AttributeValue>
26     </saml2:Attribute>
27     <saml2:Attribute xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" Name="urn:oasis:names:tc:xacml:2.0:subject:role">
28      <saml2:AttributeValue xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:anyType">
29       <Role xmlns="urn:hl7-org:v3" code="HCP" codeSystem="2.16.756.5.30.1.127.3.10.6" codeSystemName="eHealth Suisse EPR Akteure" displayName="Behandelnde(r)" xsi:type="CE"/>
30      </saml2:AttributeValue>
31     </saml2:Attribute>
32    </wst:Claims>
33    <wst:TokenType>http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV2.0</wst:TokenType>
34    <wst:RequestType>http://docs.oasis-open.org/ws-sx/ws-trust/200512/Issue</wst:RequestType>
35   </wst:RequestSecurityToken>
36  </env:Body>
37 </env:Envelope>    
```

The SOAP *Body* element contains the *RequestSecurityToken* element with the following claims to be set by the primary system. It's child element read:

**AppliesTo** the URL of the community endpoint the XUA assertion shall be used for authorization, whose value is set in the *Address* child element.

```
13    <wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy">
14     <wsa:EndpointReference xmlns:wsa="http://www.w3.org/2005/08/addressing">
15      <wsa:Address>https://sp.community.ch</wsa:Address>
16     </wsa:EndpointReference>
17    </wsp:AppliesTo>
```

**resourceID** conveying the EPR-SPID of the patient EPR to access in CX format (see see **[PIXFeed](PIXFeed.md)**)

```
19     <saml2:Attribute xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" Name="urn:oasis:names:tc:xacml:2.0:resource:resource-id">
20      <saml2:AttributeValue xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:token">761337610411353650^^^&amp;2.16.756.5.30.1.127.3.10.3&amp;ISO</saml2:AttributeValue>
21     </saml2:Attribute>
```

**purposeOfUse** conveying the purpose of use of the request, which must be taken from the EPR value set defined in **[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)**
of the ordinances of the Swiss electronic patient dossier.

```
23      <saml2:AttributeValue xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:anyType">
24       <PurposeOfUse xmlns="urn:hl7-org:v3" code="NORM" codeSystem="2.16.756.5.30.1.127.3.10.5" codeSystemName="eHealth Suisse Verwendungszweck" displayName="Normalzugriff" xsi:type="CE"/>
25      </saml2:AttributeValue>
```

**role** conveying the EPR role of the user, which must be taken from the EPR value set defined in **[Annex 3](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/dokumente/04-epdv-edi-anhang-3-de.pdf.download.pdf/04_EPDV-EDI%20Anhang%203_DE.pdf)**.

```
27     <saml2:Attribute xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" Name="urn:oasis:names:tc:xacml:2.0:subject:role">
28      <saml2:AttributeValue xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:anyType">
29       <Role xmlns="urn:hl7-org:v3" code="HCP" codeSystem="2.16.756.5.30.1.127.3.10.6" codeSystemName="eHealth Suisse EPR Akteure" displayName="Behandelnde(r)" xsi:type="CE"/>
30      </saml2:AttributeValue>
```

### Response Message

The following snippet is taken from a sample response recorded during the EPR projectathon in September 2020. Some elements
were ommitted to increase readability. The raw file may be found **[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/samples/GetXAssertion_response_raw.xml)**.

The response message is a XML SOAP envelope with the XUA Assertion embedded in the the *Body* element of the SOAP envelope (see example below, lines 21 to 23). Primary systems shall extract the XUA Assertion to use the im the security header of the XDS.b transactions, which require authorization. For primary systems, there is no need to extract information from the XUA assertion.  

The XUA Assertion is omitted in the snippet below. For examples of see **[here](https://github.com/ehealthsuisse/EPD-by-example/tree/main/XUA_samples)**.  

```
1 <?xml version='1.0' encoding='utf-8'?>
2 <soapenv:Envelope xmlns:soapenv="http://www.w3.org/2003/05/soap-envelope">
3  <soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing">
4   <wsa:Action>http://docs.oasis-open.org/ws-sx/ws-trust/200512/RSTRC/IssueFinal</wsa:Action>
5   <wsa:RelatesTo>urn:uuid:005300f3-c686-4960-8ae8-f8c1720eda41</wsa:RelatesTo>
6  </soapenv:Header>
7  <soapenv:Body>
8   <wst:RequestSecurityTokenResponseCollection xmlns:wst="http://docs.oasis-open.org/ws-sx/ws-trust/200512">
9    <wst:RequestSecurityTokenResponse>
10     <wst:TokenType>http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV2.0</wst:TokenType>
11     <wst:Lifetime>
12      <wsu:Created xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">2020-09-21T13:39:23.200Z</wsu:Created>
13      <wsu:Expires xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">2020-09-21T13:54:23.200Z</wsu:Expires>
14     </wst:Lifetime>
15     <wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy">
16      <wsa:EndpointReference xmlns:wsa="http://www.w3.org/2005/08/addressing">
17       <wsa:Address>https://sp.communilty.ch</wsa:Address>
18      </wsa:EndpointReference>
19     </wsp:AppliesTo>
20     <wst:RequestedSecurityToken>
21      <saml2:Assertion>
22       <!-- assertion content omitted for brevity -->
23      </saml2:Assertion>
24     </wst:RequestedSecurityToken>
25     <wst:RequestedAttachedReference>
26      <wsse:SecurityTokenReference xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
27       <wsse:Reference URI="_96189571-c72c-4a10-8f1c-6d5b27efa797" ValueType="http://docs.oasis-open.org/wss/oasis-wss-saml-token-profile-1.1#SAMLV2.0"/>
28      </wsse:SecurityTokenReference>
29     </wst:RequestedAttachedReference>
30    </wst:RequestSecurityTokenResponse>
31   </wst:RequestSecurityTokenResponseCollection>
32  </soapenv:Body>
33 </soapenv:Envelope>  
```

## Transport Protocol

The primary system shall send the request messages to the X-Assertion Provider of the community using the http
POST binding as defined in the **[W3C SOAP specification](https://www.w3.org/TR/2007/REC-soap12-part0-20070427/#L26866)**. It may look like:  

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

To ensure privacy the transaction must be secured using https with mutual authentication, using X.509 certificates (extended validation required) and client and server side certificate validation.

The retrieval of a XUA assertion requires user authentication by providing the IdP assertion in the *Security* header of the SOAP envelope (see **[Message Semantics](GetXAssertion.md#message-semantics)**). The IdP assertion shall be retrieved by the primary system by using the **[Authenticate User](AuthenticateUser.md)** transaction.  

# Test Opportunity

The transaction can be tested with the test suite of the **[EPR reference environment](gazelle.md)** or the test systems of the EPR communities.
