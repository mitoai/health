# Mito Health utility

This tool helps determine the whether different parts of the Mito ecosystem is up and running.


## Installation

Install this tool with npm:

```
npm i -g @mitoai/health
```

This installs the command `mithealth` on the path.

## Usage

The following commands are available

```
$ mithealth -h

  Usage: mithealth [options] [command]


  Options:

    -V, --version           output the version number
    -p --project <project>  Google Cloud project name. Defaults to "ntnu-smartmedia"
    -M --metric <metric>    Metric type can be "acked" or "undelivered". Defaults  to "undelivered"
    -h, --help              output usage information


  Commands:

    linreg [options] <subscriptionId>  Linear regression test on subscription
    sum [options] <subscriptionId>     Sum test on subscription

```

### Linear regression

We can test with linear regression over the number of messages in a given metric. If the curve is increasing
linearly with an R<sup>2</sup> value larger or equal to `-c`  over a sample period of `-m` 
minutes, it is assumed that the stream is unhealthy. If unhealthy, the program exits with code `1`.

```
$ mithealth linreg -h

  Usage: linreg [options] <subscriptionId>

  Linear regression test on subscription


  Options:

    -m --sampleMinutes <minutes>  Sample duration in minutes. Default is 20 minutes.
    -c --confidence <confidence>  Confidence for passing between 0 and 1. Default is 0.75.
    -h, --help                    output usage information

```


### Sum

Checking health based on the number of messages in a given metric. We can define upper and lower bounds,
if either is not fulfilled, the stream is declared unhealthy

```
$ mithealth sum -h

  Usage: sum [options] <subscriptionId>

  Sum test on subscription


  Options:

    -m --sampleMinutes <minutes>  Sample duration in minutes. Default is 20 minutes.
    -g --greaterThan <count>      The count that the sum of messages should exceed
    -l --lessThan <count>         The count that the sum of messages should be less than
    -h, --help                    output usage information
```
