import json
import traceback
import os

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from cspace.jobs.compute_facet import ComputeFacet
from cspace.models import *

LOCK_FILE = 'cspace_runner.pid'

class Command(BaseCommand):
    help = 'Run any pending jobs, ensuring no double runs.'

    def handle(self, *args, **options):
        try:
            fd = os.open(LOCK_FILE, os.O_WRONLY | os.O_CREAT | os.O_EXCL)
            f = os.fdopen(fd, "w")
            f.write('%d' % os.getpid())
            f.flush()

            self._run_jobs()

            f.close()
            os.unlink(LOCK_FILE)

        except OSError:
            self.stderr.write(self.style.WARNING(
                'Lock file %s already held, exiting.' % LOCK_FILE
            ))

    def _run_jobs(self):
        pending_jobs = ComputeFacetJob.objects.filter(status=0)


        if len(pending_jobs) == 0:
            self.stderr.write(self.style.WARNING(
                'No pending jobs found. Exiting without doing anything.'
            ))
            return

        self.stderr.write(self.style.SUCCESS(
            'Found %d pending jobs. Starting execution' % len(pending_jobs)
        ))

        completed = 0
        failed = 0

        for job in pending_jobs:
            try:
                cf = ComputeFacet()
                cf.compute(job, reraise=True)
                completed += 1
            except Exception as e:
                tb = traceback.format_exc()
                self.stderr.write(self.style.ERROR(
                    (
                        'Error encountered when running job %s, continuing '
                        'with pipeline. Exception was:\n\n%s'
                    ) % (str(job), tb)
                ))
                failed += 1

        style = getattr(self.style, 'WARNING' if failed else 'SUCCESS')
        self.stderr.write(style(
            'Completed %d jobs, failed %d.' % (completed, failed)
        ))

