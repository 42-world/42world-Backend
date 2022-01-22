import { Controller } from '@nestjs/common';
import { FtAuthService } from './ft-auth.service';
import { CreateFtAuthDto } from './dto/create-ft-auth.dto';
import { UpdateAuthenticateDto } from './dto/update-authenticate.dto';

@Controller('authenticate')
export class FtAuthController {
  constructor(private readonly ftAuthService: FtAuthService) {}

  // @Post()
  // create(@Body() CreateFtAuthDto: CreateFtAuthDto) {
  //   return this.authenticateService.create(CreateFtAuthDto);
  // }

  // @Get()
  // findAll() {
  //   return this.authenticateService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authenticateService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthenticateDto: UpdateAuthenticateDto) {
  //   return this.authenticateService.update(+id, updateAuthenticateDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authenticateService.remove(+id);
  // }
}
