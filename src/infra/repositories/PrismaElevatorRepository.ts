import { PrismaClient, Elevator as PrismaElevator } from '@prisma/client';
import { IElevatorRepository } from './IElevatorRepository';
import { Elevator, CreateElevatorDTO, UpdateElevatorDTO } from '../../domain';
import { ElevatorLocationType } from '../../domain/types';

export class PrismaElevatorRepository implements IElevatorRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  private toDomain(record: PrismaElevator): Elevator {
    return {
      id: record.id,
      location: {
        name: record.locationName,
        city: record.locationCity || undefined,
        country: record.locationCountry || undefined,
        type: record.locationType as ElevatorLocationType,
        address: record.locationAddress || undefined,
        coordinates: (record.locationLat !== null && record.locationLng !== null) ? {
            lat: record.locationLat,
            lng: record.locationLng
        } : undefined,
        technicalInfo: {
            brand: record.techBrand || undefined,
            model: record.techModel || undefined,
            year: record.techYear || undefined,
            maxLoad: record.techMaxLoad || undefined,
            maxPersons: record.techMaxPersons || undefined,
            floors: record.techFloors || undefined,
        }
      },
      speedMeasurement: {
        totalSeconds: record.speedTotalSeconds,
        floorsTraversed: record.speedFloors,
        secondsPerFloor: record.speedSecondsPerFloor,
      },
      rating: {
        speed: record.ratingSpeed,
        smoothness: record.ratingSmoothness,
        precision: record.ratingPrecision,
        noise: record.ratingNoise,
        lighting: record.ratingLighting,
        ventilation: record.ratingVentilation,
        spaciousness: record.ratingSpaciousness,
        cleanliness: record.ratingCleanliness,
        maintenance: record.ratingMaintenance,
        design: record.ratingDesign,
        technology: record.ratingTechnology,
        safety: record.ratingSafety,
        accessibility: record.ratingAccessibility,
      },
      overallScore: record.overallScore,
      notes: record.notes || undefined,
      dateVisited: record.dateVisited,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  async save(dto: CreateElevatorDTO): Promise<Elevator> {
    const ratings = [
        dto.rating.speed,
        dto.rating.smoothness,
        dto.rating.precision,
        dto.rating.noise,
        dto.rating.lighting,
        dto.rating.ventilation,
        dto.rating.spaciousness,
        dto.rating.cleanliness,
        dto.rating.maintenance,
        dto.rating.design,
        dto.rating.technology,
        dto.rating.safety,
        dto.rating.accessibility
    ];
    
    const overallScore = ratings.reduce((a, b) => a + b, 0) / ratings.length;

    const record = await this.prisma.elevator.create({
      data: {
        locationName: dto.location.name,
        locationCity: dto.location.city,
        locationCountry: dto.location.country,
        locationType: dto.location.type,
        locationAddress: dto.location.address,
        locationLat: dto.location.coordinates?.lat,
        locationLng: dto.location.coordinates?.lng,

        techBrand: dto.location.technicalInfo?.brand,
        techModel: dto.location.technicalInfo?.model,
        techYear: dto.location.technicalInfo?.year,
        techMaxLoad: dto.location.technicalInfo?.maxLoad,
        techMaxPersons: dto.location.technicalInfo?.maxPersons,
        techFloors: dto.location.technicalInfo?.floors,
        
        speedTotalSeconds: dto.speedMeasurement.totalSeconds,
        speedFloors: dto.speedMeasurement.floorsTraversed,
        speedSecondsPerFloor: dto.speedMeasurement.secondsPerFloor,

        ratingSpeed: dto.rating.speed,
        ratingSmoothness: dto.rating.smoothness,
        ratingPrecision: dto.rating.precision,
        ratingNoise: dto.rating.noise,
        ratingLighting: dto.rating.lighting,
        ratingVentilation: dto.rating.ventilation,
        ratingSpaciousness: dto.rating.spaciousness,
        ratingCleanliness: dto.rating.cleanliness,
        ratingMaintenance: dto.rating.maintenance,
        ratingDesign: dto.rating.design,
        ratingTechnology: dto.rating.technology,
        ratingSafety: dto.rating.safety,
        ratingAccessibility: dto.rating.accessibility,

        overallScore: overallScore,
        notes: dto.notes,
        dateVisited: dto.dateVisited || new Date(),
      },
    });

    return this.toDomain(record);
  }

  async findById(id: string): Promise<Elevator | null> {
    const record = await this.prisma.elevator.findUnique({
      where: { id },
    });
    return record ? this.toDomain(record) : null;
  }

  async findAll(): Promise<Elevator[]> {
    const records = await this.prisma.elevator.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return records.map(this.toDomain);
  }

  async update(id: string, dto: UpdateElevatorDTO): Promise<Elevator | null> {
    const current = await this.prisma.elevator.findUnique({ where: { id } });
    if (!current) return null;

    const data: any = {};

    if (dto.location) {
      if (dto.location.name !== undefined) data.locationName = dto.location.name;
      if (dto.location.city !== undefined) data.locationCity = dto.location.city;
      if (dto.location.country !== undefined) data.locationCountry = dto.location.country;
      if (dto.location.type !== undefined) data.locationType = dto.location.type;
      if (dto.location.address !== undefined) data.locationAddress = dto.location.address;
      if (dto.location.coordinates) {
          data.locationLat = dto.location.coordinates.lat;
          data.locationLng = dto.location.coordinates.lng;
      }
      if (dto.location.technicalInfo) {
          if (dto.location.technicalInfo.brand !== undefined) data.techBrand = dto.location.technicalInfo.brand;
          if (dto.location.technicalInfo.model !== undefined) data.techModel = dto.location.technicalInfo.model;
          if (dto.location.technicalInfo.year !== undefined) data.techYear = dto.location.technicalInfo.year;
          if (dto.location.technicalInfo.maxLoad !== undefined) data.techMaxLoad = dto.location.technicalInfo.maxLoad;
          if (dto.location.technicalInfo.maxPersons !== undefined) data.techMaxPersons = dto.location.technicalInfo.maxPersons;
          if (dto.location.technicalInfo.floors !== undefined) data.techFloors = dto.location.technicalInfo.floors;
      }
    }

    if (dto.speedMeasurement) {
      if (dto.speedMeasurement.totalSeconds !== undefined) data.speedTotalSeconds = dto.speedMeasurement.totalSeconds;
      if (dto.speedMeasurement.floorsTraversed !== undefined) data.speedFloors = dto.speedMeasurement.floorsTraversed;
      if (dto.speedMeasurement.secondsPerFloor !== undefined) data.speedSecondsPerFloor = dto.speedMeasurement.secondsPerFloor;
    }

    if (dto.rating) {
        if (dto.rating.speed !== undefined) data.ratingSpeed = dto.rating.speed;
        if (dto.rating.smoothness !== undefined) data.ratingSmoothness = dto.rating.smoothness;
        if (dto.rating.precision !== undefined) data.ratingPrecision = dto.rating.precision;
        if (dto.rating.noise !== undefined) data.ratingNoise = dto.rating.noise;
        if (dto.rating.lighting !== undefined) data.ratingLighting = dto.rating.lighting;
        if (dto.rating.ventilation !== undefined) data.ratingVentilation = dto.rating.ventilation;
        if (dto.rating.spaciousness !== undefined) data.ratingSpaciousness = dto.rating.spaciousness;
        if (dto.rating.cleanliness !== undefined) data.ratingCleanliness = dto.rating.cleanliness;
        if (dto.rating.maintenance !== undefined) data.ratingMaintenance = dto.rating.maintenance;
        if (dto.rating.design !== undefined) data.ratingDesign = dto.rating.design;
        if (dto.rating.technology !== undefined) data.ratingTechnology = dto.rating.technology;
        if (dto.rating.safety !== undefined) data.ratingSafety = dto.rating.safety;
        if (dto.rating.accessibility !== undefined) data.ratingAccessibility = dto.rating.accessibility;
    }

    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.dateVisited !== undefined) data.dateVisited = dto.dateVisited;

    const currentRatings = {
        speed: current.ratingSpeed,
        smoothness: current.ratingSmoothness,
        precision: current.ratingPrecision,
        noise: current.ratingNoise,
        lighting: current.ratingLighting,
        ventilation: current.ratingVentilation,
        spaciousness: current.ratingSpaciousness,
        cleanliness: current.ratingCleanliness,
        maintenance: current.ratingMaintenance,
        design: current.ratingDesign,
        technology: current.ratingTechnology,
        safety: current.ratingSafety,
        accessibility: current.ratingAccessibility,
    };

    const newRatings = { ...currentRatings, ...dto.rating };
    const hasRatingUpdate = Object.keys(data).some(k => k.startsWith('rating'));
    
    if (hasRatingUpdate) {
        const values = Object.values(newRatings);
        data.overallScore = values.reduce((a, b) => a + b, 0) / values.length;
    }

    const updated = await this.prisma.elevator.update({
      where: { id },
      data,
    });

    return this.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.elevator.delete({
        where: { id },
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  async findByCity(city: string): Promise<Elevator[]> {
    const records = await this.prisma.elevator.findMany({
      where: { locationCity: city },
    });
    return records.map(this.toDomain);
  }

  async findByType(type: string): Promise<Elevator[]> {
    const records = await this.prisma.elevator.findMany({
      where: { locationType: type },
    });
    return records.map(this.toDomain);
  }

  async findTopRated(limit: number): Promise<Elevator[]> {
    const records = await this.prisma.elevator.findMany({
      take: limit,
      orderBy: { overallScore: 'desc' },
    });
    return records.map(this.toDomain);
  }
}
