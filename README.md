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

Using linear regression over the number of undelivered messages. If the curve is increasing
linearly with an R<sup>2</sup> value larger or equal to `-c`  over a sample period of `-m` 
minutes, it is assumed that the stream is unhealthy. If unhealthy, the program exits with code `1`.

```
$ mithealth pubsub --help

  Usage: pubsub [options] <subscriptionId>

  Check pubsub subscription health


  Options:

    -m --sampleMinutes <minutes>  Sample duration in minutes. Default is 20 minutes.
    -c --confidence <confidence>  Confidence for passing between 0 and 1. Default is 0.75
    -p --project <project>        Google Cloud project name. Defaults to "ntnu-smartmedia"
    -h, --help                    output usage information
```
