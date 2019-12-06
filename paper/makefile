all: CSpace.pdf

CSpace.pdf: CSpace.dvi
	dvipdfm CSpace.dvi

CSpace.dvi: CSpace.bbl CSpace.aux CSpace.tex
	latex CSpace
	latex CSpace

CSpace.bbl: CSpace.aux
	bibtex CSpace

CSpace.aux: CSpace.tex
	latex CSpace

clean:
	rm -f CSpace.aux CSpace.bbl CSpace.blg CSpace.log CSpace.dvi
