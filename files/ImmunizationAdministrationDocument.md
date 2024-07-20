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
* *entry:* The list to add all resources belonging to the document (line 15-17).

```json
{
  "resourceType" : "Bundle",
  "id" : "A-D2-HCP1-C1",
  "meta" : {
    "profile" : [
      "http://fhir.ch/ig/ch-vacd/StructureDefinition/ch-vacd-document-immunization-administration"
    ]
  },
  "identifier" : {
    "system" : "urn:ietf:rfc:3986",
    "value" : "urn:uuid:bef441e1-58b1-48e3-aa51-61237a3c20cd"
  },
  "type" : "document",
  "timestamp" : "2021-06-15T00:00:00.390+02:00",
  "entry" : [
    ....
  ]
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
"entry" : [
    {
      "fullUrl" : "http://test.fhir.ch/r4/Composition/A-D2-HCP1-C1-Composition",
      "resource" : {
        "resourceType" : "Composition",
        "id" : "A-D2-HCP1-C1-Composition",
        "meta" : {
          "profile" : [
            "http://fhir.ch/ig/ch-vacd/StructureDefinition/ch-vacd-composition-immunization-administration"
          ]
        },
        "language" : "en-US",
        "text" : {
          "status" : "generated",
          "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en-US\" lang=\"en-US\"><h3>Immunization Administration</h3><p><b>Id: </b>A-D2-HCP1-C1-Composition</p><p><b>Identifier: </b><span>urn:ietf:rfc:3986#urn:uuid:ab0add6e-0049-4567-8609-8d3ffdd84af0</span></p><p><b>Status: </b>Final</p><p><b>Code: </b><span>Immunization record (http://snomed.info/sct#41000179103)</span></p><p><b>Patient: </b><a href=\"Patient-TC-patient.html\">Patient/TC-patient</a> Wegmueller Monika</p><p><b>Date: </b>June 15, 2021</p><p><b>Authors:</b></p><table><tr><td><p><a href=\"Practitioner-TC-HCP1-C1.html\">Practitioner/TC-HCP1-C1</a> Bereit Allzeit</p><p><a href=\"Organization-TC-ORG1.html\">Organization/TC-ORG1</a> Gruppenpraxis CH</p></td></tr></table><p><b>Confidentiality: </b>null<span> Normal (qualifier value) (http://snomed.info/sct#17621005)</span></p><p><b>Sections:</b></p><table><tr><td>Immunization Administration</td></tr></table></div>"
        },
        "extension" : [
          {
            "id" : "versionNumber",
            "url" : "http://fhir.ch/ig/ch-core/StructureDefinition/ch-ext-epr-versionnumber",
            "valueUnsignedInt" : 1
          }
        ],
        "identifier" : {
         "system" : "urn:ietf:rfc:3986",
         "value" : "urn:uuid:ab0add6e-0049-4567-8609-8d3ffdd84af0"
        },
        "status" : "final",
        "type" : {
         "coding" : [
           {
             "system" : "http://snomed.info/sct",
             "code" : "41000179103",
             "display" : "Immunization record"
           }
         ]
       },
```

* *subject:* Who the composition is about. Its a reference to the resource contained as entry in the bundle (line 38 to 40).
* *date:* The date of the composition creation (line 41).
* *author:* Identifies who is responsible for the information in the composition (line 42 to 46).
* *title:* The title of the document. Fixed Value. (line 47).

```json
       "subject" : {
          "reference" : "Patient/TC-patient"
        },
        "date" : "2021-06-15T00:00:00+02:00",
        "author" : [
          {
            "reference" : "PractitionerRole/TC-HCP1-ORG1-ROLE-author"
          }
        ],
       "title" : "Immunization Administration",
```

