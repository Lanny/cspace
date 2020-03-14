from rdkit import Chem, DataStructs
from rdkit.Chem.Pharm2D import Gobbi_Pharm2D, Generate

from .MethodSplitView import MethodSplitView
from .load_mol import load_mol
from .memoize import memoize

def get_distance_func(name):
    if name == 'RDK/T':
        make_representation = (
            lambda chem: Chem.RDKFingerprint(chem.mol)
        )
        distf = lambda x, y: 1.0 - DataStructs.FingerprintSimilarity(x, y)

        return (make_representation, distf)
    elif name == 'GOBI/T':
        make_representation = lambda chem: Generate.Gen2DFingerprint(
            chem.mol,
            Gobbi_Pharm2D.factory)
        distf = lambda x, y: 1.0 - DataStructs.FingerprintSimilarity(x, y)

        return (make_representation, distf)
    else:
            raise Exception('Unknown similarity measure: %s' % job.sim_measure)

def big_qs_iterator(qs, batch_size=1):
    num = qs.count()
    for start in range(0, num, batch_size):
        batch = qs[start:(start+batch_size)]
        for item in batch:
            yield item

__all__ = [
    'MethodSplitView',
    'load_mol',
    'memoize',
    'get_distance_func',
]
