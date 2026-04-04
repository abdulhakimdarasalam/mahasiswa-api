import {
  Controller,
  Body,
  Get,
  Post,
  Put,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { MahasiswaService } from './mahasiswa.service';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import { MahasiswaResponseDto } from './dto/mahasiswa-response.dto';
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('mahasiswa')
@Controller('mahasiswa')
export class MahasiswaController {
  constructor(private readonly mahasiswaService: MahasiswaService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ description: 'Mahasiswa created successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Create Mahasiswa' })
  async create(@Body() createMahasiswaDto: CreateMahasiswaDto) {
    return this.mahasiswaService.create(createMahasiswaDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Mahasiswa created successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Get all Mahasiswa' })
  async findAll() {
    return this.mahasiswaService.findAll();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Mahasiswa updated successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Update Mahasiswa' })
  async update(
    @Param('id') id: number,
    @Body() updateMahasiswaDto: CreateMahasiswaDto,
  ) {
    return this.mahasiswaService.update(id, updateMahasiswaDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({ description: 'Mahasiswa deleted successfully' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @ApiOperation({ summary: 'Delete Mahasiswa' })
  async delete(@Param('id') id: number) {
    return this.mahasiswaService.delete(id);
  }
}
