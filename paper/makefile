all: CSpace.pdf

CSpace.pdf: CSpace.bbl CSpace.aux CSpace.tex
	pdflatex CSpace
	pdflatex CSpace

CSpace.bbl: CSpace.aux
	bibtex CSpace

CSpace.aux: CSpace.tex
	pdflatex CSpace

clean:
	rm -f CSpace.aux CSpace.bbl CSpace.blg CSpace.log CSpace.pdf
