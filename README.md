# Mito Health utility

This tool helps determine the whether different parts of the Mito ecosystem is up and running.


## Installation

Install this tool with npm:

```
npn i -g @mito/health
```

This installs the command `mithealth` on the path.

## Usage

The following commands are available

```
$ mithealth --help

  Usage: cli [options] [command]


  Options:

    -V, --version  output the version number
    -h, --help     output usage information


  Commands:

    pubsub [options] <subscriptionId>  Check pubsub subscription health

```

### Pubsub

```
$ mithealth pubsub --help

  Usage: pubsub [options] <subscriptionId>

  Check pubsub subscription health


  Options:

    -m --sampleMinutes <minutes>  Sample duration in minutes. Default is 20 minutes.
    -c --confidence <confidence>  Confidence for passing between 0 and 1. Default is 0.75
    -h, --help                    output usage information
```
