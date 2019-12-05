import json
import collections
import functools

from rdkit.Chem.rdmolfiles import MolToSmiles
from rdkit.Chem.Descriptors import ExactMolWt

from cspace.models import *
from cspace.utils.MethodSplitView import MethodSplitView

def memoize(f):
    memo = {}
    def helper(x):
        if x not in memo:            
            memo[x] = f(x)
        return memo[x]
    return helper

class memoize(object):
   '''Decorator. Caches a function's return value each time it is called.
   If called later with the same arguments, the cached value is returned
   (not reevaluated).
   '''
   def __init__(self, func):
      self.func = func
      self.cache = {}
   def __call__(self, *args):
      if not isinstance(args, collections.Hashable):
         # uncacheable. a list, for instance.
         # better to not cache than blow up.
         return self.func(*args)
      if args in self.cache:
         return self.cache[args]
      else:
         value = self.func(*args)
         self.cache[args] = value
         return value
   def __repr__(self):
      '''Return the function's docstring.'''
      return self.func.__doc__
   def __get__(self, obj, objtype):
      '''Support instance methods.'''
      return functools.partial(self.__call__, obj)

def get_mol_props_dict(mol):
    return dict(((n, mol.GetProp(n)) for n in mol.GetPropNames()))

def load_mol(mol, tag):
    smiles = MolToSmiles(mol)

    if Chemical.objects.filter(smiles=smiles).count():
        chem = Chemical.objects.get(smiles=smiles)
        chem.tags.add(tag)

        return -1

    props = get_mol_props_dict(mol)
    chem = Chemical(
        smiles=smiles,
        mol_weight=ExactMolWt(mol),
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
