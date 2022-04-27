# Immunization Administration Sections

A Immunization Administration document contains a compositions with different possible sections inside.
In minimum **one** section (optionality: C) next to the optional sections (optionality: O) has to be defined.


## Possible Sections
The following sections can be defined:

|              Name         |       id                |System          |Code   |Display                                            |Optionality|
|---------------------------|-------------------------|----------------|-------|---------------------------------------------------|-----------|
|Immunization Administration|administration           |http://loinc.org|11369-6|Hx of Immunization                                 |C|
|Medical Problems           |medicalproblems          |http://loinc.org|11450-4|Problem list Reported                              |C|
|Past Illnesses             |pastillnesses            |http://loinc.org|11348-0|Hx of Past illness                                 |C|
|Allergies and Intolerences |allergyintolerances      |http://loinc.org|48765-2|Allergies and adverse reactions Document           |C|
|Other Relevant Observatons |otherrelevantobservations|http://loinc.org|30954-2|Relevant diagnostic tests/laboratory data Narrative|C|
|Laboratory-Serology        |laboratory-serology      |http://loinc.org|18727-8|Serology studies (set)                             |C|
|Pregnancy                  |pregnancy                |http://loinc.org|10162-6|Pregnancies Hx                                     |C|
|Annotation                 |annotation               |http://loinc.org|48767-8|Annotation comment Imp                             |O|
|Original representation    |originalRepresentation   |http://loinc.org|55108-5|Clinical presentation                              |O|


### Immunization Administration
* *title:* 'Liste der verabreichten Impfungen' in german or 'Liste Vaccin administré' in french or 'Lista Vaccinazione somministrata' in italian or 'List Immunization Administration' in english or titles in other languages are also allowed
* *reference:* 

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
       ],
     },
     "text": {},
     "entry" : [
       {
         "reference" : "Immunization/<id>"
       }
     ]
  }
