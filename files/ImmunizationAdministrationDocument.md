# Immunization Administration Document

In a primary system, different vaccinations are documented in a treatment context.
Primary systems can use this Exchange Format to generate a Immunization Administration document.

## Bundle
[Profile information](http://build.fhir.org/ig/hl7ch/ch-vacd/StructureDefinition-ch-vacd-document-immunization-administration.html)

In the resource "Bundle", all resources are collected in a container.

* *id:* Local id of the resource (line 3)
* *meta:* Shows the metadata of the document (line 4 to 8).
* *identifier:* Unique identifier for the bundle - fixed Value: "*urn:ietf:rfc:3986*" (line 9 to 12).
* *type:* Indicates the purpose of this bundle - fixed Value: "*document*"; binding: *[BundleType](http://hl7.org/fhir/R4/valueset-bundle-type.html)* (line 13).
* *timestamp:* The date/time the bundle was composed (line 14).
* *entry:" The list to add all resources belonging to the document (line 15-17).
```
 1 {
 2   "resourceType" : "Bundle",
 3   "id" : "A-D2-HCP1-C1",
 4   "meta" : {
 5     "profile" : [
 6       "http://fhir.ch/ig/ch-vacd/StructureDefinition/ch-vacd-document-immunization-administration"
 7     ]
 8   },
 9   "identifier" : {
10     "system" : "urn:ietf:rfc:3986",
11     "value" : "urn:uuid:bef441e1-58b1-48e3-aa51-61237a3c20cd"
12   },
13   "type" : "document",
14   "timestamp" : "2021-06-15T00:00:00.390+02:00",
15   "entry" : [
16     ....
17   ]
   }
```

## Composition
[Profile information](http://build.fhir.org/ig/hl7ch/ch-vacd/StructureDefinition-ch-vacd-composition-immunization-administration.html)

In the resource "Composition", general information about the document is specified. It should be the first entry in the list.

* *entry:* An entry in a bundle resource - will either contain a resource or information about a resource (line 1)
* *id:* Local id of the resource (line 6).
* *meta:* Shows the metadata of the composition (line 7 to 11).
* *language:* Specifies the language of the document - binding: *[CommonLanguages](http://hl7.org/fhir/R4/valueset-languages.html)* (line 12).
* *text:* Presents the narrative text of the resource (line 13 to 16).
* *extension:* Extension to version number (line 17 to 23).
* *identifier:* A version-independent identifier for the Composition with a fixed system value "urn:ietf:rfc:3986" (line 24 to 27).
* *status:* The status of the document - fixed Value: "*final*"; binding: *[CompositionStatus](http://hl7.org/fhir/R4/valueset-composition-status.html)* (line 28).
* *type:* Specifies the particular kind of composition. Fixed coding value  (line 29 to 37).

```json
 1 "entry" : [
 2     {
 3       "fullUrl" : "http://test.fhir.ch/r4/Composition/A-D2-HCP1-C1-Composition",
 4       "resource" : {
 5         "resourceType" : "Composition",
 6         "id" : "A-D2-HCP1-C1-Composition",
 7         "meta" : {
 8           "profile" : [
 9             "http://fhir.ch/ig/ch-vacd/StructureDefinition/ch-vacd-composition-immunization-administration"
10           ]
11         },
12         "language" : "en-US",
13         "text" : {
14           "status" : "generated",
15           "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en-US\" lang=\"en-US\"><h3>Immunization Administration</h3><p><b>Id: </b>A-D2-HCP1-C1-Composition</p><p><b>Identifier: </b><span>urn:ietf:rfc:3986#urn:uuid:ab0add6e-0049-4567-8609-8d3ffdd84af0</span></p><p><b>Status: </b>Final</p><p><b>Code: </b><span>Immunization record (http://snomed.info/sct#41000179103)</span></p><p><b>Patient: </b><a href=\"Patient-TC-patient.html\">Patient/TC-patient</a> Wegmueller Monika</p><p><b>Date: </b>June 15, 2021</p><p><b>Authors:</b></p><table><tr><td><p><a href=\"Practitioner-TC-HCP1-C1.html\">Practitioner/TC-HCP1-C1</a> Bereit Allzeit</p><p><a href=\"Organization-TC-ORG1.html\">Organization/TC-ORG1</a> Gruppenpraxis CH</p></td></tr></table><p><b>Confidentiality: </b>null<span> Normal (qualifier value) (http://snomed.info/sct#17621005)</span></p><p><b>Sections:</b></p><table><tr><td>Immunization Administration</td></tr></table></div>"
16         },
17         "extension" : [
18           {
19             "id" : "versionNumber",
20             "url" : "http://fhir.ch/ig/ch-core/StructureDefinition/ch-ext-epr-versionnumber",
21             "valueUnsignedInt" : 1
22           }
23         ],
24         "identifier" : {
25          "system" : "urn:ietf:rfc:3986",
26          "value" : "urn:uuid:ab0add6e-0049-4567-8609-8d3ffdd84af0"
27         },
28         "status" : "final",
29         "type" : {
30          "coding" : [
31            {
32              "system" : "http://snomed.info/sct",
33              "code" : "41000179103",
34              "display" : "Immunization record"
35            }
36          ]
37        },
```

* *subject:* Who the composition is about. Its a reference to the resource contained as entry in the bundle (line 38 to 40).
* *date:* The date of the composition creation (line 41).
* *author:* Identifies who is responsible for the information in the composition (line 42 to 46).
* *title:* The title of the document. Fixed Value. (line 47).
```json
38        "subject" : {
39           "reference" : "Patient/TC-patient"
40         },
41         "date" : "2021-06-15T00:00:00+02:00",
42         "author" : [
43           {
44             "reference" : "PractitionerRole/TC-HCP1-ORG1-ROLE-author"
45           }
46         ],
47        "title" : "Immunization Administration",
```

* *confidentiality:* Level of confidentiality of the Composition - binding: *[v3.ConfidentialityClassification (2014-03-26)](http://hl7.org/fhir/R4/v3/ConfidentialityClassification/vs.html)* and an extension *[EPR Confidentiality Code](http://fhir.ch/ig/ch-core/StructureDefinition-ch-ext-epr-confidentialitycode.html)* with binding to *[DocumentEntry.confidentialityCode](http://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.confidentialityCode.html)* (line 48 to 64).
* *custodian:* Organization who is responsible for the document and access.
```json
48        "confidentiality" : "N",
49         "_confidentiality" : {
50           "extension" : [
51             {
52               "url" : "http://fhir.ch/ig/ch-core/StructureDefinition/ch-ext-epr-confidentialitycode",
53                "valueCodeableConcept" : {
54                 "coding" : [
55                   {
56                     "system" : "http://snomed.info/sct",
57                     "code" : "17621005",
58                     "display" : "Normal (qualifier value)"
59                   }
60                 ]
61               }
62             }
63          ]
64        },
65        "custodian" : {
66          "reference" : "Organization/TC-ORG1"
67        },
```

* *section:* The root of the sections that make up the composition. There can be multiple sections (in minimum one of these sections has to be declared and an entry has to be defined) - See [Immunization Administration Sections](ImmunizationAdministrationSections.md):


```json
68        "section" : [
69           {
70             "id" : "administration",
71             "title" : "Immunization Administration",
72             "code" : {
73               "coding" : [
74                 {
75                   "system" : "http://loinc.org",
76                   "code" : "11369-6",
77                   "display" : "Hx of Immunization"
78                 }
79               ]
80             },
81             "text" : {
82               "status" : "generated",
83               "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en-US\" lang=\"en-US\"><p><b>Code: </b><span>Hx of Immunization (http://loinc.org#11369-6)</span></p><p><b>Entries:</b></p><table><tr><td><a href=\"Immunization-TCA01-IMMUN2-HCP1-ORG1-ROLE.html\">Immunization/TCA01-IMMUN2-HCP1-ORG1-ROLE</a></td></tr></table></div>"
84             },
85             "entry" : [
86               {
87                 "reference" : "Immunization/TCA01-IMMUN2-HCP1-ORG1-ROLE"
88               }
89             ]
90           }
91         ]
```

## Information about the patient

In the "Patient" resource, the demographic and administrative data of a patient are specified.

[Profile information](http://fhir.ch/ig/ch-core/StructureDefinition-ch-core-patient-epr.html)

```json
 94  {
 95       "fullUrl" : "http://test.fhir.ch/r4/Patient/TC-patient",
 96       "resource" : {
 97         "resourceType" : "Patient",
 98         "id" : "TC-patient",
 99         "meta" : {
100           "profile" : [
101             "http://fhir.ch/ig/ch-core/StructureDefinition/ch-core-patient-epr"
102           ]
103         },
104         "text" : {
105           "status" : "generated",
106           "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource \"TC-patient\" </p><p style=\"margin-bottom: 0px\">Profile: <a href=\"http://fhir.ch/ig/ch-core/StructureDefinition-ch-core-patient-epr.html\">CH Core Patient Profile EPR</a></p></div><p><b>identifier</b>: id: 123.71.332.115, id: 8077560000000000000000</p><p><b>name</b>: Monika Wegmueller </p><p><b>telecom</b>: ph: tel:+41.32.685.12.34(HOME)</p><p><b>gender</b>: female</p><p><b>birthDate</b>: 1967-02-10</p><p><b>address</b>: Leidensweg 10 Specimendorf 9876 CH </p></div>"
107         },
108         "identifier" : [
109           {
110            "system" : "urn:oid:2.16.756.5.31",
111            "value" : "123.71.332.115"
112          },
113          {
114            "system" : "urn:oid:2.16.756.5.30.1.123.100.1.1.1",
115            "value" : "8077560000000000000000"
116          }
117        ],
118        "name" : [
119          {
120             "family" : "Wegmueller",
121             "given" : [
122               "Monika"
123             ]
124           }
125         ],
126         "telecom" : [
127           {
128             "system" : "phone",
129             "value" : "tel:+41.32.685.12.34",
130             "use" : "home"
131           }
132         ],
133         "gender" : "female",
134         "birthDate" : "1967-02-10",
135         "address" : [
136           {
137             "type" : "both",
138             "line" : [
139               "Leidensweg 10"
140             ],
141             "city" : "Specimendorf",
142             "postalCode" : "9876",
143             "country" : "CH"
144           }
145         ]
146       }
147     },
```

## Information about the practitioner

The resource Practitioner indicates which practitioner has given a vaccination.

[Profile information](https://fhir.ch/ig/ch-core/StructureDefinition-ch-core-practitioner-epr.html)

```json
{
      "fullUrl" : "http://test.fhir.ch/r4/Practitioner/TC-HCP1-C1",
      "resource" : {
        "resourceType" : "Practitioner",
        "id" : "TC-HCP1-C1",
        "meta" : {
          "profile" : [
            "http://fhir.ch/ig/ch-core/StructureDefinition/ch-core-practitioner-epr"
          ]
        },
        "text" : {
          "status" : "generated",
          "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource \"TC-HCP1-C1\" </p><p style=\"margin-bottom: 0px\">Profile: <a href=\"http://fhir.ch/ig/ch-core/StructureDefinition-ch-core-practitioner-epr.html\">CH Core Practitioner Profile EPR</a></p></div><p><b>identifier</b>: id: 7608888888888</p><p><b>active</b>: true</p><p><b>name</b>: Allzeit Bereit </p><p><b>telecom</b>: ph: tel:+41.32.234.55.66(WORK), fax: fax:+41.32.234.55.67(WORK), <a href=\"mailto:mailto:allzeit.bereit@gruppenpraxis.ch\">mailto:allzeit.bereit@gruppenpraxis.ch</a>, <a href=\"http://www.gruppenpraxis.ch\">http://www.gruppenpraxis.ch</a></p><p><b>address</b>: Doktorgasse 2 Musterhausen 8888 CH </p></div>"
        },
        "identifier" : [
          {
            "system" : "urn:oid:2.51.1.3",
            "value" : "7608888888888"
          }
        ],
        "active" : true,
        "name" : [
          {
            "family" : "Bereit",
            "given" : [
              "Allzeit"
            ],
            "prefix" : [
              "Dr. med."
            ]
          }
        ],
        "telecom" : [
          {
            "system" : "phone",
            "value" : "tel:+41.32.234.55.66",
            "use" : "work"
          },
          {
            "system" : "fax",
            "value" : "fax:+41.32.234.55.67",
            "use" : "work"
          },
          {
            "system" : "email",
            "value" : "mailto:allzeit.bereit@gruppenpraxis.ch",
            "use" : "work"
          },
          {
            "system" : "url",
            "value" : "http://www.gruppenpraxis.ch",
            "use" : "work"
          }
        ],
        "address" : [
          {
            "type" : "physical",
            "line" : [
              "Doktorgasse 2"
            ],
            "city" : "Musterhausen",
            "postalCode" : "8888",
            "country" : "CH"
          }
        ]
      }
    },
```


## Information about the organization

The resource stores the information about the organization that creates the Immunization Administration Document

[Profile information](http://fhir.ch/ig/ch-core/StructureDefinition-ch-core-organization-epr.html)

```json
{
      "fullUrl" : "http://test.fhir.ch/r4/Organization/TC-ORG1",
      "resource" : {
        "resourceType" : "Organization",
        "id" : "TC-ORG1",
        "meta" : {
          "profile" : [
            "http://fhir.ch/ig/ch-core/StructureDefinition/ch-core-organization-epr"
          ]
        },
        "text" : {
          "status" : "generated",
          "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource \"TC-ORG1\" </p><p style=\"margin-bottom: 0px\">Profile: <a href=\"http://fhir.ch/ig/ch-core/StructureDefinition-ch-core-organization-epr.html\">CH Core Organization Profile EPR</a></p></div><p><b>identifier</b>: id: 7608888888888</p><p><b>name</b>: Gruppenpraxis CH</p><p><b>telecom</b>: ph: tel:+41.32.234.55.66(WORK), fax: fax:+41.32.234.55.67(WORK), <a href=\"mailto:mailto:bereit@gruppenpraxis.ch\">mailto:bereit@gruppenpraxis.ch</a>, <a href=\"http://www.gruppenpraxis.ch\">http://www.gruppenpraxis.ch</a></p><p><b>address</b>: Doktorgasse 2 Musterhausen ZH 8888 CH </p></div>"
        },
        "identifier" : [
          {
            "system" : "urn:oid:2.51.1.3",
            "value" : "7608888888888"
          }
        ],
        "name" : "Gruppenpraxis CH",
        "telecom" : [
          {
            "system" : "phone",
            "value" : "tel:+41.32.234.55.66",
            "use" : "work"
          },
          {
            "system" : "fax",
            "value" : "fax:+41.32.234.55.67",
            "use" : "work"
          },
          {
            "system" : "email",
            "value" : "mailto:bereit@gruppenpraxis.ch",
            "use" : "work"
          },
          {
            "system" : "url",
            "value" : "http://www.gruppenpraxis.ch",
            "use" : "work"
          }
        ],
        "address" : [
          {
            "line" : [
              "Doktorgasse 2"
            ],
            "city" : "Musterhausen",
            "state" : "ZH",
            "postalCode" : "8888",
            "country" : "CH"
          }
        ]
      }
    },
```




## Immunization
In the resource "Immunization" the data of the patientes vaccination is defined.

[Profile information](http://build.fhir.org/ig/hl7ch/ch-vacd/StructureDefinition-ch-vacd-immunization.html)

* *extension:* The extension defining the recorder (administering the immunization) of the immunization entry (line 15 to 22).
* *status:* The status of the immunization - binding: *[ImmunizationStatusCodes](http://hl7.org/fhir/R4/valueset-immunization-status.html)* (line 29)
* *vaccineCode:* The vaccine code defining the vaccine given to the patient - different bindings possible (lines 30 to 38): 
    * *[Swissmedic code for vaccine code](http://build.fhir.org/ig/hl7ch/ch-vacd/ValueSet-ch-vacd-vaccines-vs.html)*
    * *[Snomed CT for vaccine code](http://build.fhir.org/ig/hl7ch/ch-vacd/ValueSet-ch-vacd-vaccines-snomedct-vs.html)*
    * *[ATC for vaccine codes](http://build.fhir.org/ig/hl7ch/ch-vacd/ValueSet-ch-vacd-vaccines-atc-vs.html)*
    * *[Absent or Unknown Immunization - IPS](http://hl7.org/fhir/uv/ips/STU1/ValueSet-absent-or-unknown-immunizations-uv-ips.html)*
* *occurrenceDateTime:* The date the vaccination was done (line 42). 
* *recorded:* The date the vaccination was entered in the record (line 43).
* *lotNumber:* The lot number of the vaccination applied to the patient (line 44).
* *route:* The route of administration - binding: *[Route of Administration for Immunization](https://fhir.ch/ig/ch-vacd/ValueSet-ch-vacd-route-of-administration-vs.html)* (lines 45 - 53).
* *performer*
    * *actor:* The health care professional who applied the vaccination to the patient (lines 54 to 60).
* *protocolApplied*
    * *targetDisease:* The diseases the vaccination was given against. See mapping table [VaccineCode To TargetDisease Mapping](https://fhir.ch/ig/ch-vacd/ConceptMap-ch-vacd-vaccines-targetdiseases-cm.html) (lines 61 to 94).


```json
 1  {
 2    "fullUrl" : "http://test.fhir.ch/r4/Immunization/TCA01-IMMUN2-HCP1-ORG1-ROLE",
 3    "resource" : {
 4      "resourceType" : "Immunization",
 5      "id" : "TCA01-IMMUN2-HCP1-ORG1-ROLE",
 6      "meta" : {
 7        "profile" : [
 8          "http://fhir.ch/ig/ch-vacd/StructureDefinition/ch-vacd-immunization"
 9        ]
10      },
11      "text" : {
12        "status" : "extensions",
13        "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource \"TCA01-IMMUN2-HCP1-ORG1-ROLE\" </p><p style=\"margin-bottom: 0px\">Profile: <a href=\"StructureDefinition-ch-vacd-immunization.html\">CH VACD Immunization Profile</a></p></div><p><b>CH VACD Extension Immunization Recorder Reference</b>: <a href=\"#PractitionerRole_TC-HCP1-ORG1-ROLE-author\">See above (PractitionerRole/TC-HCP1-ORG1-ROLE-author)</a></p><p><b>identifier</b>: id: 11853642-8ff4-45ae-af98-44c58b3bf0b7</p><p><b>status</b>: completed</p><p><b>vaccineCode</b>: Boostrix <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"CodeSystem-ch-vacd-swissmedic-cs.html\">Swiss Medic Authorized Vaccines Codesystem</a>#637)</span></p><p><b>patient</b>: <a href=\"#Patient_TC-patient\">See above (Patient/TC-patient)</a></p><p><b>occurrence</b>: 2021-06-15</p><p><b>recorded</b>: 2021-06-15T00:00:00.39+02:00</p><p><b>lotNumber</b>: 14-34218</p><p><b>route</b>: Intramuscular use <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (standardterms.edqm.eu#20035000)</span></p><h3>Performers</h3><table class=\"grid\"><tr><td>-</td><td><b>Actor</b></td></tr><tr><td>*</td><td><a href=\"#PractitionerRole_TC-HCP1-ORG1-ROLE-performer\">See above (PractitionerRole/TC-HCP1-ORG1-ROLE-performer)</a></td></tr></table><h3>ProtocolApplieds</h3><table class=\"grid\"><tr><td>-</td><td><b>TargetDisease</b></td><td><b>DoseNumber[x]</b></td></tr><tr><td>*</td><td>Diphtheria caused by Corynebacterium diphtheriae (disorder) <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"https://browser.ihtsdotools.org/\">SNOMED CT</a>#397430003)</span>, Tetanus (disorder) <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"https://browser.ihtsdotools.org/\">SNOMED CT</a>#76902006)</span>, Pertussis (disorder) <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"https://browser.ihtsdotools.org/\">SNOMED CT</a>#27836007)</span></td><td>1</td></tr></table></div>"
14      },
15      "extension" : [
16        {
17          "url" : "http://fhir.ch/ig/ch-vacd/StructureDefinition/ch-vacd-ext-immunization-recorder-reference",
18          "valueReference" : {
19            "reference" : "PractitionerRole/TC-HCP1-ORG1-ROLE-author"
20          }
21        }
22      ],
23      "identifier" : [
24        {
25          "system" : "urn:oid:2.16.756.5.30.1.402.1.3.1.1.1",
26          "value" : "11853642-8ff4-45ae-af98-44c58b3bf0b7"
27        }
28      ],
29      "status" : "completed",
30      "vaccineCode" : {
31        "coding" : [
32          {
33            "system" : "http://fhir.ch/ig/ch-vacd/CodeSystem/ch-vacd-swissmedic-cs",
34            "code" : "637",
35            "display" : "Boostrix"
36          }
37        ]
38      },
39      "patient" : {
40        "reference" : "Patient/TC-patient"
41      },
42      "occurrenceDateTime" : "2021-06-15",
43      "recorded" : "2021-06-15T00:00:00.390+02:00",
44      "lotNumber" : "14-34218",
45      "route" : {
46        "coding" : [
47          {
48            "system" : "http://standardterms.edqm.eu",
49            "code" : "20035000",
50            "display" : "Intramuscular use"
51          }
52        ]
53      },
54      "performer" : [
55        {
56          "actor" : {
57            "reference" : "PractitionerRole/TC-HCP1-ORG1-ROLE-performer"
58          }
59        }
60      ],
61      "protocolApplied" : [
62        {
63          "targetDisease" : [
64            {
65              "coding" : [
66                {
67                  "system" : "http://snomed.info/sct",
68                  "code" : "397430003",
69                  "display" : "Diphtheria caused by Corynebacterium diphtheriae (disorder)"
70                }
71              ]
72            },
73            {
74              "coding" : [
75                {
76                  "system" : "http://snomed.info/sct",
77                  "code" : "76902006",
78                  "display" : "Tetanus (disorder)"
79                }
80              ]
81            },
82            {
83              "coding" : [
84                {
85                  "system" : "http://snomed.info/sct",
86                  "code" : "27836007",
87                  "display" : "Pertussis (disorder)"
88                }
89              ]
90            }
91          ],
92          "doseNumberPositiveInt" : 1
93        }
94      ]
95    }
96  }
```


