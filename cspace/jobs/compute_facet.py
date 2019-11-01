import json

import numpy as np
from rdkit import Chem, DataStructs
from sklearn import manifold

from django.db import transaction

from cspace.models import *

class ComputeFacet():
    @transaction.atomic
    def compute(save, job, reraise=False):
        job.status = 1
        job.save()

        try:
            save._compute(job)
            job.status = 2
            job.save()
        except:
            job.status = -1
            job.save()

            if reraise:
                raise

    def _compute(save, job):
        print('here')
        chem_set = job.chemical_set
        chems = chem_set.chemical_set.all().order_by('-id')

        if job.sim_measure == 'RDK/T':
            make_representation = (
                lambda chem: Chem.RDKFingerprint(chem.get_mol())
            )
            distf = DataStructs.FingerprintSimilarity
        else:
            raise Exception('Unknown similarity measure: %s' % job.sim_measure)

        representations = [make_representation(chem) for chem in chems]

        n = len(chems)
        dist_mat = [[None] * n for _ in range(n)]

        for i in range(n):
            for j in range(i, n):
                dist = distf(representations[i], representations[j])
                dist_mat[i][j] = dist
                dist_mat[j][i] = dist

        if job.embedding == '3/RDK/MDS':
            mds = manifold.MDS(
                n_components=3,
                dissimilarity='precomputed',
                verbose=1,
                max_iter=1000
            )
            embedf = lambda d: mds.fit(np.array(d)).embedding_
        else:
            raise Exception('Unknown embedding: %s' % job.embedding)

        embedding = embedf(dist_mat)

        facet = ChemicalSetFacet.objects.create(
            name='%s: %s | %s' % (
                job.chemical_set.name,
                job.sim_measure,
                job.embedding
            ),
            sim_measure = job.sim_measure,
            embedding = job.embedding,
            chemical_set = job.chemical_set,
            dist_json=json.dumps(dist_mat),
            chem_ids_json=json.dumps([c.id for c in chems])
        )

        for i, chem in enumerate(chems):
            EmbeddedChemical.objects.create(
                chemical=chem,
                facet=facet,
                position=json.dumps(embedding[i].tolist())
            )

        job.facet = facet
        job.save()
