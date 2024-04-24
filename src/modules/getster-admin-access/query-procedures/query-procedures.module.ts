import { Module } from '@nestjs/common';
import { QP_UploadFileMaster } from './qp_upload-file-master';

const procedure = [QP_UploadFileMaster];
@Module({
  providers: [...procedure],
  exports: [...procedure],
})
export class QueryProceduresModule {}
