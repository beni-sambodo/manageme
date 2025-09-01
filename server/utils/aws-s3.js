import { S3 } from '@aws-sdk/client-s3'
import { S3_CONFIG } from '../config/const.config.js'

const s3 = new S3(S3_CONFIG)
export default s3
