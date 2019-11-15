#!/bin/bash

while [ 1 ];
do
  ./manage.py run_pending_jobs
  sleep 3
done
