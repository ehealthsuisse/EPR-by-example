# Audit logs

When executing most of the transactions with the EPR, there is a requirement to send an audit log to the community 
describing who did what and when, on the client's side.
The community also creates such an audit log, and both can be compared if the need arises.

Since the audit logs may contain information about the transaction outcome, you have to wait for the community 
response before creating the audit log.

!!! warning
    You have to do your best efforts to send the audit logs, even if the transaction has failed (network issue or 
    error 500 for example).

## Specifications

The base specification of the `#!xml <AuditMessage>` format is given in [DICOM PS3.15](https://dicom.nema.org/medical/dicom/current/output/html/part15.html).
Additional requirements are described in:

- For each transaction, in the 'Security Considerations' section of each transaction profile;
- In the [IHE Audit Trail and Node Authentication (ATNA) Profile](https://profiles.ihe.net/ITI/TF/Volume1/ch-9.html);
- In [IHE ITI-20](https://profiles.ihe.net/ITI/TF/Volume2/ITI-20.html);
- In [IHE ITI-40](https://profiles.ihe.net/ITI/TF/Volume2/ITI-40.html#3.40.4.2) §3.40.4.2;
- In the [Amendment 1 to Annex 5][annexes], §1.5 and §1.6.4.3.5.1;

## Basic structure

An audit log is simply wrapped in a `#!xml <AuditMessage>` element.
No namespace is needed.

The first child is a _EventIdentification_ element that describes the transaction:
```xml
<EventIdentification EventActionCode="★action_code" EventDateTime="★date_time" EventOutcomeIndicator="★outcome">
  <EventID csd-code="★transaction_code" codeSystemName="DCM" originalText="★transaction_display"/>
  <EventTypeCode csd-code="★type_code" codeSystemName="IHE Transactions" originalText="★type_display"/>
  <PurposeOfUse csd-code="★puo_code" codeSystemName="2.16.756.5.30.1.127.3.10.5" originalText="★puo_display" />
</EventIdentification>
```
where:

- `action_code`, `transaction_code`, `transaction_display`,`type_code` and `type_display` depend on the 
  transaction type and are defined in the IHE transaction profile, in the 'Security Considerations' section;
- `date_time` is the date and time at which the transaction was made. It shall contain a timezone, and shall follow the 
  [xsd:dateTime](https://www.w3.org/TR/xmlschema11-2/#dateTime) format;
- `outcome` describes whether the transaction was successful or not: `0` is a success, `4` is a minor 
  failure, `8` is a serious failure and `12` is a major failure. The choice of the failure type is left to the 
  implementers;
- `puo_code` and `puo_display` are the _Purpose of Use_ code and display name, respectively. It is mandatory when the 
  transaction is secured by XUA; otherwise, the whole `#!xml <PurposeOfUse>` element shall be omitted.

Then, two _ActiveParticipants_ describe the source and destination participants.

=== "_ActiveParticipant_ source"

    The first _ActiveParticipant_ describes the source participant, which often is the one that has sent the 
    transaction (but not always).
    It has the following content:
    ```xml
    <ActiveParticipant UserID="★user_id" AlternativeUserID="★alt_user_id" NetworkAccessPointID="★nap_id" NetworkAccessPointTypeCode="★nap_type" UserIsRequest="true">
      <RoleIDCode csd-code="110153" codeSystemName="DCM" originalText="Source Role ID"/>
    </ActiveParticipant>
    ```
    where:

    - `user_id` is required and can be filled as you want. It can be a process ID, a login name, or other identifiers;
    - `alt_user_id` is the process ID as used within the local operating system in the local system logs;
    - `nap_id` is the DNS name or IP address of the source;
    - `nap_type` is `1` for machine (DNS) name, `2` for IP address.
    
    Other attributes are optional.

=== "_ActiveParticipant_ destination"

    The second _ActiveParticipant_ describes the destination participant, which often is the one that has received the 
    transaction (but not always).
    It has the following content:
    ```xml
    <ActiveParticipant UserID="★user_id" NetworkAccessPointID="★nap_id" NetworkAccessPointTypeCode="★nap_type" UserIsRequest="false">
      <RoleIDCode csd-code="110152" codeSystemName="DCM" originalText="Destination Role ID"/>
    </ActiveParticipant>
    ```
    where:

    - `user_id` is the SOAP endpoint URI;
    - `nap_id` is the DNS name or IP address of the destination;
    - `nap_type` is `1` for machine (DNS) name, `2` for IP address.
    
    Other attributes are optional.

!!! warning
    In some transactions such as ITI-43, the source and destination participants are reversed. Always check the IHE 
    specifications for the correct order. The participant "server" is the one having the "SOAP endpoint URI", the 
    participant "client" is the one having the "process ID".

Following that is the `#!xml <AuditSourceIdentification>` element.
It contains the following:
```xml
<AuditSourceIdentification AuditSourceID="★source" AuditEnterpriseSiteID="★oid" />
```
where `oid` is required by the [Amendment 1 to Annex 5][annexes] (§1.5.2) and must be an OID of your OID hierarchy.
Please ask your community if it has requirements about the use of this OID.
The `source` value is required by the standard, but its value choice is left to the implementers;
it should contain an "_Identifier of the source_".
You can copy the `oid` value if you want.

## Requirements for transactions secured by XUA

If the transaction is secured by XUA (like ITI-18, ITI-41, ITI-43), then additional _ActiveParticipants_ shall be 
specified to describe the authenticated participant of the transaction.

=== "First _ActiveParticipant_"

    The **first additional _ActiveParticipant_** is described in [IHE ITI-40](https://profiles.ihe.net/ITI/TF/Volume2/ITI-40.html#3.40.4.2),
    §3.40.4.2.
    It is required for all roles.
    It shall contain:
    ```xml
    <ActiveParticipant UserID="★user_id" UserName="★alias&lt;★user@★issuer&gt;" UserIsRequest="false" />
    ```
    where:
    
    - `user_id` is required and can be filled as you want. It can be a process ID, a login name, or other identifiers;
    - `alias` (optional) is the SAML Assertion's `#!abnf Subject/NameID/@SPProvidedID` attribute;
    - `user` (required) is the SAML Assertion's `#!abnf Subject/NameID` content;
    - `issuer` (required) is the SAML Assertion's `#!abnf Issuer` content.
    
    The other attributes and subject role specification are optional.

=== "Second _ActiveParticipant_"

    The **second additional _ActiveParticipant_** is described in the [Amendment 1 to Annex 5][annexes], §1.6.4.3.5.1.
    It is required for all roles.
    It shall contain:
    ```xml
    <ActiveParticipant UserID="★user_id" UserName="★user_name" UserIsRequestor="false">
        <RoleIDCode csd-code="★code" codeSystemName="2.16.756.5.30.1.127.3.10.6" originalText="★display"/>
    </ActiveParticipant>
    ```
    where:
    
    - `user_id` (required) is the SAML Assertion's `#!abnf Subject/NameID` content;
    - `user_name` (required) is the SAML Assertion's `#!abnf AttributeStatement/Attribute[@Name="urn:oasis:names:tc:xspa:1.0:subject:subject-id"]/AttributeValue` content;
    - `code` (required) is the SAML Assertion's `#!abnf AttributeStatement/Attribute[@Name="urn:oasis:names:tc:xacml:2.0:subject:role"]/AttributeValue/Role/@code` attribute.

    Other attributes are optional.

=== "Third _ActiveParticipant_"

    The **third additional _ActiveParticipant_** is described in the [Amendment 1 to Annex 5][annexes], §1.6.4.3.5.1.
    It is only required for assistants and technical users.
    It shall contain:
    ```xml
    <ActiveParticipant UserID="★user_id" UserName="★user_name" UserIsRequest="false">
        <RoleIDCode csd-code="★code" codeSystemName="2.16.756.5.30.1.127.3.10.6" originalText="★display" />
    </ActiveParticipant>
    ```
    where:
    
    - `user_id` (required) is the SAML Assertion's `#!abnf Subject/SubjectConfirmation/NameID` content;
    - `user_name` (required) is the SAML Assertion's `#!abnf Subject/SubjectConfirmation/SubjectConfirmationData/AttributeStatement/Attribute[@Name="urn:oasis:names:tc:xspa:1.0:subject:subject-id"]/AttributeValue` content;
    - `code` (required) is either `TCU` or `ASS`.

## Special parts

Some _ParticipantObjectIdentification_ elements may be used to include additional details about the query content.

### Query

For ITI-18 transaction, the query content has to be included in the `#!xml <ParticipantObjectIdentification>` element:
```xml
<ParticipantObjectIdentification ParticipantObjectID="★participant_object_id" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="24">
  <ParticipantObjectIDTypeCode csd-code="★transaction_code" codeSystemName="IHE Transactions" originalText="★transaction_display" />
  <ParticipantObjectQuery>★query_b64</ParticipantObjectQuery>
  <ParticipantObjectDetail type="QueryEncoding" value="★query_encoding_b64" />
</ParticipantObjectIdentification>
```
where:

- `participant_object_id` is the Stored Query ID for ITI-18, or optional for ITI-45 and ITI-47;
- `transaction_code` and `transaction_display` are the same as in `#!abnf EventIdentification/EventID`;
- `query_b64` is the XML representation of a part of the query, base64-encoded:
    - For ITI-18, the `AdhocQueryRequest`;
    - For ITI-45 and ITI-47, the `QueryByParameter` segment of the query;
- `query_encoding_b64` is the query encoding, encoded in base64. Usually `VVRGLTg=` (UTF-8).

For ITI-18 transactions, an additional `#!xml <ParticipantObjectIdentification>` is required inside, if the 
homeCommunityID is specified in the query:
```xml
<ParticipantObjectDetail type="urn:ihe:iti:xca:2010:homeCommunityId" value="★home_community_id_b64" />
```
where `home_community_id_b64` is the value of the homeCommunityId, base64-encoded.

### Patient

```xml
<ParticipantObjectIdentification ParticipantObjectID="★patient_id" ParticipantObjectTypeCode="1" ParticipantObjectTypeCodeRole="1">
  <ParticipantObjectIDTypeCode csd-code="2" codeSystemName="RFC-3881" originalText="Patient Number" />
</ParticipantObjectIdentification>
```
where `patient_id` is the patient identifier encoded in HL7 CX format (e.g. `value^^^&1.2.3&ISO`).

### Submission set

For ITI-41 requests, a `#!xml <ParticipantObjectIdentification>` is required to describe the Submission Set:
```xml
<ParticipantObjectIdentification ParticipantObjectID="★submission_set_unique_id" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="20">
  <ParticipantObjectIDTypeCode csd-code="urn:uuid:a54d6aa5-d40d-43f9-88c5-b4633d873bdd" originalText="submission set classificationNode" codeSystemName="IHE XDS Metadata"/>
</ParticipantObjectIdentification>
```
where `submission_set_unique_id` is the URN-encoded Submission Set unique ID.

### Document

For ITI-43 transactions, a `#!xml <ParticipantObjectIdentification>` is required to describe the document to be 
retrieved:
```xml
<ParticipantObjectIdentification ParticipantObjectID="★document_unique_id" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="3" ParticipantObjectSensitivity="★confidentiality_code">
  <ParticipantObjectIDTypeCode csd-code="9" codeSystemName="RFC-3881" originalText="Report Number"/>
  <ParticipantObjectDetail type="Repository Unique Id" value="★repo_unique_id_b64"/>
</ParticipantObjectIdentification>
```
where:

- `document_unique_id` is the document unique ID;
- `repo_unique_id_b64` is the repository unique ID;
- `confidentiality_code` is the document confidentiality code, if known. The format is HL7v2 CE with the code
  system OID as the code (e.g.: `1051000195109^normal^2.16.840.1.113883.6.96`).

If the home community ID is known, another _ParticipantObjectDetail_ is required inside: 
`#!xml <ParticipantObjectDetail type="ihe:homeCommunityID" value="★home_community_id_b64"/>`.
The value must be base64-encoded.

## Requirements summary

<table>
<thead>
  <tr>
    <th></th>
    <th></th>
    <th colspan="3">ActiveParticipant</th>
    <th colspan="4">ParticipantObjectIdentification</th>
  </tr>
  <tr>
    <th>Transaction</th>
    <th>EventIdentification</th>
    <th>Source</th>
    <th>Destination</th>
    <th>XUA</th>
    <th>Query</th>
    <th>Patient</th>
    <th>Submission Set</th>
    <th>Document</th>
  </tr>
</thead>
<tbody>
  <tr><td>ITI-18</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td></tr>
  <tr><td>ITI-41</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>✅</td><td>✅</td><td>❌</td></tr>
  <tr><td>ITI-43</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>✅</td><td>❌</td><td>✅</td></tr>
  <tr><td>ITI-44</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td><td>✅</td><td>❌</td><td>❌</td></tr>
  <tr><td>ITI-45</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td></tr>
  <tr><td>ITI-47</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>✅</td><td>✅</td><td>❌</td><td>❌</td></tr>
  <tr><td>ITI-57</td><td>✅</td><td>✅</td><td>✅</td><td>✅</td><td>❌</td><td>✅</td><td>✅</td><td>❌</td></tr>
</tbody>
</table>

## Sending an audit log

The audit log shall be sent to the community as a syslog message either over TCP (with TLS).
The relevant specifications are:

- [RFC 5424](https://tools.ietf.org/html/rfc5424): _The Syslog Protocol_ for information about the syslog message format;
- [RFC 5425](https://tools.ietf.org/html/rfc5425): _Transport Layer Security (TLS) Transport Mapping for Syslog_ 
  which formalizes sending Syslog messages over TCP;

The choice of values in the Syslog headers is left to the implementers.

An example of a Syslog message sent over TCP is:
```
2027 <85>1 2024-06-25T13:47:57.600Z mag-cara-695f6f7f49-zsxxw IPF 1 IHE+RFC-3881 - ﻿<?xml version="1.0" encoding="UTF-8"?><AuditMessage><EventIdentification EventActionCode="E" EventDateTime="2024-06-25T13:47:57.598829760Z" EventOutcomeIndicator="12"><EventID csd-code="110112" codeSystemName="DCM" originalText="Query" /><EventTypeCode csd-code="ITI-67" codeSystemName="IHE Transactions" originalText="Mobile Document Reference Query" /></EventIdentification><ActiveParticipant UserID="/mag-cara/fhir/DocumentReference" UserIsRequestor="true" NetworkAccessPointID="147.87.210.77" NetworkAccessPointTypeCode="2"><RoleIDCode csd-code="110153" codeSystemName="DCM" originalText="Source Role ID" /></ActiveParticipant><ActiveParticipant UserID="https://test.ahdis.ch/mag-cara/fhir/DocumentReference" AlternativeUserID="1" UserIsRequestor="false" NetworkAccessPointID="10.28.2.28" NetworkAccessPointTypeCode="2"><RoleIDCode csd-code="110152" codeSystemName="DCM" originalText="Destination Role ID" /></ActiveParticipant><AuditSourceIdentification AuditEnterpriseSiteID="1.3.6.1.4.1.21367.2017.2.7.109" AuditSourceID="IPF"><AuditSourceTypeCode csd-code="9" codeSystemName="DCM" originalText="Other" /></AuditSourceIdentification><ParticipantObjectIdentification ParticipantObjectID="urn:oid:1.1.1.99.1|215503a0-11d2-4197-822a-053791ab5a8e" ParticipantObjectTypeCode="1" ParticipantObjectTypeCodeRole="1"><ParticipantObjectIDTypeCode csd-code="2" codeSystemName="RFC-3881" originalText="Patient Number" /></ParticipantObjectIdentification><ParticipantObjectIdentification ParticipantObjectID="MobileDocumentReferenceQuery" ParticipantObjectTypeCode="2" ParticipantObjectTypeCodeRole="24"><ParticipantObjectIDTypeCode csd-code="ITI-67" codeSystemName="IHE Transactions" originalText="Mobile Document Reference Query" /><ParticipantObjectQuery>c3RhdHVzPWN1cnJlbnQmcGF0aWVudC5pZGVudGlmaWVyPXVybjpvaWQ6MS4xLjEuOTkuMXwyMTU1MDNhMC0xMWQyLTQxOTctODIyYS0wNTM3OTFhYjVhOGU=</ParticipantObjectQuery></ParticipantObjectIdentification></AuditMessage>
```

!!! info "Note"
    Notice the UTF-8 BOM at the beginning of the payload (just before `<?xml`). It is required by the syslog protocol
    for UTF-8 messages. 2027 is the number of bytes in the following message (2025 characters + 2 extra bytes for 
    the BOM).