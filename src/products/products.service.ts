import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductSlugAlreadyExistsError } from './errors';
import { NotFoundError } from 'src/common/errors';

@Injectable()
export class ProductsService {
  constructor(private prismaService: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    
    const existsProduct = await this.prismaService.product.findFirst({
      where:{
        slug: createProductDto.slug,
      }
    });

    if(existsProduct){
      throw new ProductSlugAlreadyExistsError(createProductDto.slug);
    }

    return this.prismaService.product.create({
      data: createProductDto,
    });

  }

  findAll(dto: {name?: string; page?: number; limit?: number}) {
    const {name, page = 1, limit = 10} = dto;

    return this.prismaService.product.findMany({
      ...(name && {
        where: {
          name: {contains: name}
        }
      }),
      skip: (page -1) * limit,
      take: limit,
    });
  }

  async findOne(id: string) {
    const existingProduct = await this.prismaService.product.findFirst({
      where:{
        id,
      }
    });

    if(!existingProduct){
      throw new NotFoundError('Product', id);
    }

    return existingProduct;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    let product = await this.prismaService.product.findFirst({
      where:{
        slug: updateProductDto.slug,
      }
    });

    if(product && product.id !== id){
      throw new ProductSlugAlreadyExistsError(updateProductDto.slug);
    }

    product = product && product.id === id 
      ? product : await this.prismaService.product.findFirst({
        where: {
          id
        }
      });

    if(!product){
      throw new NotFoundError('Product', id);
    }

    return this.prismaService.product.update({
      where: {
        id,
      },
      data: updateProductDto
    });
  }

  async remove(id: string) {
    const existingProduct = await this.prismaService.product.findFirst({
      where:{
        id,
      }
    });

    if(!existingProduct){
      throw new NotFoundError('Product', id);
    }

    return this.prismaService.product.delete(
      {
        where: {
          id,
        }
      }
    );
  }
}
