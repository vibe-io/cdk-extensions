import { Bucket, BucketEncryption, IBucket } from "aws-cdk-lib/aws-s3";
import { Asset } from "aws-cdk-lib/aws-s3-assets";
import { IConstruct } from "constructs";
import { IDocumentAttachment } from "./document-attachment-ref";
import { BucketDeployment, Source } from "aws-cdk-lib/aws-s3-deployment";
import { Lazy } from "aws-cdk-lib";
import { IDocument } from "../document-base";
import { nextAvailableId } from "../../utils/tree";

import path = require("path");


export interface AssetFileAttachmentProps {
  readonly attachmentName: string;
  readonly path: string;
}

export interface DirectoryUploadAttachmentProps {
  readonly attachmentName: string;
  readonly bucket?: IBucket;
  readonly path: string;
  readonly prefix?: string;
}

export interface DocumentReferenceAttachmentProps {
  readonly attachmentName?: string;
  readonly fileName: string;
  readonly source: IDocument;
  readonly version: string;
}

export interface S3DirectoryAttachmentProps {
  readonly attachmentName: string;
  readonly bucket: IBucket;
  readonly path?: string;
}

export interface S3FileAttachmentProps {
  readonly attachmentName: string;
  readonly bucket: IBucket;
  readonly key: string;
}

export class DocumentAttachment {
  public static fromAssetFile(props: AssetFileAttachmentProps): IDocumentAttachment {
    return {
      bind: (scope: IConstruct) => {
        const assetId = nextAvailableId(scope, 'document-attachment-asset');

        const asset = new Asset(scope, assetId, {
          path: path.join(__dirname, props.path),
        });

        return {
          configuration: {
            key: 'S3FileUrl',
            name: props.attachmentName ?? path.basename(props.path),
            values: [
              asset.s3ObjectUrl,
            ],
          }
        };
      }
    };
  }

  public static fromDirectoryUpload(props: DirectoryUploadAttachmentProps): IDocumentAttachment {
    return {
      bind: (scope: IConstruct) => {
        const bucketId = 'document-attachments-bucket';
        const bucket = props.bucket ?? scope.node.tryFindChild(bucketId) as IBucket ?? new Bucket(scope, bucketId, {
          blockPublicAccess: {
            blockPublicAcls: true,
            blockPublicPolicy: true,
            ignorePublicAcls: true,
            restrictPublicBuckets: true,
          },
          encryption: BucketEncryption.S3_MANAGED,
          versioned: true,
        });

        let idx = 0;
        let deploymentId = `document-attachment-deployment-${idx++}`;
        while (scope.node.tryFindChild(deploymentId)) {
          deploymentId = `document-attachment-deployment-${idx++}`;
        }

        const prefix = props.prefix ?? Lazy.string({
          produce: () => {
            return `${scope.node.findChild(deploymentId).node.addr}/`;
          }
        });

        const deployment = new BucketDeployment(scope, deploymentId, {
          destinationBucket: bucket,
          destinationKeyPrefix: prefix,
          extract: true,
          sources: [
            Source.asset(props.path)
          ],
        });

        return {
          attachmentAvailable: deployment,
          configuration: {
            key: 'SourceUrl',
            name: props.attachmentName,
            values: [
              `s3://${bucket.bucketName}/${prefix}`,
            ]
          }
        }
      }
    }
  }

  public static fromDocumentReference(props: DocumentReferenceAttachmentProps): IDocumentAttachment {
    return {
      bind: (_scope: IConstruct) => {
        return {
          configuration: {
            key: 'AttachmentReference',
            name: props.attachmentName ?? props.fileName,
            values: [
              `${props.source.documentArn}/${props.version}/${props.fileName}`,
            ],
          }
        };
      }
    };
  }

  public static fromS3Directory(props: S3DirectoryAttachmentProps): IDocumentAttachment {
    return {
      bind: (_scope: IConstruct) => {
        return {
          configuration: {
            key: 'SourceUrl',
            name: props.attachmentName,
            values: [
              `s3://${props.bucket.bucketName}/${props.path ?? ''}`,
            ]
          }
        };
      }
    };
  }

  public static fromS3File(props: S3FileAttachmentProps): IDocumentAttachment {
    return {
      bind: (_scope: IConstruct) => {
        return {
          configuration: {
            key: 'S3FileUrl',
            name: props.attachmentName,
            values: [
              `s3://${props.bucket.bucketName}/${props.key}`,
            ]
          }
        };
      }
    };
  }
}