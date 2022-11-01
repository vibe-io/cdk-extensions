# AWS Glue Library

The `@cdk-extensions/glue` module contains configurations for AWS Glue.

```ts nofixture
import * as glue from 'cdk-extensions/glue';
```

## Objective

The Glue module is used to consolidate data from multiple different sources into a single location to simplify analysis and review. It provides the ability to discover and organize data from a wide variety of sources; tranform, prepare and clean that data for analysis; and the creation of data pipelines to deliver the prepared data for storage and analysis and monitor the process. 

The AWS Glue Catalog is used to orchestrate the operation based on using metadata stored in its tables which define the sources and targets it should operate on. Crawlers are added to the Glue Catalog which allow access to the data sources and target, providing information on data changes which need to be acted upon. Jobs are then configured to perform the transformation of that data for delivery to its target location. Scheduling of these jobs can then be configured to either run at specific times, based off of triggering events or performed manually. 

## Important Constructs

### Catalog

The Catalog construct defines the Glue Catalog that will hold metadata and act as the source for orchestrating all Glue Jobs

### Table

The Table construct holds the table definition within the Glue Catalog which contains the necessary metadata for performing Glue jobs

### Crawler

The Crawler construct contains the information defining a source of data, including the necessary information or credentials to reach and access it. 

### Jobs

The Jobs construct contains the instructions to perform transformation and delivery of the crawled data.

### Trigger

The Trigger construct defines what triggers should be used to run a particular job.

### Workflow

The Workflow construct contains a collection of Triggers and Jobs to link together a set of processes into a complete data pipeline. 