# Get X-User Assertion
Transaction to retrieve a SAML 2.0 assertion for authorization of transactions in the Swiss EPR.  

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
**[Provide X-User Assertion](./ProvideXAssertion.md)** with XDS.b transactions as defined in the **[IHE XUA profile](https://profiles.ihe.net/ITI/TF/Volume1/ch-13.html)** with Swiss specific extensions defined in  
**[Amendment 1 to Annex 5](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/gesetze/anhang_5_ergaenzung_1_epdv_edi_20200415.PDF.download.PDF/Ergaenzung_1_Anhang_5_EPDV-EDI_20200415.pdf.PDF)**.

The primary system shall provide claims (e.g., user role, purpose of use) with the request as defined in **[Ammendment 1 to Annex 5](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/gesetze/anhang_5_ergaenzung_1_epdv_edi_20200415.PDF.download.PDF/Ergaenzung_1_Anhang_5_EPDV-EDI_20200415.pdf.PDF)**.

The community verifies the claims and responds with a XUA compliant SAML 2.0 Assertion defined in **[Ammendment 1 to Annex 5](https://www.bag.admin.ch/dam/bag/de/dokumente/nat-gesundheitsstrategien/strategie-ehealth/gesetzgebung-elektronisches-patientendossier/gesetze/anhang_5_ergaenzung_1_epdv_edi_20200415.PDF.download.PDF/Ergaenzung_1_Anhang_5_EPDV-EDI_20200415.pdf.PDF)**.

# Transaction

## Message Semantics  

Messages are encoded as described in the **[WS Trust](http://docs.oasis-open.org/ws-sx/ws-trust/v1.4/ws-trust.html)** standard, with restrictions defined in the IHE profile and the ordinances to the Swiss EPR.

### Request Message

The following snippets display a sample request recorded during the EPR projectathon in September 2020. Some elements
were ommitted to increase readability. The raw request file may be found **[here](https://github.com/msmock/AnnotatedTX/blob/main/samples/GetXAssertion_request_raw.xml)**.

The request message shall be a XML SOAP envelope with the query embedded in the *Body* element of the SOAP envelope.
The SOAP *Header* element conveys the following information:

- *To* element: The URL of the registry stored query service.
- *MessageID* element: a UUID of the message.
- *Action* element: The SOAP action identifier of the query as defined in the IHE ITI Technical Framework.
- *Security* element: The Web Service Security header as defined in the **[WS Security](http://docs.oasis-open.org/wss-m/wss/v1.1.1/os/wss-SOAPMessageSecurity-v1.1.1-os.html)** specification. This element conveys the IdP Assertion which authenticates the user (see **[Authenticate User](../files/AuthenticateUser.md)**).  

The SOAP *Body* element conveys the *AdhocQuery* (lines 15 to 26 below) with the following information:

- *Slot* element with name *$XDSDocumentEntryStatus*: The status filter parameter, which must take the value *urn:oasis:names:tc:ebxml-regrep:StatusType:Approved* (line 18).  
- *Slot* element with name *$XDSDocumentEntryPatientId*: The master patient ID (XAD-PID) of the patient in CX format
(see **[PIX Feed](./PIXFeed.md)**) (line 23).

```
1 <env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope">
2  <env:Header>
3   <wsa:Action xmlns:wsa="http://www.w3.org/2005/08/addressing">http://docs.oasis-open.org/ws-sx/ws-trust/200512/RST/Issue</wsa:Action>
4   <wsa:MessageID xmlns:wsa="http://www.w3.org/2005/08/addressing">urn:uuid:005300f3-c686-4960-8ae8-f8c1720eda41</wsa:MessageID>
5   <wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd">
6    <saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:xs="http://www.w3.org/2001/XMLSchema" ID="Assertion_dbce1232740fcad9e020f927fd25a5d04779b4cc" IssueInstant="2020-09-21T13:38:43.857Z" Version="2.0">
7      <!-- IdP Assertion content ommitted for brevity -->
8    </saml2:Assertion>
9   </wsse:Security>
10  </env:Header>
11  <env:Body>
12   <wst:RequestSecurityToken xmlns:wst="http://docs.oasis-open.org/ws-sx/ws-trust/200512">
13    <wsp:AppliesTo xmlns:wsp="http://schemas.xmlsoap.org/ws/2004/09/policy">
14     <wsa:EndpointReference xmlns:wsa="http://www.w3.org/2005/08/addressing">
15      <wsa:Address>https://sp.communilty.ch</wsa:Address>
16     </wsa:EndpointReference>
17    </wsp:AppliesTo>
18    <wst:Claims Dialect="http://www.bag.admin.ch/epr/2017/annex/5/amendment/2">
19     <saml2:Attribute xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" Name="urn:oasis:names:tc:xacml:2.0:resource:resource-id">
20      <saml2:AttributeValue xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:type="xsd:string">761337610411353650^^^&amp;2.16.756.5.30.1.127.3.10.3&amp;ISO</saml2:AttributeValue>
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

### Response Message

TBD

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
21      <saml2:Assertion xmlns:saml2="urn:oasis:names:tc:SAML:2.0:assertion" xmlns:xsd="http://www.w3.org/2001/XMLSchema" ID="_96189571-c72c-4a10-8f1c-6d5b27efa797" IssueInstant="2020-09-21T13:39:23.200Z" Version="2.0">
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

TBD

```
code block here    
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
