import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './models/organization.model';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectModel(Organization)
    private organizationModel: typeof Organization,
  ) {}

  async create(userId: number, createOrganizationDto: CreateOrganizationDto) {
    const { name } = createOrganizationDto;

    const organization = await this.findByName(name);
    if (organization)
      throw new BadRequestException('Organization that name already exists!');

    await this.organizationModel.create({
      ...createOrganizationDto,
      created_by: userId,
    });

    const response = { message: 'New Organization created successfully!' };
    return response;
  }

  async findAll() {
    const organizations = await this.organizationModel.findAll({
      include: { all: true },
    });
    if (!organizations) throw new NotFoundException('No any Organizations');

    const response = { organizations, message: 'All Organizations' };
    return response;
  }

  async findOne(id: number) {
    const organization = await this.findById(id);
    if (!organization) throw new NotFoundException('Organization Not Found');

    const response = { organization, message: 'Organization Information' };
    return response;
  }

  async update(id: number, updateOrganizationDto: UpdateOrganizationDto) {
    const organization = await this.findById(id);
    if (!organization) throw new NotFoundException('Organization not found');

    await this.organizationModel.update(
      { ...updateOrganizationDto },
      { where: { id }, returning: true },
    );

    const response = {
      message: 'Organization information updated successfully!',
    };
    return response;
  }

  async remove(id: number) {
    const organization = await this.findById(id);
    if (!organization) throw new NotFoundException('Organization not found');
    await this.organizationModel.destroy({ where: { id } });

    const response = { message: `Organization with that #${id} id removed` };
    return response;
  }

  async findById(id: number): Promise<Organization | null> {
    return await this.organizationModel.findOne({
      where: { id },
      include: { all: true },
    });
  }

  async findByName(name: string): Promise<Organization | null> {
    return await this.organizationModel.findOne({
      where: { name },
      include: { all: true },
    });
  }
}
