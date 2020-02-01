# Chemical Space (cspace)

Visualize spaces of embedded chemicals.

![UI Example](https://github.com/Lanny/cspace/blob/master/paper/img/ui-example.png?raw=true)

See a live version at http://cspace.lannysport.net/

# Installation / Setup

The project is a standard python/django project. You can get _almost_ all the dependencies from:

```
pip install -r requirements.txt
```

## RDKit
The exception is rdkit, which for "reasons" has to come from your OS's package manager or equivalent. To make sure that rdkit uses the same numpy as cspace, install from requirements.txt before installing rdkit.

### OSX

If you haven't already, you'll need to install the Xcode command line tools. This is done with:

```
xcode-select --install
```

Then set up [homebrew](https://brew.sh/). Then it's as simple as:

```
brew tap rdkit/rdkit
brew install rdkit --with-postgresql --with-python3 --without-numpy
```

### Debian based Linux

```
sudo apt-get install python-rdkit librdkit1 rdkit-data
```

### Others

See [here](http://www.rdkit.org/docs/Install.html). Be forewarned, building from source on windows is pain.

## Space Viewer

The UI code for visualizing chemical spaces is built separately and lives in the `space-viewer` directory. To install deps and build just:

```
npm install
npm run build
```

It will drop a bundled file into `cspace/static/js` and you're good to go. When editing use

```
npm run watch
```

To automatically rebuild on changes in the source tree.

# Running CSpace

For development, the webserver can be invoked like so:

```
./manage.py runserver
```

Processing of jobs needs to happen outside the request response cycle. Ultimately this should be through something like AMQP, but in the interest of simplifying setup you can run all the pending jobs with

```
./manage.py run_pending_jobs
```

You can run this as a cron job (it has logic to avoid situations like double-runs) or with the simple `watch_jobs.sh` file included.
