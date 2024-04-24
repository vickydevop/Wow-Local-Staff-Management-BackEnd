import { ApiProperty } from '@nestjs/swagger';

export class treegetstercategory {
  @ApiProperty()
  category_ids: string[];
}