* *confidentiality:* Level of confidentiality of the Composition - binding: *[v3.ConfidentialityClassification (2014-03-26)](http://hl7.org/fhir/R4/v3/ConfidentialityClassification/vs.html)* and an extension *[EPR Confidentiality Code](http://fhir.ch/ig/ch-core/StructureDefinition-ch-ext-epr-confidentialitycode.html)* with binding to *[DocumentEntry.confidentialityCode](http://fhir.ch/ig/ch-epr-term/ValueSet-DocumentEntry.confidentialityCode.html)* (line 48 to 64).
* *custodian:* Organization who is responsible for the document and access.

```json
       "confidentiality" : "N",
        "_confidentiality" : {
          "extension" : [
            {
              "url" : "http://fhir.ch/ig/ch-core/StructureDefinition/ch-ext-epr-confidentialitycode",
               "valueCodeableConcept" : {
                "coding" : [
                  {
                    "system" : "http://snomed.info/sct",
                    "code" : "17621005",
                    "display" : "Normal (qualifier value)"
                  }
                ]
              }
            }
         ]
       },
       "custodian" : {
         "reference" : "Organization/TC-ORG1"
       },
```

* *section:* The root of the sections that make up the composition. There can be multiple sections (in minimum one of these sections has to be declared and an entry has to be defined) - See [Immunization Administration Sections](ImmunizationAdministrationSections.md):


```json
       "section" : [
          {
            "id" : "administration",
            "title" : "Immunization Administration",
            "code" : {
              "coding" : [
                {
                  "system" : "http://loinc.org",
                  "code" : "11369-6",
                  "display" : "Hx of Immunization"
                }
              ]
            },
            "text" : {
              "status" : "generated",
              "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\" xml:lang=\"en-US\" lang=\"en-US\"><p><b>Code: </b><span>Hx of Immunization (http://loinc.org#11369-6)</span></p><p><b>Entries:</b></p><table><tr><td><a href=\"Immunization-TCA01-IMMUN2-HCP1-ORG1-ROLE.html\">Immunization/TCA01-IMMUN2-HCP1-ORG1-ROLE</a></td></tr></table></div>"
            },
            "entry" : [
              {
                "reference" : "Immunization/TCA01-IMMUN2-HCP1-ORG1-ROLE"
              }
            ]
          }
        ]
```

## Information about the patient

In the "Patient" resource, the demographic and administrative data of a patient are specified.

[Profile information](http://fhir.ch/ig/ch-core/StructureDefinition-ch-core-patient-epr.html)

```json
 {
      "fullUrl" : "http://test.fhir.ch/r4/Patient/TC-patient",
      "resource" : {
        "resourceType" : "Patient",
        "id" : "TC-patient",
        "meta" : {
          "profile" : [
            "http://fhir.ch/ig/ch-core/StructureDefinition/ch-core-patient-epr"
          ]
        },
        "text" : {
          "status" : "generated",
          "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource \"TC-patient\" </p><p style=\"margin-bottom: 0px\">Profile: <a href=\"http://fhir.ch/ig/ch-core/StructureDefinition-ch-core-patient-epr.html\">CH Core Patient Profile EPR</a></p></div><p><b>identifier</b>: id: 123.71.332.115, id: 8077560000000000000000</p><p><b>name</b>: Monika Wegmueller </p><p><b>telecom</b>: ph: tel:+41.32.685.12.34(HOME)</p><p><b>gender</b>: female</p><p><b>birthDate</b>: 1967-02-10</p><p><b>address</b>: Leidensweg 10 Specimendorf 9876 CH </p></div>"
        },
        "identifier" : [
          {
           "system" : "urn:oid:2.16.756.5.31",
           "value" : "123.71.332.115"
         },
         {
           "system" : "urn:oid:2.16.756.5.30.1.123.100.1.1.1",
           "value" : "8077560000000000000000"
         }
       ],
       "name" : [
         {
            "family" : "Wegmueller",
            "given" : [
              "Monika"
            ]
          }
        ],
        "telecom" : [
          {
            "system" : "phone",
            "value" : "tel:+41.32.685.12.34",
            "use" : "home"
          }
        ],
        "gender" : "female",
        "birthDate" : "1967-02-10",
        "address" : [
          {
            "type" : "both",
            "line" : [
              "Leidensweg 10"
            ],
            "city" : "Specimendorf",
            "postalCode" : "9876",
            "country" : "CH"
          }
        ]
      }
    },
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
 {
   "fullUrl" : "http://test.fhir.ch/r4/Immunization/TCA01-IMMUN2-HCP1-ORG1-ROLE",
   "resource" : {
     "resourceType" : "Immunization",
     "id" : "TCA01-IMMUN2-HCP1-ORG1-ROLE",
     "meta" : {
       "profile" : [
         "http://fhir.ch/ig/ch-vacd/StructureDefinition/ch-vacd-immunization"
       ]
     },
     "text" : {
       "status" : "extensions",
       "div" : "<div xmlns=\"http://www.w3.org/1999/xhtml\"><p><b>Generated Narrative</b></p><div style=\"display: inline-block; background-color: #d9e0e7; padding: 6px; margin: 4px; border: 1px solid #8da1b4; border-radius: 5px; line-height: 60%\"><p style=\"margin-bottom: 0px\">Resource \"TCA01-IMMUN2-HCP1-ORG1-ROLE\" </p><p style=\"margin-bottom: 0px\">Profile: <a href=\"StructureDefinition-ch-vacd-immunization.html\">CH VACD Immunization Profile</a></p></div><p><b>CH VACD Extension Immunization Recorder Reference</b>: <a href=\"#PractitionerRole_TC-HCP1-ORG1-ROLE-author\">See above (PractitionerRole/TC-HCP1-ORG1-ROLE-author)</a></p><p><b>identifier</b>: id: 11853642-8ff4-45ae-af98-44c58b3bf0b7</p><p><b>status</b>: completed</p><p><b>vaccineCode</b>: Boostrix <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"CodeSystem-ch-vacd-swissmedic-cs.html\">Swiss Medic Authorized Vaccines Codesystem</a>#637)</span></p><p><b>patient</b>: <a href=\"#Patient_TC-patient\">See above (Patient/TC-patient)</a></p><p><b>occurrence</b>: 2021-06-15</p><p><b>recorded</b>: 2021-06-15T00:00:00.39+02:00</p><p><b>lotNumber</b>: 14-34218</p><p><b>route</b>: Intramuscular use <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (standardterms.edqm.eu#20035000)</span></p><h3>Performers</h3><table class=\"grid\"><tr><td>-</td><td><b>Actor</b></td></tr><tr><td>*</td><td><a href=\"#PractitionerRole_TC-HCP1-ORG1-ROLE-performer\">See above (PractitionerRole/TC-HCP1-ORG1-ROLE-performer)</a></td></tr></table><h3>ProtocolApplieds</h3><table class=\"grid\"><tr><td>-</td><td><b>TargetDisease</b></td><td><b>DoseNumber[x]</b></td></tr><tr><td>*</td><td>Diphtheria caused by Corynebacterium diphtheriae (disorder) <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"https://browser.ihtsdotools.org/\">SNOMED CT</a>#397430003)</span>, Tetanus (disorder) <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"https://browser.ihtsdotools.org/\">SNOMED CT</a>#76902006)</span>, Pertussis (disorder) <span style=\"background: LightGoldenRodYellow; margin: 4px; border: 1px solid khaki\"> (<a href=\"https://browser.ihtsdotools.org/\">SNOMED CT</a>#27836007)</span></td><td>1</td></tr></table></div>"
     },
     "extension" : [
       {
         "url" : "http://fhir.ch/ig/ch-vacd/StructureDefinition/ch-vacd-ext-immunization-recorder-reference",
         "valueReference" : {
           "reference" : "PractitionerRole/TC-HCP1-ORG1-ROLE-author"
         }
       }
     ],
     "identifier" : [
       {
         "system" : "urn:oid:2.16.756.5.30.1.402.1.3.1.1.1",
         "value" : "11853642-8ff4-45ae-af98-44c58b3bf0b7"
       }
     ],
     "status" : "completed",
     "vaccineCode" : {
       "coding" : [
         {
           "system" : "http://fhir.ch/ig/ch-vacd/CodeSystem/ch-vacd-swissmedic-cs",
           "code" : "637",
           "display" : "Boostrix"
         }
       ]
     },
     "patient" : {
       "reference" : "Patient/TC-patient"
     },
     "occurrenceDateTime" : "2021-06-15",
     "recorded" : "2021-06-15T00:00:00.390+02:00",
     "lotNumber" : "14-34218",
     "route" : {
       "coding" : [
         {
           "system" : "http://standardterms.edqm.eu",
           "code" : "20035000",
           "display" : "Intramuscular use"
         }
       ]
     },
     "performer" : [
       {
         "actor" : {
           "reference" : "PractitionerRole/TC-HCP1-ORG1-ROLE-performer"
         }
       }
     ],
     "protocolApplied" : [
       {
         "targetDisease" : [
           {
             "coding" : [
               {
                 "system" : "http://snomed.info/sct",
                 "code" : "397430003",
                 "display" : "Diphtheria caused by Corynebacterium diphtheriae (disorder)"
               }
             ]
           },
           {
             "coding" : [
               {
                 "system" : "http://snomed.info/sct",
                 "code" : "76902006",
                 "display" : "Tetanus (disorder)"
               }
             ]
           },
           {
             "coding" : [
               {
                 "system" : "http://snomed.info/sct",
                 "code" : "27836007",
                 "display" : "Pertussis (disorder)"
               }
             ]
           }
         ],
         "doseNumberPositiveInt" : 1
       }
     ]
   }
 }
```
