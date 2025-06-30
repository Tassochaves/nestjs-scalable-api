import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductSlugAlreadyExistsError } from './errors';
import { NotFoundError } from 'src/common/errors';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

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

  async findAll(dto: {name?: string; page?: number; limit?: number}): Promise<PaginatedResult<any>> {
    const {name, page = 1, limit = 10} = dto;

    const whereConditions: any = {};

    if (name) {
      whereConditions.name = {
        contains: name,
        //mode: 'insensitive'
      };
    }

    const products = await this.prismaService.product.findMany({
      where: whereConditions,
      skip: (page -1) * limit,
      take: limit,
      // orderBy: {
      //   name: 'asc',
      // }
    });

    const totalProducts = await this.prismaService.product.count({
      where: whereConditions,
    });

    const totalPages = Math.ceil(totalProducts / limit);

    return {
      data: products,
      total: totalProducts,
      page: page,
      limit: limit,
      totalPages: totalPages
    }
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
