import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';
import { CreateAuthenticateDto } from './dto/create-authenticate.dto';
import { UpdateAuthenticateDto } from './dto/update-authenticate.dto';

@Controller('authenticate')
export class AuthenticateController {
  constructor(private readonly authenticateService: AuthenticateService) {}

  // @Post()
  // create(@Body() createAuthenticateDto: CreateAuthenticateDto) {
  //   return this.authenticateService.create(createAuthenticateDto);
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
