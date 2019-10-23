#!/usr/bin/env python3

from rdkit import Chem
from rdkit.Chem.Draw import rdMolDraw2D

def draw_molecule(mol,molSize=(450,150),kekulize=True):
    mc = Chem.Mol(mol.ToBinary())
    if kekulize:
        try:
            Chem.Kekulize(mc)
        except:
            mc = Chem.Mol(mol.ToBinary())
    if not mc.GetNumConformers():
        Chem.rdDepictor.Compute2DCoords(mc)

    drawer = rdMolDraw2D.MolDraw2DSVG(molSize[0],molSize[1])
    drawer.DrawMolecule(mc)
    drawer.FinishDrawing()
    svg = drawer.GetDrawingText()
    return svg.replace('svg:','')

if __name__ == '__main__':
    m = Chem.MolFromSmiles('N[C@@H](C)C(=O)O')
    print(draw_molecule(m))
