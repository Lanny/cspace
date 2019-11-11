import json

from rdkit.Chem.rdmolfiles import MolToSmiles

from cspace.models import *
from cspace.utils.MethodSplitView import MethodSplitView

def get_mol_props_dict(mol):
    return dict(((n, mol.GetProp(n)) for n in mol.GetPropNames()))

def load_mol(mol, tag):
    smiles = MolToSmiles(mol)

    if Chemical.objects.filter(smiles=smiles).count():
        chem = Chemical.objects.get(smiles=smiles)
        chem.tags.add(tag)

        return -1
    print(json.dumps(get_mol_props_dict(mol)))
    props = get_mol_props_dict(mol)
    chem = Chemical(
        smiles=smiles,
        chem_name=props.get('PUBCHEM_IUPAC_NAME', 'MISSING_NAME'),
        pubchem_compound_cid=props.get('PUBCHEM_COMPOUND_CID', 'MISSING_ID'),
        props_json=json.dumps(props)
    )

    chem.save()
    chem.tags.add(tag)
    return 1


__all__ = [
    'MethodSplitView',
    'load_mol',
    'get_mol_props_dict',
]