```

### Medical Problems
* *title:* 'Liste der Medizinischen Problemen' in german or 'Liste Vaccin administré' in french or 'Lista Vaccinazione somministrata' in italian or 'List Immunization Administration' in english or titles in other languages are also allowed
* *reference:* 


```json
  "section" : [
    {
      "id" : "medicalproblems",
      "title" : "Liste der Medizinischen Problemen",
      "code" : {
        "coding" : [
          {
            "system" : "http://loinc.org",
            "code" : "11450-4",
            "display" : "Problem list Reported"
          }
       ],
     },
     "text": {},
     "entry" : [
       {
         "reference" : "Condition/<id>"
       }
     ]
  }
```


### Past Illnesses

* *titel:* 'Bisherige Krankheiten' in german or 'Maladies antérieures' in french or 'Malattie precedenti' in italian or 'Previous illnesses' in english or titles in other languages are also allowed                                                                                                                                                                                            
* *reference:* A list of Condition resources declaring past illnesses the patient is recovered from - see [CH VACD Past Illness Profile](http://build.fhir.org/ig/hl7ch/ch-vacd/StructureDefinition-ch-vacd-pastillnesses.html)

```json
  "section" : [
    {
      "id" : "pastillnesses",
      "title" : "Bisherige Krankheiten",
      "code" : {
        "coding" : [
          {
            "system" : "http://loinc.org",
            "code" : "11348-0",
            "display" : "Hx of Past illness"
          }
       ],
     },
     "text": {},
     "entry" : [
       {
         "reference" : "Condition/<id>"
       }
     ]
  }
```

### Allergies and Intolerences
* *title:* 'Allergien' in german or 'Les allergies' in french or 'Allergie' in italian or 'Allergies' in english or titles in other languages are also allowed                                                                                                                                                                                                                                                                  
* *reference:* A list of AllergyIntolerance resources defining the allergies and intolerances - see [CH VACD AllergyIntolerance Profile](http://build.fhir.org/ig/hl7ch/ch-vacd/StructureDefinition-ch-vacd-allergyintolerances.html)

```json
  "section" : [
    {
      "id" : "allergyintolerances",
      "title" : "Allergies",
      "code" : {
        "coding" : [
          {
            "system" : "http://loinc.org",
            "code" : "48765-2",
            "display" : "Allergies and adverse reactions Document"
          }
       ],
     },
     "text": {},
     "entry" : [
       {
         "reference" : "AllergyIntolerance/<id>"
       }
     ]
  }
```

### Other Relevant Observatons
* *title:* 'Weiter relevante Beobachtungen' in german or 'Autres observations pertinentes' in french or 'Altre osservazioni rilevanti' in italian or 'Other Relevant Observations' in english or titles in other languages are also allowed
* *reference:* The Condition resource defining the gestational age - see [CH VACD Other Relevant Observations](http://build.fhir.org/ig/hl7ch/ch-vacd/StructureDefinition-ch-vacd-other-observations.html)
                                                                                                                                                                                     
```json
  "section" : [
    {
      "id" : "otherrelevantobservations",
      "title" : "Altre osservazioni rilevant",
      "code" : {
        "coding" : [
          {
            "system" : "http://loinc.org",
            "code" : "30954-2",
            "display" : "Relevant diagnostic tests/laboratory data Narrative"
          }
       ],
     },
     "text": {},
     "entry" : [
       {
         "reference" : "Condition/<id>"
       }
     ]
  }
```

### Laboratory-Serology
* *title:* 'Laborbefund - Serologie' in german or 'Résultats de laboratoire - Sérologie' in french or 'Risultati di laboratorio - Sierologia' in italian or 'Laboratory findings - Serology' in english or titles in other languages are also allowed
* *reference:* A list of Condition resources defining the lab results - see [CH VACD Laboratory And Serology Profile](http://build.fhir.org/ig/hl7ch/ch-vacd/StructureDefinition-ch-vacd-laboratory-serology.html)

```json
  "section" : [
    {
      "id" : "laboratory-serology",
      "title" : "Résultats de laboratoire - Sérologie",
      "code" : {
        "coding" : [
          {
            "system" : "http://loinc.org",
            "code" : "18727-8",
            "display" : "Serology studies (set)"
          }
       ],
     },
     "text": {},
     "entry" : [
       {
         "reference" : "Condition/<id>"
       }
     ]
  }
```

### Pregnancy
* *title:* 'Schwangerschaft' in german or 'Grossesse' in french or 'Gravidanza' in italian or 'Pregnancy' in english or titles in other languages are also allowed
* *reference:* the Condition resource for pregnancy - see [CH VACD Pregnancy Profile](http://build.fhir.org/ig/hl7ch/ch-vacd/StructureDefinition-ch-vacd-pregnancy.html)

```json
  "section" : [
    {
      "id" : "pregnancy",
      "title" : "Gravidanza",
      "code" : {
        "coding" : [
          {
            "system" : "http://loinc.org",
            "code" : "10162-6",
            "display" : "Pregnancies Hx"
          }
       ],
     },
     "text": {},
     "entry" : [
       {
         "reference" : "Condition/<id>"
       }
     ]
  }
```

### Annotation
* *title:* 'Kommentar' in german or 'Commentaire' in french or 'Osservazione' in italian or 'Comment' in english or titles in other languages are also allowed
* *text:* The annotation comment can be added here as narrative.

```json
  "section" : [
    {
      "id" : "annotation",
      "title" : "Commentaire",
      "code" : {
        "coding" : [
          {
            "system" : "http://loinc.org",
            "code" : "48767-8",
            "display" : "Annotation comment Imp"
          }
       ],
     },
     "text": {}
  }
```

### Original representation
* *title:* Original representation
* *reference:* Binary resource containing the original representation of the content as PDF.

```json
  "section" : [
    {
      "id" : "originalRepresentation",
      "title" : "Original representation",
      "code" : {
        "coding" : [
          {
            "system" : "http://loinc.org",
            "code" : "55108-5",
            "display" : "Clinical presentation"
          }
       ],
     },
     "text": {},
     "entry" : [
       {
         "reference" : "Binary/<id>"
       }
     ]
  }
```


