# Chemical Space (cspace)

Visualize spaces of embedded chemicals.

# Installation / Setup

The project is a standard python/django project. You can get _almost_ all the dependencies from:

```
pip install -r requirements.txt
```

The exception is rdkit, which for "reasons" has to come from your OS's package manager or equivalent. To make sure that rdkit uses the same numpy as cspace, install from requirements.txt before installing rdkit.

## OSX

If you haven't already, you'll need to install the Xcode command line tools. This is done with:

```
xcode-select --install
```

Then set up [homebrew](https://brew.sh/). Then it's as simple as:

```
brew tap rdkit/rdkit
brew install rdkit --with-postgresql --with-python3 --without-numpy
```

## Debian based Linux

```
sudo apt-get install python-rdkit librdkit1 rdkit-data
```

## Others

See [here](http://www.rdkit.org/docs/Install.html). Be forewarned, building from source on windows is pain.
