# EPD by example

This repository contains the project EPD by example.
The documentation is published on [https://ehealthsuisse.github.io/EPD-by-example](https://ehealthsuisse.github.io/EPD-by-example),
the repository contains the markdown sources and examples of transactions.

## Automatic publication

The workflow described in `.github/workflows/publish_doc.yml` ensures that the documentation is build and published 
in GitHub Pages each time a commit is pushed to the `main` branch.

## Manual 

The documentation can be locally built and previewed with the following commands:

```bash
pip install -r requirements.txt
# To preview the documentation on http://127.0.0.1:8000/EPD-by-example/:
mkdocs serve
# To build the documentation:
mkdocs build
```
